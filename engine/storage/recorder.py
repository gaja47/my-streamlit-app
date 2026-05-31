"""
recorder.py — capture-only persistence (STEP 1 of the build).

Writes every book state + analytics row to Parquet, partitioned by date and
symbol. This is the foundation: before any UI, you bank clean data so you can
replay it offline and validate whether the signals have edge on YOUR
instruments. Costs nothing, risks nothing live.
"""
import os
import time
import pyarrow as pa
import pyarrow.parquet as pq
from datetime import datetime


class DepthRecorder:
    def __init__(self, out_dir="data", flush_every=2000):
        self.out_dir = out_dir
        self.flush_every = flush_every
        self.buffer = []
        os.makedirs(out_dir, exist_ok=True)

    def record(self, symbol, ts, bids, asks, cvd, imb, absorb):
        """One row = one book state with its derived signals."""
        row = {
            "ts": ts,
            "symbol": symbol,
            # flatten top-5 each side for compact storage; full book in 'depth'
            "bid_px": [l.price for l in bids[:50]],
            "bid_qty": [l.qty for l in bids[:50]],
            "ask_px": [l.price for l in asks[:50]],
            "ask_qty": [l.qty for l in asks[:50]],
            "cvd": cvd,
            "imb5": imb[0].ratio if imb else None,
            "imb20": imb[2].ratio if len(imb) > 2 else None,
            "absorption": str(absorb) if absorb else "",
        }
        self.buffer.append(row)
        if len(self.buffer) >= self.flush_every:
            self.flush()

    def flush(self):
        if not self.buffer:
            return
        day = datetime.utcnow().strftime("%Y-%m-%d")
        sym = self.buffer[0]["symbol"].replace(":", "_")
        path = os.path.join(self.out_dir, f"date={day}", f"symbol={sym}")
        os.makedirs(path, exist_ok=True)
        table = pa.Table.from_pylist(self.buffer)
        fn = os.path.join(path, f"{int(time.time()*1000)}.parquet")
        pq.write_table(table, fn, compression="snappy")
        self.buffer.clear()
