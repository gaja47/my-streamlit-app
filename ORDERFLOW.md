# Order Flow Tool

An NSE F&O order-flow analysis tool: a browser terminal (heatmap, 50-level DOM,
multi-band imbalance, CVD, absorption) backed by a Python engine that ingests
Fyers Versova TBT depth.

It lives **alongside** the existing fitness PWA in this repo — same Vercel
deployment, different route.

## Where things are

| Path | Role | Deploys to Vercel? |
|---|---|---|
| `app/orderflow/page.tsx` | The terminal UI (route `/orderflow`) | ✅ yes — part of the root Next.js app |
| `lib/feed.ts` | Swappable data layer — simulated now, live via one env var | ✅ yes |
| `components/AppShell.tsx` | Renders `/orderflow` full-bleed, everything else in the fitness mobile frame | ✅ yes |
| `engine/` | Python: Fyers WS client, order-book reconstruction, analytics, Parquet recorder | ❌ no — runs on an always-on VPS |
| `docs/` | `ARCHITECTURE.md`, `COVERAGE_MATRIX.md` | ❌ no |
| `orderflow-reference/` | Original single-file React mockup + standalone-web deploy notes (reference only) | ❌ no |

## Hard architectural facts (do not violate)

- The Fyers Versova TBT feed is **50-level DEPTH only**, NFO segment,
  snapshot + diffs. It does **not** send individual trade prints; LTP/LTQ/VTT
  are batched.
- Therefore depth-based tools (heatmap, DOM, imbalance, absorption) are **EXACT**.
  Trade-based tools (footprint, CVD, time & sales) are **APPROXIMATE** or
  impossible until Fyers ships per-trade data. **Never present approximate
  signals as exact** — keep the `· EXACT` / `· APPROX` fidelity labels in the UI.
- **Vercel hosts ONLY the frontend.** Serverless can't hold a persistent socket,
  so the Python engine does not run there. Fyers credentials live ONLY on the
  engine box — never in the frontend, never in Vercel.

## Going live (when you have Fyers credentials)

1. Run the Python engine (`engine/`) on an always-on box. Plug the Fyers
   Versova protobuf schema into the `decode_packet` stub in `engine/main.py`
   (the `marketcalls/fyers-websockets` repo has a working reference decoder).
   Credentials live there in env vars.
2. Have the engine broadcast JSON frames (shape defined in `lib/feed.ts`) over a
   WebSocket, e.g. `wss://your-vps:8080/feed`.
3. In Vercel project settings add:
   `NEXT_PUBLIC_ENGINE_WS_URL = wss://your-vps:8080/feed`
4. Redeploy. The status badge flips `SIMULATED DATA` → `LIVE`. No code change.

## Build order (de-risked — follow this)

1. **Capture-only**: record Parquet from Fyers. Prove data quality. (no UI)
2. **Replay bridge**: play recorded Parquet through the terminal UI. Validate
   edge on your Nifty/BankNifty trades before building more.
3. **Live gateway + frontend.**
4. Long-tail tools per `docs/COVERAGE_MATRIX.md` priority.

## Legal gate

Streaming Fyers-derived data to paying subscribers = redistribution. Confirm
Fyers API terms + NSE data policy **in writing** before any live subscriber
feed. This is a licensing gate, not a technical one.
