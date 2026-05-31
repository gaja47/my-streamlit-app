"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  createSimulator,
  IS_LIVE,
  ENGINE_WS_URL,
  type Frame,
  type Level,
  type ImbBand,
  type HeatCol,
  type Absorption,
} from "@/lib/feed";

const TICK = 0.5,
  LEVELS = 24,
  COLS = 90;

function useFeed(): Frame | null {
  const [state, setState] = useState<Frame | null>(null);
  useEffect(() => {
    if (IS_LIVE && ENGINE_WS_URL) {
      // LIVE PATH: connect to the Python engine on your VPS.
      const ws = new WebSocket(ENGINE_WS_URL);
      ws.onmessage = (e) => {
        try {
          setState(JSON.parse(e.data));
        } catch {}
      };
      return () => ws.close();
    }
    // SIMULATED PATH (default, no credentials needed)
    const sim = createSimulator();
    const id = setInterval(() => setState(sim()), 220);
    return () => clearInterval(id);
  }, []);
  return state;
}

function Heatmap({ heat, mid }: { heat: HeatCol[]; mid: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !heat?.length) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = cv.width,
      H = cv.height;
    ctx.fillStyle = "#07090d";
    ctx.fillRect(0, 0, W, H);
    const cw = W / COLS,
      pxRange = TICK * LEVELS * 2,
      top = mid + TICK * LEVELS;
    const yOf = (p: number) => ((top - p) / pxRange) * H;
    let maxQ = 1;
    heat.forEach((c) =>
      Object.entries(c).forEach(([k, v]) => {
        if (k !== "__mid" && v > maxQ) maxQ = v;
      })
    );
    heat.forEach((col, ci) => {
      Object.entries(col).forEach(([k, qty]) => {
        if (k === "__mid") return;
        const y = yOf(parseFloat(k));
        if (y < 0 || y > H) return;
        const t = Math.min(1, qty / maxQ);
        ctx.fillStyle = `rgb(${(20 + t * 235) | 0},${(10 + t * 180) | 0},${(30 + t * 40) | 0})`;
        ctx.fillRect(ci * cw, y - 2, cw + 0.5, 4);
      });
      const y = yOf(col.__mid);
      ctx.fillStyle = "rgba(120,220,255,0.9)";
      ctx.fillRect(ci * cw, y - 0.6, cw + 0.5, 1.2);
    });
  }, [heat, mid]);
  return <canvas ref={ref} width={620} height={420} style={{ width: "100%", height: "100%", display: "block" }} />;
}

function Ladder({ bids, asks, absorption }: { bids: Level[]; asks: Level[]; absorption: Absorption | null }) {
  const maxQ = Math.max(...bids.map((b) => b.qty), ...asks.map((a) => a.qty), 1);
  const Row = ({ lvl, side }: { lvl: Level; side: "bid" | "ask" }) => {
    const w = (lvl.qty / maxQ) * 100;
    const hot = absorption && absorption.price === lvl.price && absorption.side === side;
    const c = side === "bid" ? "#1c8c5a" : "#c0392b";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 15,
          fontSize: 10.5,
          fontVariantNumeric: "tabular-nums",
          position: "relative",
          outline: hot ? "1px solid #ffd166" : "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: side === "bid" ? 0 : "auto",
            left: side === "ask" ? 0 : "auto",
            top: 0,
            bottom: 0,
            width: `${w}%`,
            background: c,
            opacity: 0.32,
          }}
        />
        <span style={{ width: "50%", textAlign: "right", paddingRight: 8, zIndex: 1, color: side === "bid" ? "#3fe08a" : "#ff7a6b" }}>
          {lvl.qty}
        </span>
        <span style={{ width: "50%", paddingLeft: 8, zIndex: 1, color: "#c9d2dd" }}>{lvl.price.toFixed(1)}</span>
      </div>
    );
  };
  return (
    <div>
      {[...asks].slice(0, 14).reverse().map((a, i) => (
        <Row key={"a" + i} lvl={a} side="ask" />
      ))}
      <div
        style={{
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: "#ffd166",
          letterSpacing: 1,
          borderTop: "1px solid #1b222c",
          borderBottom: "1px solid #1b222c",
          margin: "1px 0",
        }}
      >
        SPREAD
      </div>
      {bids.slice(0, 14).map((b, i) => (
        <Row key={"b" + i} lvl={b} side="bid" />
      ))}
    </div>
  );
}

function Imbalance({ imb }: { imb: ImbBand[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {imb.map((b) => (
        <div key={b.band}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8b97a6", marginBottom: 3 }}>
            <span>BAND {b.band}</span>
            <span>{(b.ratio * 100).toFixed(0)}% bid</span>
          </div>
          <div style={{ height: 10, background: "#c0392b", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${b.ratio * 100}%`, height: "100%", background: "#1c8c5a" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CVD({ hist }: { hist: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv || !hist?.length) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = cv.width,
      H = cv.height;
    ctx.fillStyle = "#07090d";
    ctx.fillRect(0, 0, W, H);
    const min = Math.min(...hist),
      max = Math.max(...hist),
      rng = max - min || 1;
    ctx.beginPath();
    hist.forEach((v, i) => {
      const x = (i / (hist.length - 1 || 1)) * W,
        y = H - ((v - min) / rng) * (H - 8) - 4;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.strokeStyle = "#5ad1ff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [hist]);
  return <canvas ref={ref} width={300} height={70} style={{ width: "100%", height: 70 }} />;
}

export default function Page() {
  const s = useFeed();
  if (!s) return <div style={{ color: "#5ad1ff", padding: 40, fontFamily: "monospace" }}>connecting to feed…</div>;
  return (
    <div style={{ background: "#04060a", color: "#c9d2dd", fontFamily: "monospace", padding: 14, minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
          borderBottom: "1px solid #161d27",
          paddingBottom: 10,
        }}
      >
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>NIFTY25JULFUT</span>
          <span style={{ marginLeft: 12, fontSize: 12, color: "#5ad1ff" }}>{s.mid.toFixed(1)}</span>
        </div>
        <div style={{ fontSize: 9, color: "#5c6675", letterSpacing: 1 }}>
          FYERS TBT · 50-LVL DEPTH ·{" "}
          <span style={{ color: IS_LIVE ? "#3fe08a" : "#ffd166" }}>{IS_LIVE ? "LIVE" : "SIMULATED DATA"}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.85fr 0.85fr", gap: 12 }}>
        <div style={{ border: "1px solid #161d27", borderRadius: 4, overflow: "hidden", height: 420 }}>
          <Heatmap heat={s.heat} mid={s.mid} />
        </div>
        <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: "6px 4px", height: 420, overflow: "hidden" }}>
          <Ladder bids={s.bids} asks={s.asks} absorption={s.absorption} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 10, letterSpacing: 1 }}>
              BOOK IMBALANCE <span style={{ color: "#3fe08a" }}>· EXACT</span>
            </div>
            <Imbalance imb={s.imb} />
          </div>
          <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 6, letterSpacing: 1 }}>
              CVD <span style={{ color: "#ffd166" }}>· APPROX</span>
            </div>
            <div style={{ fontSize: 18, color: s.cvd >= 0 ? "#3fe08a" : "#ff7a6b", fontWeight: 700 }}>
              {s.cvd >= 0 ? "+" : ""}
              {s.cvd}
            </div>
            <CVD hist={s.cvdHist} />
          </div>
          <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: 12, minHeight: 60 }}>
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 8, letterSpacing: 1 }}>
              ABSORPTION <span style={{ color: "#3fe08a" }}>· EXACT</span>
            </div>
            {s.absorption ? (
              <div style={{ fontSize: 12, color: "#ffd166" }}>
                ▲ {s.absorption.side.toUpperCase()} @ {s.absorption.price.toFixed(1)} holding
              </div>
            ) : (
              <div style={{ fontSize: 11, color: "#5c6675" }}>none detected</div>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 9, color: "#5c6675", lineHeight: 1.5 }}>
        Heatmap & DOM render from 50-level depth (exact). Imbalance & absorption are depth-derived (exact). CVD is inferred from
        depth deltas + LTQ (approximate) until Fyers ships per-trade data. Set NEXT_PUBLIC_ENGINE_WS_URL to switch from simulated to
        live.
      </div>
    </div>
  );
}
