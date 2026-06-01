# Deploying the Order Flow Engine to the VPS

The engine runs as a **systemd service in its own venv** under
`/opt/orderflow-engine`, fully isolated from **opticore**. It does not touch
opticore's files or hold any Fyers secrets — it **reuses opticore's already-
working live Fyers feed** at runtime, reconstructs the 50-level book, computes
analytics, and broadcasts frames over a WebSocket to the deployed `/orderflow`
frontend.

```
opticore live Fyers feed ──► OpticoreFeedSource ──► OrderBook ──► FrameBuilder
                                                                      │
                                            Parquet recorder ◄────────┤
                                                                      ▼
                                   WebSocket gateway (:8080) ──► nginx TLS ──► wss:// ──► browser
```

## 1. Install (smoke test first, no credentials)

On the VPS, from a checkout of this repo:

```bash
git clone https://github.com/gaja47/my-streamlit-app.git
cd my-streamlit-app
git checkout claude/orderflow-tools-vercel-deploy-bLyIP
sudo bash deploy/deploy.sh
```

This installs into `/opt/orderflow-engine`, creates the `orderflow` service
user, installs deps, and starts the service in **`FEED_SOURCE=sim`** (synthetic
book — proves the service + gateway + frontend path end-to-end with no Fyers
access).

```bash
journalctl -u orderflow-engine -f          # logs
# from the VPS, confirm the gateway is serving:
python3 - <<'PY'
import asyncio, websockets
async def t():
    async with websockets.connect("ws://127.0.0.1:8080") as ws:
        print((await ws.recv())[:200])
asyncio.run(t())
PY
```

## 2. Go live — wire opticore's feed

This is the ONE remaining integration point. Edit
`/opt/orderflow-engine/orderflow-engine.env`:

```ini
FEED_SOURCE=opticore
# + the OPTICORE_* vars describing how opticore exposes its feed
```

Then implement `OpticoreFeedSource.run()` in `engine/feed_source.py` — it just
translates opticore's depth events into `on_depth(symbol, is_snapshot, bids,
asks, ltp, ltq, ts)`. **No Fyers decoding here**: opticore already does it.
Depending on how opticore exposes its feed:

- **IPC (preferred):** opticore publishes depth on Redis/ZMQ/local-WS →
  subscribe to `OPTICORE_FEED_URL`/`OPTICORE_FEED_TOPIC` and forward.
- **In-process import:** add opticore to the venv / `OPTICORE_PYTHONPATH`,
  import its feed client, register a callback.

```bash
sudo systemctl restart orderflow-engine
```

> Share opticore's feed interface (topic + message shape, or its Python
> client API) and `OpticoreFeedSource` can be completed for you — it's ~20 lines.

## 3. Expose over TLS (so the https frontend can connect via wss)

The frontend is served over **https** (GitHub Pages), so it must connect over
**wss://** — keep the gateway on localhost and terminate TLS at nginx:

```nginx
# inside your existing TLS server { } block for the VPS domain
location /feed {
    proxy_pass         http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   Host $host;
    proxy_read_timeout 3600s;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 4. Point the frontend at the gateway

`NEXT_PUBLIC_ENGINE_WS_URL` is inlined at **build time**, so set it in the Pages
build and redeploy. In `.github/workflows/pages.yml`, add it to the build step
env:

```yaml
      - name: Build static site
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}
          NEXT_OUTPUT_EXPORT: "true"
          NEXT_PUBLIC_ENGINE_WS_URL: wss://YOUR_VPS_DOMAIN/feed
        run: npm run build
```

Push to `main` → Pages rebuilds → the `/orderflow` badge flips
**SIMULATED DATA → LIVE**. No frontend code change.

## Notes / guardrails
- **Isolation:** the service runs as user `orderflow` with `ProtectSystem=full`
  and `ReadWritePaths=/opt/orderflow-engine`; it cannot write into opticore.
- **Secrets:** Fyers credentials stay in opticore. The engine env holds none.
- **Legal gate:** streaming Fyers/NSE-derived data to paying subscribers is a
  redistribution-licensing question (see `docs/ORDERFLOW_RESEARCH.md` Part 4) —
  resolve before any subscriber-facing feed.
- **Heatmap tick:** the frontend heatmap currently assumes a fixed tick for its
  price→y mapping; for a real instrument whose tick differs, that mapping needs
  parameterizing (follow-up — the ladder/imbalance/CVD render correctly already).
