"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { actions, useHydrate, useStore } from "@/lib/store";

type NotifPerm = "default" | "granted" | "denied" | "unsupported";

export default function Reminders() {
  useHydrate();
  const reminders = useStore((s) => s.reminders);
  const channels = useStore((s) => s.settings.channels);
  const [perm, setPerm] = useState<NotifPerm>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission as NotifPerm);
  }, []);

  useEffect(() => {
    if (perm !== "granted" || !channels.push) return;
    const timers: number[] = [];
    const now = new Date();
    reminders.forEach((r) => {
      if (!r.on || !/^\d{1,2}:\d{2}$/.test(r.time)) return;
      const [h, m] = r.time.split(":").map(Number);
      const fire = new Date(now);
      fire.setHours(h, m, 0, 0);
      const ms = fire.getTime() - now.getTime();
      if (ms > 0 && ms < 12 * 3600 * 1000) {
        const id = window.setTimeout(() => {
          new Notification(r.title, { body: r.note });
        }, ms);
        timers.push(id);
      }
    });
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [perm, channels.push, reminders]);

  async function requestPerm() {
    if (perm === "unsupported") return;
    const result = await Notification.requestPermission();
    setPerm(result as NotifPerm);
  }

  return (
    <div>
      <Header title="Reminders" subtitle="Today's schedule" back="/profile" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3">Channels</div>
          <div className="grid grid-cols-3 gap-2">
            <Channel label="Push" on={channels.push} onToggle={() => actions.setChannel("push", !channels.push)} />
            <Channel label="Telegram" on={channels.telegram} onToggle={() => actions.setChannel("telegram", !channels.telegram)} />
            <Channel label="Email" on={channels.email} onToggle={() => actions.setChannel("email", !channels.email)} />
          </div>

          {channels.push && perm !== "granted" && (
            <button
              onClick={requestPerm}
              disabled={perm === "denied" || perm === "unsupported"}
              className="mt-4 w-full rounded-2xl bg-readiness/20 border border-readiness/40 text-readiness py-3 text-[12px] disabled:opacity-50"
            >
              {perm === "default" && "Enable browser notifications"}
              {perm === "denied" && "Notifications blocked - update in browser settings"}
              {perm === "unsupported" && "Notifications not supported on this browser"}
            </button>
          )}

          {channels.push && perm === "granted" && (
            <div className="mt-3 text-[11px] text-readiness">Browser notifications active for today's schedule</div>
          )}
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute px-1 mb-3">Schedule</div>
        <div className="card overflow-hidden">
          {reminders.map((r, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-4 ${i ? "border-t border-ink-300/60" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="tabular text-[12px] text-bone-mute w-16">{r.time}</div>
                <div>
                  <div className="text-[14px]">{r.title}</div>
                  <div className="text-[11px] text-bone-mute mt-0.5">{r.note}</div>
                </div>
              </div>
              <Toggle on={r.on} onToggle={() => actions.toggleReminder(i)} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[11px] text-bone-mute leading-relaxed">
          Push reminders only fire while the app tab is open. For background alerts on iOS/Android, add the app to your home screen (Share -&gt; Add to Home Screen) and grant notification permission.
        </div>
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
    <button onClick={onToggle} className={`w-11 h-6 rounded-full p-0.5 transition flex ${on ? "bg-readiness/80" : "bg-ink-300"}`}>
      <span className={`w-5 h-5 bg-bone rounded-full transition ${on ? "ml-5" : "ml-0"}`} />
    </button>
  );
}
