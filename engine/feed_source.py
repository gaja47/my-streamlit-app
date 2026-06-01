"""
feed_source.py — THE adapter boundary between a Fyers depth feed and the engine.

There is exactly ONE integration point to reach live data: a feed source must
call its `on_depth` handler for every depth event, with this signature:

    on_depth(symbol: str,
             is_snapshot: bool,
             bids: list[dict],   # [{'price': float, 'qty': int, 'orders': int}, ...]
             asks: list[dict],
             ltp: float,         # last traded price (batched on Fyers)
             ltq: int,           # last traded qty   (batched on Fyers)
             ts: float)          # event timestamp (epoch seconds)

- SimulatedFeedSource runs the whole engine end-to-end with NO credentials, so
  you can deploy + smoke-test the systemd service and frontend immediately.
- OpticoreFeedSource is the real path: opticore already runs a working live
  Fyers feed, so we subscribe to it and translate its depth events into
  on_depth(...) calls — no protobuf decoding needed here.
"""
import math
import random
import time
from typing import Callable, Dict, List

DepthHandler = Callable[[str, bool, List[Dict], List[Dict], float, int, float], None]


class FeedSource:
    def __init__(self, symbols: List[str], on_depth: DepthHandler):
        self.symbols = symbols
        self.on_depth = on_depth

    def run(self) -> None:  # blocking
        raise NotImplementedError


class SimulatedFeedSource(FeedSource):
    """Synthetic 50-level book around a random-walk mid. No credentials needed."""

    TICK = 0.05
    LEVELS = 24

    def run(self) -> None:
        mids = {s: 24000.0 for s in self.symbols}
        while True:
            for s in self.symbols:
                mids[s] += (random.random() - 0.5) * self.TICK * 4
                m = round(mids[s] / self.TICK) * self.TICK
                bids, asks = [], []
                for i in range(self.LEVELS):
                    base = max(0.0, 600 * math.exp(-i / 8) + (random.random() - 0.4) * 200)
                    wall = random.random() < 0.06 and random.random() * 1800 or 0
                    bids.append({"price": round(m - self.TICK * (i + 1), 2), "qty": int(base + wall), "orders": 0})
                    base2 = max(0.0, 600 * math.exp(-i / 8) + (random.random() - 0.4) * 200)
                    wall2 = random.random() < 0.06 and random.random() * 1800 or 0
                    asks.append({"price": round(m + self.TICK * (i + 1), 2), "qty": int(base2 + wall2), "orders": 0})
                ltq = int(random.random() * 150)
                self.on_depth(s, True, bids, asks, m, ltq, time.time())
            time.sleep(0.2)


class OpticoreFeedSource(FeedSource):
    """
    Reuse opticore's already-working live Fyers feed.

    INTEGRATION POINT — wire opticore here. Opticore holds the Fyers credentials
    and the working depth decoder, so this class should NOT re-implement either.
    Depending on how opticore exposes its feed, do ONE of:

      (a) IPC subscribe (preferred, fully decoupled): opticore publishes depth
          frames on Redis pub/sub / ZeroMQ / a local websocket. Connect to
          OPTICORE_FEED_URL, and for each message translate it to on_depth(...).

      (b) In-process import: add opticore to PYTHONPATH (OPTICORE_PYTHONPATH),
          import its feed client, register a callback that calls on_depth(...).

    Either way, the only contract is: per depth event, call
        self.on_depth(symbol, is_snapshot, bids, asks, ltp, ltq, ts)
    with bids/asks as [{'price','qty','orders'}].
    """

    def run(self) -> None:
        raise NotImplementedError(
            "OpticoreFeedSource is not wired yet. Share opticore's feed interface "
            "(how it exposes depth — Redis/ZMQ/WS topic + message shape, or its "
            "Python feed-client API) and this becomes a thin translation to "
            "self.on_depth(...). Until then run with FEED_SOURCE=sim."
        )
