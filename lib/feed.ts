// lib/feed.ts
// Swappable data layer for the order-flow terminal. Today: simulated. Later:
// point NEXT_PUBLIC_ENGINE_WS_URL at the VPS Python engine (../engine) and the
// same frame shapes flow through — no UI change.
//
// The engine emits frames of this exact shape:

export interface Level {
  price: number;
  qty: number;
}

export interface ImbBand {
  band: number; // how many levels deep
  ratio: number; // bid / (bid + ask), 0.5 = balanced
  bq: number;
  aq: number;
}

// A heatmap column: price (as string key) -> resting qty, plus the mid.
export type HeatCol = { [priceOrMid: string]: number };

export interface Absorption {
  side: "bid" | "ask";
  price: number;
}

export interface Frame {
  mid: number;
  bids: Level[];
  asks: Level[];
  imb: ImbBand[];
  cvd: number;
  cvdHist: number[];
  heat: HeatCol[];
  absorption: Absorption | null;
}

const TICK = 0.5;
const LEVELS = 24;
const COLS = 90;

export function createSimulator(): () => Frame {
  let mid = 24000;
  let cvd = 0;
  let heat: HeatCol[] = [];
  let cvdHist: number[] = [];

  return function next(): Frame {
    mid += (Math.random() - 0.5) * TICK * 2;
    const m = Math.round(mid / TICK) * TICK;
    const bids: Level[] = [];
    const asks: Level[] = [];
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
    const col: HeatCol = {};
    bids.forEach((b) => (col[b.price] = b.qty));
    asks.forEach((a) => (col[a.price] = a.qty));
    col.__mid = m;
    heat = [...heat.slice(-(COLS - 1)), col];
    const band = (n: number): ImbBand => {
      const bq = bids.slice(0, n).reduce((s, b) => s + b.qty, 0);
      const aq = asks.slice(0, n).reduce((s, a) => s + a.qty, 0);
      return { band: n, ratio: bq / (bq + aq || 1), bq, aq };
    };
    const imb = [band(5), band(10), band(20)];
    cvd += Math.round((imb[0].ratio - 0.5) * 400 + (Math.random() - 0.5) * 120);
    cvdHist = [...cvdHist.slice(-(COLS - 1)), cvd];
    const absorption: Absorption | null =
      Math.random() < 0.04 ? { side: Math.random() < 0.5 ? "bid" : "ask", price: m } : null;
    return { mid: m, bids, asks, imb, cvd, cvdHist: [...cvdHist], heat: [...heat], absorption };
  };
}

// When live: a client WS connects to NEXT_PUBLIC_ENGINE_WS_URL and forwards
// frames of the identical shape. Source of truth is one env var.
export const ENGINE_WS_URL = process.env.NEXT_PUBLIC_ENGINE_WS_URL || null;
export const IS_LIVE = !!ENGINE_WS_URL;
