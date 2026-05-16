"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function Onboarding() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(76.4);
  const [bodyFat, setBodyFat] = useState(14);
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "athlete">("moderate");
  const [goal, setGoal] = useState<"cut" | "recomp" | "bulk">("recomp");

  const targets = useMemo(() => {
    // Mifflin–St Jeor
    const s = sex === "male" ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, athlete: 1.725 }[activity];
    const tdee = bmr * mult;
    const goalMult = goal === "cut" ? 0.8 : goal === "bulk" ? 1.1 : 1.0;
    const cal = Math.round((tdee * goalMult) / 10) * 10;
    const protein = Math.round(weightKg * 2.2);
    const fat = Math.round((cal * 0.25) / 9);
    const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), cal, protein, carbs, fat };
  }, [sex, age, heightCm, weightKg, activity, goal]);

  return (
    <div>
      <Header title="Tell us about you" subtitle="Setup · 1 of 1" back="/" />
      <div className="px-5 space-y-4 mt-2">
        <div className="card p-5 space-y-5">
          <Segment
            label="Sex"
            value={sex}
            onChange={(v) => setSex(v as any)}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ]}
          />

          <NumberField label="Age" value={age} unit="yr" min={14} max={90} onChange={setAge} />
          <NumberField label="Height" value={heightCm} unit="cm" min={140} max={220} step={1} onChange={setHeightCm} />
          <NumberField label="Weight" value={weightKg} unit="kg" min={35} max={180} step={0.1} onChange={setWeightKg} />
          <NumberField label="Body fat" value={bodyFat} unit="%" min={3} max={50} onChange={setBodyFat} />

          <Segment
            label="Activity"
            value={activity}
            onChange={(v) => setActivity(v as any)}
            options={[
              { label: "Low", value: "sedentary" },
              { label: "Light", value: "light" },
              { label: "Moderate", value: "moderate" },
              { label: "Athlete", value: "athlete" },
            ]}
          />

          <Segment
            label="Goal"
            value={goal}
            onChange={(v) => setGoal(v as any)}
            options={[
              { label: "Cut −20%", value: "cut" },
              { label: "Recomp", value: "recomp" },
              { label: "Bulk +10%", value: "bulk" },
            ]}
          />
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Your targets</div>
          <div className="text-[40px] font-light tracking-tightest mt-2 tabular">
            {targets.cal}<span className="text-bone-mute text-base"> kcal/day</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <BigStat label="Protein" v={targets.protein} unit="g" color="#95c9a6" />
            <BigStat label="Carbs" v={targets.carbs} unit="g" color="#e0a589" />
            <BigStat label="Fat" v={targets.fat} unit="g" color="#c98ba8" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-bone-mute">
            <div>BMR <span className="text-bone tabular ml-2">{targets.bmr}</span></div>
            <div>TDEE <span className="text-bone tabular ml-2">{targets.tdee}</span></div>
          </div>
        </div>

        <Link href="/" className="block">
          <button className="w-full rounded-2xl bg-bone text-ink py-4 font-medium tracking-tight">
            Save profile
          </button>
        </Link>
      </div>
    </div>
  );
}

function NumberField({
  label, value, unit, min, max, step = 1, onChange,
}: {
  label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
        <div className="text-[20px] font-light tabular tracking-tightest">
          {value}<span className="text-bone-mute text-[12px] ml-1">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-readiness h-1 rounded bg-ink-300"
      />
    </div>
  );
}

function Segment({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[];
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mb-2">{label}</div>
      <div className="bg-ink-200 rounded-2xl p-1 flex">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`flex-1 py-2.5 rounded-xl text-[12px] tracking-wide transition ${
                active ? "bg-bone text-ink" : "text-bone-dim"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BigStat({ label, v, unit, color }: { label: string; v: number; unit: string; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
      </div>
      <div className="text-[22px] font-light tabular tracking-tightest mt-1">
        {v}<span className="text-bone-mute text-[11px] ml-1">{unit}</span>
      </div>
    </div>
  );
}
