# Order Flow Tooling — Full Coverage Matrix

Every order-flow tool type that exists in pro platforms (ATAS, Bookmap,
Quantower, ClusterDelta, NinjaTrader), mapped to what your **Fyers TBT
(50-level depth, NFO)** feed can actually power.

**Fidelity key:** ✅ EXACT (depth-only) · 🟡 APPROX (inferred from depth+LTQ) · ❌ NOT POSSIBLE (needs per-trade prints Fyers doesn't send yet)

---

## Group 1 — Depth-based (resting orders) — your strength

| Tool | What it shows | Fyers fidelity | Status in your build |
|------|---------------|----------------|----------------------|
| DOM ladder | Bid/ask size per price level | ✅ EXACT | DONE (mockup) |
| Liquidity heatmap | Resting orders as heat over time | ✅ EXACT | DONE (mockup) |
| DOM Surface (3D) | 3D depth / large resting orders | ✅ EXACT | Roadmap |
| Imbalance (multi-band) | Abnormal bid:ask ratio | ✅ EXACT | DONE |
| Absorption / refill | Large level holding vs pressure | ✅ EXACT | DONE |
| Iceberg / Splash | Hidden orders refilling | ✅ EXACT* | Roadmap |

*Iceberg detection from depth-refill patterns is solid; trade-confirmed icebergs need prints.

## Group 2 — Trade-based (executions) — the constrained group

| Tool | What it shows | Fyers fidelity | Status |
|------|---------------|----------------|--------|
| Footprint / Cluster | Bid vs ask volume per price per candle | 🟡 APPROX | Inference only |
| Cumulative Delta (CVD) | Net aggressive buy − sell | 🟡 APPROX | DONE (proxy) |
| Bid/Ask volume histogram | Aggressor volume split | 🟡 APPROX | Roadmap |
| Time & Sales (tape) | Raw execution stream | ❌ NOT POSSIBLE | Blocked on Fyers |
| Big trades / filtered vol | Institutional-size filter | ❌ NOT POSSIBLE | Blocked on Fyers |

## Group 3 — Derived / volume

| Tool | What it shows | Fyers fidelity | Status |
|------|---------------|----------------|--------|
| Volume Profile | Volume by price | 🟡 APPROX | Roadmap |
| Market Profile / TPO | Time at price | ✅ EXACT** | Roadmap |
| POC / DPOC | Highest-volume price | 🟡 APPROX | Roadmap |
| VWAP + anchored + bands | Vol-weighted avg price | 🟡 APPROX | Roadmap |
| HVN / LVN | High/low volume nodes | 🟡 APPROX | Roadmap |

**TPO is time-based not volume-based, so it's exact from periodic depth/price sampling.

---

## The one rule that defines this product

**Depth-based = exact and best-in-class (50 levels beats most retail tools).
Trade-based = approximate or impossible until Fyers ships per-trade data.**

Every approximate/impossible tool upgrades to EXACT the day Fyers adds trade
prints to the Versova channel — by swapping the single inference module.
Until then, label fidelity honestly in the UI so subscribers know which
numbers are real depth vs inferred.

## Suggested build priority (revenue + de-risk order)

1. Heatmap + DOM + imbalance + absorption  ← all EXACT, all done in mockup
2. Replay bridge (recorded Parquet → frontend)  ← validate edge on YOUR instruments
3. Volume Profile + VWAP + POC  ← high trader demand, approx acceptable
4. Footprint (approx, clearly labelled)  ← only if subscribers ask
5. Time & Sales / big-trades  ← wait for Fyers trade data
