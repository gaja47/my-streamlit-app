# Order Flow Terminal — Web (Vercel)

Next.js frontend for the order-flow tool. Deploys to Vercel today on a
**simulated feed** (no credentials needed). Switches to **live** later via
one environment variable.

## Deploy

```bash
cd web
npm install
vercel deploy        # first run links/creates the project; follow prompts
vercel --prod        # promote to production
```

Or push this folder to a Git repo connected to Vercel — it deploys on push.

Build is verified clean (Next.js 14, static export of the terminal page).

## Architecture (why the split matters)

- **Vercel** hosts ONLY the frontend (this folder). Serverless can't hold a
  persistent WebSocket, so the Fyers engine does NOT run here.
- **Your VPS** runs the Python engine (../engine) holding the Fyers TBT socket,
  reconstructing the book, and broadcasting frames over a WebSocket.

## Going live (when you have Fyers credentials)

1. Run the Python engine (../engine) on an always-on box. Credentials live
   there in env vars — never in this frontend, never in Vercel.
2. Have the engine broadcast JSON frames (shape in lib/feed.js) over a WS,
   e.g. wss://your-vps:8080/feed
3. In Vercel project settings add:
   `NEXT_PUBLIC_ENGINE_WS_URL = wss://your-vps:8080/feed`
4. Redeploy. The status badge flips SIMULATED → LIVE. No code change.

## Before exposing live data to subscribers

Streaming Fyers-derived depth to paying users = redistribution. Confirm
Fyers API terms + NSE data policy in writing first. This is a licensing
gate, not a technical one.
