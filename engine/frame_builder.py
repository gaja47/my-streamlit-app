"""
frame_builder.py — converts the reconstructed OrderBook + analytics into the
exact JSON frame shape the frontend consumes (see web `lib/feed.ts` / the
deployed /orderflow route):

  { mid, bids:[{price,qty}], asks:[{price,qty}],
    imb:[{band,ratio,bq,aq}], cvd, cvdHist:[...],
    heat:[{ "<price>": qty, ..., "__mid": mid }], absorption:{side,price}|null }

One FrameBuilder instance per symbol; it holds the rolling heat/CVD history so
the gateway can broadcast a complete frame on every depth update.
"""
from collections import deque

from order_book import OrderBook
from analytics.signals import imbalance, CVDProxy, AbsorptionDetector

COLS = 90          # rolling history width (matches the frontend canvas)
HEAT_LEVELS = 24   # depth levels per side fed to the heatmap/ladder


class FrameBuilder:
    def __init__(self, symbol: str, cols: int = COLS):
        self.symbol = symbol
        self.cvd = CVDProxy()
        self.absorb = AbsorptionDetector()
        self.heat = deque(maxlen=cols)
        self.cvd_hist = deque(maxlen=cols)
        # last computed analytics, exposed so a recorder can persist them
        self.last_cvd = 0
        self.last_imb = []
        self.last_ab = None

    def build(self, book: OrderBook, ltp, ltq):
        mid = book.mid()
        if mid is None:
            return None
        bids, asks = book.top(HEAT_LEVELS)
        bb, ba = book.best_bid_ask()

        cvd = self.cvd.update(ltp, ltq, bb, ba)
        imb_bands = imbalance(book, bands=(5, 10, 20))
        ab = self.absorb.update(book)

        col = {str(l.price): l.qty for l in bids}
        col.update({str(l.price): l.qty for l in asks})
        col["__mid"] = mid
        self.heat.append(col)
        self.cvd_hist.append(cvd)

        self.last_cvd, self.last_imb, self.last_ab = cvd, imb_bands, ab

        return {
            "mid": mid,
            "bids": [{"price": l.price, "qty": l.qty} for l in bids],
            "asks": [{"price": l.price, "qty": l.qty} for l in asks],
            "imb": [
                {"band": b.band, "ratio": round(b.ratio, 3), "bq": b.bid_qty, "aq": b.ask_qty}
                for b in imb_bands
            ],
            "cvd": cvd,
            "cvdHist": list(self.cvd_hist),
            "heat": list(self.heat),
            "absorption": ({"side": ab["side"], "price": ab["price"]} if ab else None),
        }
