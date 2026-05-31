import React, { useState, useEffect, useRef } from "react";

// ── Simulated feed shaped exactly like the Python engine's output ──────────
// OrderBook.top(50) -> {bid_px[],bid_qty[],ask_px[],ask_qty[]}
// signals -> {cvd, imb:[{band,ratio}], absorption}
const TICK = 0.5;            // price step (Nifty-ish)
const LEVELS = 24;           // levels each side rendered
const COLS = 90;             // heatmap time columns

function useSimulatedFeed() {
  const [state, setState] = useState(null);
  const heat = useRef([]);   // array of columns; each col = {price->qty}
  const mid = useRef(24000);
  const cvd = useRef(0);
  const cvdHist = useRef([]);

  useEffect(() => {
    const id = setInterval(() => {
      // drift mid
      mid.current += (Math.random() - 0.5) * TICK * 2;
      const m = Math.round(mid.current / TICK) * TICK;

      // build book: qty decays away from touch, with random "walls"
      const bids = [], asks = [];
      for (let i = 0; i < LEVELS; i++) {
        const base = Math.max(0, 600 * Math.exp(-i / 8) + (Math.random() - 0.4) * 200);
        const wall = Math.random() < 0.06 ? Math.random() * 1800 : 0;
        bids.push({ price: m - TICK * (i + 1), qty: Math.round(base + wall) });
      }
      for (let i = 0; i < LEVELS; i++) {
        const base = Math.max(0, 600 * Math.exp(-i / 8) + (Math.random() - 0.4) * 200);
        const wall = Math.random() < 0.06 ? Math.random() * 1800 : 0;
        asks.push({ price: m + TICK * (i + 1), qty: Math.round(base + wall) });
      }

      // heatmap column keyed by price
      const col = {};
      bids.forEach(b => (col[b.price] = b.qty));
      asks.forEach(a => (col[a.price] = a.qty));
      col.__mid = m;
      heat.current = [...heat.current.slice(-(COLS - 1)), col];

      // imbalance bands
      const band = n => {
        const bq = bids.slice(0, n).reduce((s, b) => s + b.qty, 0);
        const aq = asks.slice(0, n).reduce((s, a) => s + a.qty, 0);
        return { band: n, ratio: bq / (bq + aq || 1), bq, aq };
      };
      const imb = [band(5), band(10), band(20)];

      // cvd proxy
      cvd.current += Math.round((imb[0].ratio - 0.5) * 400 + (Math.random() - 0.5) * 120);
      cvdHist.current = [...cvdHist.current.slice(-(COLS - 1)), cvd.current];

      // absorption flag (occasional)
      const absorption = Math.random() < 0.04
        ? { side: Math.random() < 0.5 ? "bid" : "ask", price: m }
        : null;

      setState({ mid: m, bids, asks, imb, cvd: cvd.current,
                 cvdHist: [...cvdHist.current], heat: [...heat.current], absorption });
    }, 220);
    return () => clearInterval(id);
  }, []);

  return state;
}

// ── Heatmap canvas ─────────────────────────────────────────────────────────
function Heatmap({ heat, mid }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv || !heat?.length) return;
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.fillStyle = "#07090d"; ctx.fillRect(0, 0, W, H);
    const cw = W / COLS;
    const pxRange = TICK * LEVELS * 2;
    const top = mid + TICK * LEVELS;
    const yOf = p => ((top - p) / pxRange) * H;
    let maxQ = 1;
    heat.forEach(c => Object.entries(c).forEach(([k, v]) => { if (k !== "__mid" && v > maxQ) maxQ = v; }));
    heat.forEach((col, ci) => {
      Object.entries(col).forEach(([k, qty]) => {
        if (k === "__mid") return;
        const p = parseFloat(k);
        const y = yOf(p); if (y < 0 || y > H) return;
        const t = Math.min(1, qty / maxQ);
        // dark->amber->white hot scale
        const r = Math.round(20 + t * 235);
        const g = Math.round(10 + t * 180);
        const b = Math.round(30 + t * 40);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(ci * cw, y - 2, cw + 0.5, 4);
      });
      // traded-price line
      const y = yOf(col.__mid);
      ctx.fillStyle = "rgba(120,220,255,0.9)";
      ctx.fillRect(ci * cw, y - 0.6, cw + 0.5, 1.2);
    });
  }, [heat, mid]);
  return <canvas ref={ref} width={620} height={420} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── DOM ladder ───────────────────────────────────────────────────────────
function Ladder({ bids, asks, absorption }) {
  const maxQ = Math.max(...bids.map(b => b.qty), ...asks.map(a => a.qty), 1);
  const Row = ({ lvl, side }) => {
    const w = (lvl.qty / maxQ) * 100;
    const hot = absorption && absorption.price === lvl.price && absorption.side === side;
    const c = side === "bid" ? "#1c8c5a" : "#c0392b";
    return (
      <div style={{ display: "flex", alignItems: "center", height: 15, fontSize: 10.5,
        fontVariantNumeric: "tabular-nums", position: "relative",
        outline: hot ? "1px solid #ffd166" : "none" }}>
        <div style={{ position: "absolute", right: side === "bid" ? 0 : "auto",
          left: side === "ask" ? 0 : "auto", top: 0, bottom: 0, width: `${w}%`,
          background: c, opacity: 0.32 }} />
        <span style={{ width: "50%", textAlign: "right", paddingRight: 8, zIndex: 1,
          color: side === "bid" ? "#3fe08a" : "#ff7a6b" }}>{lvl.qty}</span>
        <span style={{ width: "50%", paddingLeft: 8, zIndex: 1, color: "#c9d2dd" }}>{lvl.price.toFixed(1)}</span>
      </div>
    );
  };
  return (
    <div>
      {[...asks].slice(0, 14).reverse().map((a, i) => <Row key={"a" + i} lvl={a} side="ask" />)}
      <div style={{ height: 18, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, color: "#ffd166", letterSpacing: 1, borderTop: "1px solid #1b222c",
        borderBottom: "1px solid #1b222c", margin: "1px 0" }}>SPREAD</div>
      {bids.slice(0, 14).map((b, i) => <Row key={"b" + i} lvl={b} side="bid" />)}
    </div>
  );
}

// ── Imbalance + CVD ────────────────────────────────────────────────────────
function Imbalance({ imb }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {imb.map(b => (
        <div key={b.band}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8b97a6", marginBottom: 3 }}>
            <span>BAND {b.band}</span><span>{(b.ratio * 100).toFixed(0)}% bid</span>
          </div>
          <div style={{ height: 10, background: "#c0392b", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${b.ratio * 100}%`, height: "100%", background: "#1c8c5a" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
function CVD({ hist }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv || !hist?.length) return;
    const ctx = cv.getContext("2d"); const W = cv.width, H = cv.height;
    ctx.fillStyle = "#07090d"; ctx.fillRect(0, 0, W, H);
    const min = Math.min(...hist), max = Math.max(...hist), rng = max - min || 1;
    ctx.beginPath();
    hist.forEach((v, i) => {
      const x = (i / (hist.length - 1 || 1)) * W;
      const y = H - ((v - min) / rng) * (H - 8) - 4;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.strokeStyle = "#5ad1ff"; ctx.lineWidth = 1.5; ctx.stroke();
  }, [hist]);
  return <canvas ref={ref} width={300} height={70} style={{ width: "100%", height: 70 }} />;
}

export default function OrderFlowTerminal() {
  const s = useSimulatedFeed();
  if (!s) return <div style={{ color: "#5ad1ff", padding: 40, fontFamily: "monospace" }}>connecting to feed…</div>;
  return (
    <div style={{ background: "#04060a", color: "#c9d2dd", fontFamily: "'JetBrains Mono', monospace",
      padding: 14, minHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12,
        borderBottom: "1px solid #161d27", paddingBottom: 10 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>NIFTY25JULFUT</span>
          <span style={{ marginLeft: 12, fontSize: 12, color: "#5ad1ff" }}>{s.mid.toFixed(1)}</span>
        </div>
        <div style={{ fontSize: 9, color: "#5c6675", letterSpacing: 1 }}>
          FYERS TBT · 50-LVL DEPTH · <span style={{ color: "#ffd166" }}>SIMULATED DATA</span>
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
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 10, letterSpacing: 1 }}>BOOK IMBALANCE <span style={{ color: "#3fe08a" }}>· EXACT</span></div>
            <Imbalance imb={s.imb} />
          </div>
          <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: 12 }}>
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 6, letterSpacing: 1 }}>CVD <span style={{ color: "#ffd166" }}>· APPROX</span></div>
            <div style={{ fontSize: 18, color: s.cvd >= 0 ? "#3fe08a" : "#ff7a6b", fontWeight: 700 }}>{s.cvd >= 0 ? "+" : ""}{s.cvd}</div>
            <CVD hist={s.cvdHist} />
          </div>
          <div style={{ border: "1px solid #161d27", borderRadius: 4, padding: 12, minHeight: 60 }}>
            <div style={{ fontSize: 10, color: "#8b97a6", marginBottom: 8, letterSpacing: 1 }}>ABSORPTION <span style={{ color: "#3fe08a" }}>· EXACT</span></div>
            {s.absorption
              ? <div style={{ fontSize: 12, color: "#ffd166" }}>▲ {s.absorption.side.toUpperCase()} @ {s.absorption.price.toFixed(1)} holding</div>
              : <div style={{ fontSize: 11, color: "#5c6675" }}>none detected</div>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 9, color: "#5c6675", lineHeight: 1.5 }}>
        Heatmap & DOM render directly from 50-level depth (exact). Imbalance & absorption are depth-derived (exact).
        CVD is inferred from depth deltas + LTQ (approximate) until Fyers ships per-trade data — swap one module and it becomes exact.
      </div>
    </div>
  );
}
