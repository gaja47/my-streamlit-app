"""
main.py — capture-only engine entry point (STEP 1).

Wires: Fyers Versova TBT WS -> protobuf decode -> OrderBook -> analytics
-> Parquet recorder. No gateway, no UI yet. Run this for a few sessions,
then replay the Parquet to validate edge before building anything live.

NOTE: the Fyers protobuf decode is stubbed (`decode_packet`) — drop in the
official Fyers protobuf schema from the API portal. The marketcalls/
fyers-websockets repo has a working reference decoder you can adapt.

Requires: fyers-apiv3, pyarrow, protobuf
"""
import os
from order_book import OrderBook
from analytics.signals import (
    imbalance, CVDProxy, AbsorptionDetector, VolumeProfile, VolumeTracker, VWAP,
)
from storage.recorder import DepthRecorder

# from fyers_apiv3.FyersWebsocket import data_ws  # depth/LTP socket
# Versova TBT endpoint: wss://rtsocket-api.fyers.in/versova

SYMBOLS = os.environ.get("SYMBOLS", "NSE:NIFTY25JULFUT").split(",")
TICK_SIZE = float(os.environ.get("TICK_SIZE", "0.05"))

books = {s: OrderBook(s) for s in SYMBOLS}
cvd = {s: CVDProxy() for s in SYMBOLS}
absorb = {s: AbsorptionDetector() for s in SYMBOLS}
volume = {s: VolumeTracker() for s in SYMBOLS}
profile = {s: VolumeProfile(tick_size=TICK_SIZE) for s in SYMBOLS}
vwap = {s: VWAP() for s in SYMBOLS}
recorder = DepthRecorder(out_dir="data")


def decode_packet(raw_bytes):
    """
    STUB: replace with Fyers Versova protobuf decode.
    Must return: (symbol, is_snapshot, bids[], asks[], ltp, ltq, ts)
    where bids/asks are [{'price':float,'qty':int,'orders':int}, ...]

    Optionally return an 8th element, vtt (volume traded today, cumulative).
    Fyers sends it on the same packet, and its per-packet delta is the true
    traded volume — supplying it makes volume profile / POC / VWAP materially
    more accurate than the LTQ fallback. See analytics.signals.VolumeTracker.
    """
    raise NotImplementedError("Plug in Fyers Versova protobuf schema here")


def on_message(raw_bytes):
    packet = decode_packet(raw_bytes)
    sym, is_snapshot, bids, asks, ltp, ltq, ts = packet[:7]
    vtt = packet[7] if len(packet) > 7 else None
    bk = books[sym]
    if is_snapshot:
        bk.apply_snapshot(bids, asks, ts)
    else:
        for b in bids:
            bk.apply_diff("bid", b["price"], b["qty"], b.get("orders", 0), ts)
        for a in asks:
            bk.apply_diff("ask", a["price"], a["qty"], a.get("orders", 0), ts)

    bb, ba = bk.best_bid_ask()
    c = cvd[sym].update(ltp, ltq, bb, ba)
    imb = imbalance(bk)
    ab = absorb[sym].update(bk)

    traded = volume[sym].increment(ltp, ltq, vtt)
    profile[sym].update(ltp, traded)
    vwap[sym].update(ltp, traded)

    top_bids, top_asks = bk.top(50)
    recorder.record(sym, ts, top_bids, top_asks, c, imb, ab,
                    profile=profile[sym], vwap=vwap[sym])


if __name__ == "__main__":
    print(f"Capture-only engine. Symbols: {SYMBOLS}")
    print("Plug Fyers Versova WS callback -> on_message, then run a session.")
    print("Data lands in ./data/date=*/symbol=*/  as Parquet.")
