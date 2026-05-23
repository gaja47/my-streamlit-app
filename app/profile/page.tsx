"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { reset, useHydrate, useStore } from "@/lib/store";

export default function Profile() {
  useHydrate();
  const profile = useStore((s) => s.profile);
  const targets = useStore((s) => s.targets);
  const reminders = useStore((s) => s.reminders);
  const workout = useStore((s) => s.workout);

  const completedSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
  const targetSets = workout.exercises.reduce((n, e) => n + e.targetSets, 0);
  const onReminders = reminders.filter((r) => r.on).length;

  const profileNote = profile
    ? `${profile.goal === "cut" ? "Cut" : profile.goal === "bulk" ? "Bulk" : "Recomp"} - ${profile.heightCm} cm - ${profile.weightKg} kg - ${profile.bodyFat}% bf`
    : "Set up your profile to personalize targets";

  const remindersNote = `${onReminders} of ${reminders.length} on`;

  return (
    <div>
      <Header title={profile ? "You" : "Welcome"} subtitle="Pulse" />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-readiness/40 to-sleep/30 border border-ink-300/60 flex items-center justify-center text-[24px] font-light tracking-tightest">
              {profile ? profile.sex === "male" ? "M" : "F" : "?"}
            </div>
            <div>
              <div className="text-[18px]">{profile ? `Age ${profile.age}` : "Welcome"}</div>
              <div className="text-[11px] text-bone-mute">{profileNote}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            <Stat label="Calories" v={targets.calories.toString()} unit="kcal" />
            <Stat label="Protein" v={targets.protein.toString()} unit="g/day" />
            <Stat label="Sets done" v={`${completedSets}/${targetSets}`} unit="today" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-4">
        <div className="card overflow-hidden">
          <Row href="/onboarding" label={profile ? "Physique profile" : "Set up profile"} note={profileNote} />
          <Row href="/reminders" label="Reminders" note={remindersNote} />
          <Row href="/workout" label="Workout" note={`${workout.title} - ${completedSets}/${targetSets} sets`} />
          <Row href="/meals" label="Meals" note={`Targets: ${targets.calories} kcal / ${targets.protein}P / ${targets.carbs}C / ${targets.fat}F`} />
        </div>
      </div>

      <div className="px-5 mt-4">
        <button
          onClick={() => {
            if (confirm("Reset all your data?")) reset();
          }}
          className="w-full text-[12px] text-bone-mute py-2"
        >
          Reset all data
        </button>
      </div>

      <div className="px-5 mt-4 text-center">
        <div className="text-[10px] text-bone-mute uppercase tracking-[0.25em]">Pulse - v0.2</div>
      </div>
    </div>
  );
}

function Stat({ label, v, unit }: { label: string; v: string; unit: string }) {
  return (
    <div className="bg-ink-100 rounded-2xl py-3 border border-ink-300/60">
      <div className="text-[18px] tabular font-light tracking-tightest">{v}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mt-1">{label}</div>
      <div className="text-[9px] text-bone-mute mt-0.5">{unit}</div>
    </div>
  );
}

function Row({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-5 py-4 border-b border-ink-300/60 last:border-b-0">
      <div className="flex-1 min-w-0 pr-3">
        <div className="text-[14px]">{label}</div>
        <div className="text-[11px] text-bone-mute mt-0.5 truncate">{note}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
    </Link>
  );
}
