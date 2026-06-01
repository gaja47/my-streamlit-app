"""
run.py — LIVE engine entry point (deployed as a systemd service on the VPS).

Wires:  feed source -> OrderBook(s) -> FrameBuilder -> WebSocket gateway
        (+ optional Parquet recording).

Config via environment (see deploy/orderflow-engine.env.example):
  SYMBOLS        comma list; the FIRST is the primary symbol the UI renders
  FEED_SOURCE    "opticore" (live, reuse opticore's feed) | "sim" (no creds)
  GATEWAY_HOST   bind host (127.0.0.1 behind nginx)
  GATEWAY_PORT   bind port (e.g. 8080)
  RECORD         "true"/"false" — write Parquet capture
  DATA_DIR       Parquet output dir

Capture-only Step-1 recording still lives in main.py; this serves live frames.
"""
import os
import threading

from order_book import OrderBook
from frame_builder import FrameBuilder
from gateway import Gateway
from feed_source import SimulatedFeedSource, OpticoreFeedSource

SYMBOLS = [s.strip() for s in os.environ.get("SYMBOLS", "NSE:NIFTY25JULFUT").split(",") if s.strip()]
PRIMARY = SYMBOLS[0]
HOST = os.environ.get("GATEWAY_HOST", "127.0.0.1")
PORT = int(os.environ.get("GATEWAY_PORT", "8080"))
MODE = os.environ.get("FEED_SOURCE", "sim").lower()
RECORD = os.environ.get("RECORD", "false").lower() == "true"
DATA_DIR = os.environ.get("DATA_DIR", "data")

books = {s: OrderBook(s) for s in SYMBOLS}
builders = {s: FrameBuilder(s) for s in SYMBOLS}
gateway = Gateway(HOST, PORT, primary=PRIMARY)

recorder = None
if RECORD:
    try:
        from storage.recorder import DepthRecorder
        recorder = DepthRecorder(out_dir=DATA_DIR)
    except Exception as e:  # pyarrow missing etc. — don't take the feed down
        print(f"recording disabled ({e})")


def on_depth(symbol, is_snapshot, bids, asks, ltp, ltq, ts):
    bk = books.get(symbol)
    if bk is None:
        return
    if is_snapshot:
        bk.apply_snapshot(bids, asks, ts)
    else:
        for b in bids:
            bk.apply_diff("bid", b["price"], b["qty"], b.get("orders", 0), ts)
        for a in asks:
            bk.apply_diff("ask", a["price"], a["qty"], a.get("orders", 0), ts)

    fb = builders[symbol]
    frame = fb.build(bk, ltp, ltq)
    if frame is not None:
        gateway.update(symbol, frame)
    if recorder is not None:
        tb, ta = bk.top(50)
        recorder.record(symbol, ts, tb, ta, fb.last_cvd, fb.last_imb, fb.last_ab)


def make_source():
    if MODE == "opticore":
        return OpticoreFeedSource(SYMBOLS, on_depth)
    return SimulatedFeedSource(SYMBOLS, on_depth)


if __name__ == "__main__":
    src = make_source()
    print(f"engine: feed={MODE} symbols={SYMBOLS} primary={PRIMARY} record={recorder is not None}")
    threading.Thread(target=src.run, daemon=True).start()
    gateway.run()  # blocks
