"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { HeartRateChart } from "@/components/Charts";
import { hrSeries } from "@/lib/mockData";
import { actions, useHydrate, useStore } from "@/lib/store";

function fmtElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function Workout() {
  useHydrate();
  const workout = useStore((s) => s.workout);
  const [now, setNow] = useState(Date.now());
  const [reps, setReps] = useState(8);
  const [kg, setKg] = useState(72.5);
  const [rpe, setRpe] = useState(8);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cur = workout.exercises[workout.currentIndex] || workout.exercises[workout.exercises.length - 1];
  const elapsed = (workout.endedAt ?? now) - workout.startedAt;
  const lastSetAt = cur?.sets[cur.sets.length - 1]?.loggedAt ?? workout.startedAt;
  const restSec = Math.max(0, 120 - Math.floor((now - lastSetAt) / 1000));
  const restMm = Math.floor(restSec / 60);
  const restSs = (restSec % 60).toString().padStart(2, "0");
  const completedSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
  const targetSets = workout.exercises.reduce((n, e) => n + e.targetSets, 0);

  return (
    <div>
      <Header
        title={workout.title}
        subtitle={workout.endedAt ? "Completed" : "Live · Strength"}
        back="/"
        right={
          <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute tabular">
            {completedSets}/{targetSets} sets
          </div>
        }
      />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Elapsed</div>
            <div className="text-[44px] font-light tracking-tightest tabular leading-none mt-1">
              {fmtElapsed(elapsed)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">Heart rate</div>
              <div className="text-[34px] font-light tracking-tightest tabular text-strain mt-1">
                {Math.round(120 + Math.sin(now / 1000) * 20)}<span className="text-bone-mute text-[12px] ml-1">bpm</span>
              </div>
            </div>
            <div className="w-px h-12 bg-ink-300/60" />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">Rest</div>
              <div className="text-[34px] font-light tracking-tightest tabular mt-1">
                <span className={restSec === 0 ? "text-readiness" : ""}>{restMm}:{restSs}</span>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <HeartRateChart values={hrSeries.slice(8, 28)} />
          </div>
        </div>
      </div>

      {!workout.endedAt && cur && cur.sets.length < cur.targetSets && (
        <div className="px-5 mt-4">
          <div className="card p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-1">Current set</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[18px] mt-1">{cur.name}</div>
                <div className="text-[11px] text-bone-mute mt-0.5">
                  Set {cur.sets.length + 1} of {cur.targetSets}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <NumInput label="Reps" value={reps} step={1} onChange={setReps} />
              <NumInput label="Weight" value={kg} step={2.5} unit="kg" onChange={setKg} />
              <NumInput label="RPE" value={rpe} step={1} min={1} max={10} onChange={setRpe} />
            </div>

            <button
              onClick={() => actions.logSet(reps, kg, rpe)}
              className="mt-4 w-full rounded-2xl bg-bone text-ink py-3.5 font-medium tracking-tight"
            >
              Log set
            </button>

            {cur.sets.length > 0 && (
              <div className="mt-5 border-t border-ink-300/60 pt-4 space-y-2">
                <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-1">Previous sets</div>
                {cur.sets.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-[12px]">
                    <div className="text-bone-mute">Set {i + 1}</div>
                    <div className="flex gap-4 tabular">
                      <span>{s.reps} reps</span>
                      <span>{s.kg} kg</span>
                      <span className="text-bone-mute">RPE {s.rpe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-5 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-3 px-1">Exercises</div>
        <div className="space-y-2">
          {workout.exercises.map((ex, i) => {
            const done = ex.sets.length >= ex.targetSets;
            const active = i === workout.currentIndex && !workout.endedAt;
            return (
              <div key={ex.name} className={`subcard p-3.5 flex items-center justify-between ${active ? "ring-1 ring-bone/40" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full text-[11px] tabular flex items-center justify-center ${done ? "bg-readiness text-ink" : "bg-ink-100 border border-ink-300/60 text-bone-mute"}`}>
                    {done ? "v" : i + 1}
                  </div>
                  <div className="text-[14px]">{ex.name}</div>
                </div>
                <div className="text-[11px] text-bone-mute tabular">{ex.sets.length} / {ex.targetSets} sets</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => actions.skipExercise()} className="rounded-2xl bg-ink-100 border border-ink-300/60 py-3 text-[13px]">
          Skip exercise
        </button>
        <button onClick={() => actions.endWorkout()} className="rounded-2xl bg-strain/90 text-bone py-3 text-[13px] font-medium">
          End workout
        </button>
      </div>
    </div>
  );
}

function NumInput({ label, value, step, unit, min, max, onChange }: { label: string; value: number; step: number; unit?: string; min?: number; max?: number; onChange: (n: number) => void }) {
  return (
    <div className="bg-ink-200 rounded-2xl px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => onChange(Math.max(min ?? -Infinity, +(value - step).toFixed(1)))}
          className="w-7 h-7 rounded-full bg-ink-100 text-bone-mute"
        >
          -
        </button>
        <div className="text-[18px] tabular font-light">{value}{unit && <span className="text-bone-mute text-[10px] ml-1">{unit}</span>}</div>
        <button
          onClick={() => onChange(Math.min(max ?? Infinity, +(value + step).toFixed(1)))}
          className="w-7 h-7 rounded-full bg-bone text-ink"
        >
          +
        </button>
      </div>
    </div>
  );
}
