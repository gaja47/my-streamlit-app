# Order Flow Tool — Full Coverage Architecture

## What "full coverage" means on Fyers (the honest scope)

The Fyers Versova TBT socket gives **50-level depth**, NFO-only, snapshot-then-diffs.
It does **NOT** give individual trade prints. LTP/LTQ/VTT exist but are batched.

Consequence:

| Feature                          | Source                       | Fidelity        |
|----------------------------------|------------------------------|-----------------|
| 50-level DOM / heatmap           | TBT depth (exact)            | TRUE            |
| Resting liquidity walls, pulls   | TBT depth (exact)            | TRUE            |
| Book imbalance (multi-band)      | TBT depth (exact)            | TRUE            |
| Absorption (orders hold v press) | TBT depth (exact)            | TRUE            |
| Aggressor side / CVD             | depth-delta + LTQ inference  | APPROXIMATE     |
| Footprint / cluster              | inferred trades              | APPROXIMATE     |
| True time & sales                | not available                | NOT POSSIBLE*   |

*Until Fyers ships trade data on the channel. The engine is built so that the
day they do, you swap the inference module for the real trade stream and every
downstream analytic upgrades to TRUE fidelity with no rewrite.

## Layers

1. ENGINE (Python) — ingest, decode, reconstruct book, analytics, persist
   - decoders/   protobuf decode of Versova packets
   - analytics/  imbalance, absorption, CVD-proxy, footprint-proxy, heatmap matrix
   - storage/    Parquet (replay+backtest) and in-memory ring buffer (live)
2. GATEWAY — your own WS server; fan-out to clients, enforce entitlements
   (keeps the raw Fyers feed server-side = redistribution control point)
3. FRONTEND (Next.js/Vercel) — DOM canvas, heatmap, analytics panels
4. CONFIG — symbols, channels, depth bands, thresholds

## Data flow

Fyers Versova WS --(protobuf)--> Decoder --> OrderBook state
   --> Analytics (per tick) --> { live ring buffer, Parquet writer }
   --> Gateway WS --> Frontend canvas

## Critical build order (de-risked)
1. Capture-only: decode + write Parquet. Prove data quality. (cheap, no UI)
2. Offline replay + heatmap. Validate edge on YOUR instruments.
3. Gateway + frontend live DOM.
4. Analytics productization.

## Legal gate (do before layer 2/3 ships)
Streaming Fyers-derived data to paying users = redistribution.
Confirm Fyers API terms + NSE data policy IN WRITING first.
