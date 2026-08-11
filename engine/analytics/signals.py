"""
analytics.py — derives order-flow signals from the reconstructed book.

EXACT signals (from depth only):
  - multi-band imbalance
  - absorption (resting qty holding while price stalls)
  - liquidity walls / pulls

APPROXIMATE signals (inferred — clearly flagged):
  - aggressor side & CVD proxy, derived from depth deltas at the touch
    combined with LTQ. This is NOT true tape. When Fyers ships per-trade
    data, replace `infer_trade_from_delta` with the real trade stream and
    every downstream number becomes exact with no other change.
  - volume profile / POC / value area / VWAP. These need volume *at a price*,
    which we only get batched (LTP + LTQ or VTT per packet), so a batch that
    spans several prices is booked entirely at the last traded price. Feed
    `VolumeTracker` the cumulative VTT where available — the VTT delta is the
    true traded volume for the interval, which removes the double-counting
    error and leaves only the price-attribution approximation.
"""
import math
from dataclasses import dataclass
from collections import deque
from typing import Dict, List, Optional, Tuple
from order_book import OrderBook


@dataclass
class Imbalance:
    band: int          # how many levels deep
    bid_qty: int
    ask_qty: int
    ratio: float       # bid/(bid+ask), 0.5 = balanced


def imbalance(book: OrderBook, bands=(5, 10, 20, 50)):
    out = []
    bids, asks = book.top(max(bands))
    for n in bands:
        bq = sum(l.qty for l in bids[:n])
        aq = sum(l.qty for l in asks[:n])
        tot = bq + aq
        ratio = bq / tot if tot else 0.5
        out.append(Imbalance(n, bq, aq, round(ratio, 3)))
    return out


class CVDProxy:
    """
    Approximate cumulative volume delta.

    Heuristic: when the traded price (LTP) is at/above the prevailing best ask,
    treat LTQ as aggressive BUY; at/below best bid, aggressive SELL. This is the
    standard 'tick rule' fallback when true aggressor flags are unavailable.
    APPROXIMATE — batched updates mean some prints are missed or merged.
    """
    def __init__(self):
        self.cvd = 0
        self.prev_ltp: Optional[float] = None

    def update(self, ltp: float, ltq: int, best_bid: float, best_ask: float) -> int:
        if ltq <= 0 or ltp is None:
            return self.cvd
        if best_ask is not None and ltp >= best_ask:
            self.cvd += ltq          # aggressive buy
        elif best_bid is not None and ltp <= best_bid:
            self.cvd -= ltq          # aggressive sell
        else:
            # inside spread: use tick direction as last resort
            if self.prev_ltp is not None:
                self.cvd += ltq if ltp >= self.prev_ltp else -ltq
        self.prev_ltp = ltp
        return self.cvd


class AbsorptionDetector:
    """
    Flags when a large resting level keeps getting refilled while price fails
    to move through it — a sign of a strong passive participant absorbing flow.
    Uses depth only, so this signal is EXACT.
    """
    def __init__(self, window=50, refill_threshold=3):
        self.history = deque(maxlen=window)
        self.refill_threshold = refill_threshold

    def update(self, book: OrderBook):
        bb, ba = book.best_bid_ask()
        self.history.append((book.last_update_ts, bb, ba,
                             book.bids.get(bb).qty if bb in book.bids else 0,
                             book.asks.get(ba).qty if ba in book.asks else 0))
        if len(self.history) < self.refill_threshold:
            return None
        recent = list(self.history)[-self.refill_threshold:]
        # price pinned at same best bid but qty keeps refilling -> bid absorption
        if len({r[1] for r in recent}) == 1 and all(r[3] > 0 for r in recent):
            return {"side": "bid", "price": recent[-1][1], "type": "absorption"}
        if len({r[2] for r in recent}) == 1 and all(r[4] > 0 for r in recent):
            return {"side": "ask", "price": recent[-1][2], "type": "absorption"}
        return None


class VolumeTracker:
    """
    Turns a batched feed into a per-packet traded-volume increment.

    Fyers sends LTQ (last traded qty) and VTT (volume traded today) on depth
    packets, both batched. Naively adding LTQ on every packet double-counts,
    because the same LTQ is repeated on depth updates where nothing traded.

    Preferred path: pass `vtt`. Its delta since the previous packet is the exact
    volume traded in the interval. Fallback path (vtt is None): add LTQ only
    when the (ltp, ltq) pair changes, which suppresses the obvious repeats but
    still misses two identical consecutive prints. APPROXIMATE either way at the
    price-attribution level — see the module docstring.
    """
    def __init__(self):
        self.prev_vtt: Optional[int] = None
        self.prev_print: Optional[Tuple[float, int]] = None

    def increment(self, ltp: float, ltq: int, vtt: Optional[int] = None) -> int:
        """Volume traded since the previous packet. Never negative."""
        if vtt is not None:
            prev, self.prev_vtt = self.prev_vtt, vtt
            if prev is None:
                return 0          # first packet only seeds the baseline
            return max(vtt - prev, 0)
        if ltp is None or ltq is None or ltq <= 0:
            return 0
        this_print = (ltp, ltq)
        if this_print == self.prev_print:
            return 0              # repeated print on a depth-only update
        self.prev_print = this_print
        return ltq


@dataclass
class ProfileLevel:
    price: float
    volume: int


class VolumeProfile:
    """
    Volume traded per price bucket, with POC and value area.

    APPROXIMATE — volume is booked at the last traded price of each batch (see
    module docstring). The shape is reliable; the per-bucket numbers are not
    exact. Label it APPROX in the UI.

    `tick_size` should match the instrument (0.05 for NSE index futures).
    """
    def __init__(self, tick_size: float = 0.05, value_area_pct: float = 0.70):
        if tick_size <= 0:
            raise ValueError("tick_size must be positive")
        self.tick_size = tick_size
        self.value_area_pct = value_area_pct
        self.buckets: Dict[float, int] = {}
        self.total_volume = 0
        self._sorted: Optional[List[ProfileLevel]] = None

    def _bucket(self, price: float) -> float:
        # round to the tick grid, then to a clean float so dict keys collide
        return round(round(price / self.tick_size) * self.tick_size, 10)

    def update(self, ltp: float, volume: int) -> None:
        if ltp is None or volume is None or volume <= 0:
            return
        b = self._bucket(ltp)
        self.buckets[b] = self.buckets.get(b, 0) + volume
        self.total_volume += volume
        self._sorted = None       # invalidate the cached histogram

    def histogram(self) -> List[ProfileLevel]:
        """
        All buckets, price ascending. Cached until the next `update`, because
        the recorder reads the profile on every packet while most packets carry
        no new volume — re-sorting each one would dominate the hot path.
        """
        if self._sorted is None:
            self._sorted = [ProfileLevel(p, q) for p, q in sorted(self.buckets.items())]
        return self._sorted

    def poc(self) -> Optional[float]:
        """Point of control — highest-volume price. Ties break to the lower price."""
        if not self.buckets:
            return None
        return min(self.buckets, key=lambda p: (-self.buckets[p], p))

    def value_area(self) -> Optional[Tuple[float, float]]:
        """
        (VAL, VAH) — the contiguous band around the POC holding
        `value_area_pct` of total volume. Standard Market Profile expansion:
        step outward from the POC, always taking the heavier neighbour.
        """
        if not self.buckets:
            return None
        rows = self.histogram()
        prices = [r.price for r in rows]
        vols = [r.volume for r in rows]
        target = self.total_volume * self.value_area_pct
        lo = hi = prices.index(self.poc())
        acc = vols[lo]
        while acc < target and (lo > 0 or hi < len(rows) - 1):
            below = vols[lo - 1] if lo > 0 else None
            above = vols[hi + 1] if hi < len(rows) - 1 else None
            if below is None or (above is not None and above >= below):
                hi += 1
                acc += above
            else:
                lo -= 1
                acc += below
        return prices[lo], prices[hi]

    def nodes(self, threshold: float = 1.5) -> Tuple[List[float], List[float]]:
        """
        (HVN, LVN) — buckets whose volume is `threshold`x above / below the mean
        bucket volume. High-volume nodes are acceptance, low-volume nodes are
        rejection and tend to act as fast-travel zones.
        """
        if not self.buckets:
            return [], []
        rows = self.histogram()
        mean = self.total_volume / len(rows)
        hvn = [r.price for r in rows if r.volume >= mean * threshold]
        lvn = [r.price for r in rows if r.volume <= mean / threshold]
        return hvn, lvn


class VWAP:
    """
    Volume-weighted average price with standard-deviation bands.

    APPROXIMATE for the same reason as VolumeProfile — it consumes the same
    batched price/volume pairs.

    Call `reset()` to anchor: at the session open for session VWAP, or at any
    swing high/low / news bar for an anchored VWAP.
    """
    def __init__(self, band_multiples: Tuple[float, ...] = (1.0, 2.0)):
        self.band_multiples = band_multiples
        self.reset()

    def reset(self) -> None:
        self._pv = 0.0    # sum(price * volume)
        self._pv2 = 0.0   # sum(price^2 * volume)
        self._v = 0       # sum(volume)

    def update(self, ltp: float, volume: int) -> Optional[float]:
        if ltp is None or volume is None or volume <= 0:
            return self.value
        self._pv += ltp * volume
        self._pv2 += ltp * ltp * volume
        self._v += volume
        return self.value

    @property
    def value(self) -> Optional[float]:
        if self._v <= 0:
            return None
        return self._pv / self._v

    @property
    def volume(self) -> int:
        return self._v

    @property
    def std_dev(self) -> Optional[float]:
        """Volume-weighted standard deviation of price around the VWAP."""
        vwap = self.value
        if vwap is None:
            return None
        variance = self._pv2 / self._v - vwap * vwap
        return math.sqrt(max(variance, 0.0))

    def bands(self) -> List[Tuple[float, float, float]]:
        """[(multiple, lower, upper), ...] — one entry per configured multiple."""
        vwap, sd = self.value, self.std_dev
        if vwap is None or sd is None:
            return []
        return [(m, vwap - m * sd, vwap + m * sd) for m in self.band_multiples]
