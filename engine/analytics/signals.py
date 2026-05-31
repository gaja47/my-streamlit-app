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
"""
from dataclasses import dataclass
from collections import deque
from typing import Optional
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
