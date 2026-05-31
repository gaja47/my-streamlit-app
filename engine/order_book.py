"""
order_book.py — reconstructs and maintains a 50-level book per symbol
from Fyers Versova snapshot + differential updates.

The Versova feed sends a full snapshot on subscribe, then diffs. We mirror
that: seed on snapshot, apply diffs, and expose a clean depth matrix for
analytics + heatmap.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Tuple
import time


@dataclass
class Level:
    price: float
    qty: int
    orders: int = 0  # number of orders at this level, if provided


@dataclass
class OrderBook:
    symbol: str
    bids: Dict[float, Level] = field(default_factory=dict)  # price -> Level
    asks: Dict[float, Level] = field(default_factory=dict)
    last_update_ts: float = 0.0
    seq: int = 0

    # ---- ingest ---------------------------------------------------------
    def apply_snapshot(self, bids: List[dict], asks: List[dict], ts: float):
        """Full reset from a snapshot packet."""
        self.bids = {b["price"]: Level(b["price"], b["qty"], b.get("orders", 0))
                     for b in bids}
        self.asks = {a["price"]: Level(a["price"], a["qty"], a.get("orders", 0))
                     for a in asks}
        self.last_update_ts = ts

    def apply_diff(self, side: str, price: float, qty: int, orders: int, ts: float):
        """Apply a single differential update. qty==0 removes the level."""
        book = self.bids if side == "bid" else self.asks
        if qty == 0:
            book.pop(price, None)
        else:
            book[price] = Level(price, qty, orders)
        self.last_update_ts = ts
        self.seq += 1

    # ---- views ----------------------------------------------------------
    def top(self, n: int = 50) -> Tuple[List[Level], List[Level]]:
        bids = sorted(self.bids.values(), key=lambda l: -l.price)[:n]
        asks = sorted(self.asks.values(), key=lambda l: l.price)[:n]
        return bids, asks

    def best_bid_ask(self):
        bids, asks = self.top(1)
        bb = bids[0].price if bids else None
        ba = asks[0].price if asks else None
        return bb, ba

    def mid(self):
        bb, ba = self.best_bid_ask()
        if bb is None or ba is None:
            return None
        return (bb + ba) / 2.0
