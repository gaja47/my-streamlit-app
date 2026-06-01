"""
gateway.py — WebSocket gateway the frontend connects to.

Serverless (Vercel/Pages) can't hold a persistent socket, so this runs on the
VPS. It keeps the latest frame per symbol (written by the engine thread) and
broadcasts the PRIMARY symbol's frame to connected browsers at a fixed rate.

The frontend (deployed /orderflow route) renders one symbol, so we broadcast
the primary symbol only. Put this behind nginx TLS so an https page can reach
it over wss:// (see deploy/README.md).
"""
import asyncio
import json

import websockets


class Gateway:
    def __init__(self, host: str, port: int, primary: str, rate_hz: float = 5.0):
        self.host = host
        self.port = port
        self.primary = primary
        self.interval = 1.0 / rate_hz
        self.latest = {}          # symbol -> frame dict (set by engine thread)
        self.clients = set()

    # called from the engine thread; plain dict assignment is GIL-safe
    def update(self, symbol: str, frame: dict) -> None:
        self.latest[symbol] = frame

    async def _handler(self, ws):
        self.clients.add(ws)
        try:
            frame = self.latest.get(self.primary)
            if frame is not None:
                await ws.send(json.dumps(frame))
            async for _ in ws:  # ignore client messages; keep the socket open
                pass
        finally:
            self.clients.discard(ws)

    async def _broadcast_loop(self):
        while True:
            await asyncio.sleep(self.interval)
            frame = self.latest.get(self.primary)
            if not self.clients or frame is None:
                continue
            msg = json.dumps(frame)
            for ws in list(self.clients):
                try:
                    await ws.send(msg)
                except Exception:
                    self.clients.discard(ws)

    async def _serve(self):
        async with websockets.serve(self._handler, self.host, self.port):
            print(f"gateway listening on ws://{self.host}:{self.port} (primary={self.primary})")
            await self._broadcast_loop()

    def run(self):  # blocking
        asyncio.run(self._serve())
