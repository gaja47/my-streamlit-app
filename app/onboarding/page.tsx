"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { actions, useHydrate, useStore } from "@/lib/store";
import { computeTargets } from "@/lib/calc";

export default function Onboarding() {
  useHydrate();
  const router = useRouter();
  const saved = useStore((s) => s.profile);

  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(28);
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(76.4);
  const [bodyFat, setBodyFat] = useState(14);
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "athlete">("moderate");
  const [goal, setGoal] = useState<"cut" | "recomp" | "bulk">("recomp");

  useEffect(() => {
    if (saved) {
      setSex(saved.sex);
      setAge(saved.age);
      setHeightCm(saved.heightCm);
      setWeightKg(saved.weightKg);
      setBodyFat(saved.bodyFat);
      setActivity(saved.activity);
      setGoal(saved.goal);
    }
  }, [saved]);

  const t = useMemo(
    () => computeTargets({ sex, age, heightCm, weightKg, bodyFat, activity, goal }),
    [sex, age, heightCm, weightKg, activity, goal, bodyFat]
  );

  function save() {
    actions.setProfile(
      { sex, age, heightCm, weightKg, bodyFat, activity, goal },
      { calories: t.calories, protein: t.protein, carbs: t.carbs, fat: t.fat }
    );
    router.push("/");
  }

  return (
    <div>
      <Header title="Tell us about you" subtitle={saved ? "Update your profile" : "Setup · 1 of 1"} back="/" />
      <div className="px-5 space-y-4 mt-2">
        <div className="card p-5 space-y-5">
          <Segment label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} />
          <NumberField label="Age" value={age} unit="yr" min={14} max={90} onChange={setAge} />
          <NumberField label="Height" value={heightCm} unit="cm" min={140} max={220} step={1} onChange={setHeightCm} />
          <NumberField label="Weight" value={weightKg} unit="kg" min={35} max={180} step={0.1} onChange={setWeightKg} />
          <NumberField label="Body fat" value={bodyFat} unit="%" min={3} max={50} onChange={setBodyFat} />
          <Segment label="Activity" value={activity} onChange={(v) => setActivity(v as any)} options={[
            { label: "Low", value: "sedentary" },
            { label: "Light", value: "light" },
            { label: "Moderate", value: "moderate" },
            { label: "Athlete", value: "athlete" },
          ]} />
          <Segment label="Goal" value={goal} onChange={(v) => setGoal(v as any)} options={[
            { label: "Cut -20%", value: "cut" },
            { label: "Recomp", value: "recomp" },
            { label: "Bulk +10%", value: "bulk" },
          ]} />
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute">Your targets</div>
          <div className="text-[40px] font-light tracking-tightest mt-2 tabular">
            {t.calories}<span className="text-bone-mute text-base"> kcal/day</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <BigStat label="Protein" v={t.protein} unit="g" color="#95c9a6" />
            <BigStat label="Carbs" v={t.carbs} unit="g" color="#e0a589" />
            <BigStat label="Fat" v={t.fat} unit="g" color="#c98ba8" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-bone-mute">
            <div>BMR <span className="text-bone tabular ml-2">{t.bmr}</span></div>
            <div>TDEE <span className="text-bone tabular ml-2">{t.tdee}</span></div>
          </div>
        </div>

        <button onClick={save} className="w-full rounded-2xl bg-bone text-ink py-4 font-medium tracking-tight">
          {saved ? "Update profile" : "Save profile"}
        </button>
      </div>
    </div>
  );
}

function NumberField({ label, value, unit, min, max, step = 1, onChange }: { label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute">{label}</div>
        <div className="text-[20px] font-light tabular tracking-tightest">
          {value}<span className="text-bone-mute text-[12px] ml-1">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-readiness h-1 rounded bg-ink-300" />
    </div>
  );
}

function Segment({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mb-2">{label}</div>
      <div className="bg-ink-200 rounded-2xl p-1 flex">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button key={o.value} onClick={() => onChange(o.value)} className={`flex-1 py-2.5 rounded-xl text-[12px] tracking-wide transition ${active ? "bg-bone text-ink" : "text-bone-dim"}`}>
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
