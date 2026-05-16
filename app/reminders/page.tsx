"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { reminders } from "@/lib/mockData";

export default function Reminders() {
  const [items, setItems] = useState(reminders);
  const [push, setPush] = useState(true);
  const [telegram, setTelegram] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <div>
      <Header title="Reminders" subtitle="Today's schedule" back="/profile" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Channels</div>
          <div className="grid grid-cols-3 gap-2">
            <Channel label="Push" on={push} onToggle={() => setPush((s) => !s)} />
            <Channel label="Telegram" on={telegram} onToggle={() => setTelegram((s) => !s)} />
            <Channel label="Email" on={email} onToggle={() => setEmail((s) => !s)} />
          </div>
          <div className="mt-4 text-[11px] text-bone-mute">Lead time <span className="text-bone tabular">10 min</span> before each event.</div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute px-1 mb-3">Schedule</div>
        <div className="card overflow-hidden">
          {items.map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-4 ${i ? "border-t border-ink-300/60" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="tabular text-[12px] text-bone-mute w-16">{r.time}</div>
                <div>
                  <div className="text-[14px]">{r.title}</div>
                  <div className="text-[11px] text-bone-mute mt-0.5">{r.note}</div>
                </div>
              </div>
              <Toggle on={r.on} onToggle={() => setItems((arr) => arr.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px]">Add custom</button>
        <button className="rounded-2xl bg-bone text-ink py-3 text-[13px] font-medium">Save schedule</button>
      </div>
    </div>
  );
}

function Channel({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-2xl py-3 border text-[12px] ${on ? "bg-bone text-ink border-bone" : "bg-ink-100 border-ink-300/60 text-bone-dim"}`}
    >
      {label}
    </button>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full p-0.5 transition flex ${on ? "bg-readiness/80" : "bg-ink-300"}`}
    >
      <span className={`w-5 h-5 bg-bone rounded-full transition ${on ? "ml-5" : "ml-0"}`} />
    </button>
  );
}
