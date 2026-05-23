"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { actions, reset, useHydrate, useStore, type ThemeId } from "@/lib/store";

const THEMES: { id: ThemeId; name: string; desc: string }[] = [
  { id: "noir", name: "Noir", desc: "Minimal dark, sage accents" },
  { id: "snow", name: "Snow", desc: "Clean light, warm accents" },
  { id: "violet", name: "Violet", desc: "Deep night, violet glow" },
];

export default function Profile() {
  useHydrate();
  const account = useStore((s) => s.account);
  const profile = useStore((s) => s.profile);
  const targets = useStore((s) => s.targets);
  const reminders = useStore((s) => s.reminders);
  const workout = useStore((s) => s.workout);
  const theme = useStore((s) => s.settings.theme);
  const selectedProgramId = useStore((s) => s.selectedProgramId);
  const selectedPlanId = useStore((s) => s.selectedPlanId);

  const completedSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
  const targetSets = workout.exercises.reduce((n, e) => n + e.targetSets, 0);
  const onReminders = reminders.filter((r) => r.on).length;

  const profileNote = profile
    ? `${profile.goal === "cut" ? "Cut" : profile.goal === "bulk" ? "Bulk" : "Recomp"} - ${profile.heightCm} cm - ${profile.weightKg} kg - ${profile.bodyFat}% bf`
    : "Set up your profile to personalize targets";

  return (
    <div>
      <Header title={account?.displayName || "You"} subtitle={account ? `@${account.username}` : "Pulse - guest"} />

      <div className="px-5 mt-2">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border flex items-center justify-center text-[24px] font-light tracking-tightest" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
              {(account?.displayName || account?.username || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-[18px]">{account?.displayName || "Guest"}</div>
              <div className="text-[11px]" style={{ color: "var(--text-mute)" }}>{profileNote}</div>
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
        <button
          onClick={() => {
            const i = THEMES.findIndex((t) => t.id === theme);
            const next = THEMES[(i + 1) % THEMES.length];
            actions.setTheme(next.id);
          }}
          className="w-full card p-5 flex items-center justify-between text-left"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-mute)" }}>Theme</div>
            <div className="text-[18px] mt-1">{THEMES.find((t) => t.id === theme)?.name ?? "Noir"}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-mute)" }}>
              {THEMES.find((t) => t.id === theme)?.desc} · tap to switch
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-mute)" }}>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>

      <div className="px-5 mt-4">
        <div className="card overflow-hidden">
          <Row href="/signup" label={account ? "Account" : "Create account"} note={account ? `@${account.username}` : "Optional - claim a handle"} />
          <Row href="/onboarding" label={profile ? "Physique profile" : "Set up profile"} note={profileNote} />
          <Row href="/programs" label="Workout programs" note={selectedProgramId ? `Following: ${selectedProgramId}` : "Browse programs (PPL, 5/3/1, full body, upper/lower)"} />
          <Row href="/exercises" label="Exercise library" note="30+ exercises with form cues" />
          <Row href="/recipes" label="Recipes" note={account ? `Filtered for ${account.diet} (${account.country})` : "Browse all recipes"} />
          <Row href="/plans" label="Meal plans" note={selectedPlanId ? `Following: ${selectedPlanId}` : "Cut, recomp, lean bulk, mass gain"} />
          <Row href="/reminders" label="Reminders" note={`${onReminders} of ${reminders.length} on`} />
        </div>
      </div>

      <div className="px-5 mt-4">
        <button
          onClick={() => {
            if (confirm("Reset all your data? This cannot be undone.")) reset();
          }}
          className="w-full text-[12px] py-2" style={{ color: "var(--text-mute)" }}
        >
          Reset all data
        </button>
      </div>

      <div className="px-5 mt-4 text-center">
        <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-mute)" }}>Pulse - v0.3</div>
      </div>
    </div>
  );
}

function Stat({ label, v, unit }: { label: string; v: string; unit: string }) {
  return (
    <div className="rounded-2xl py-3 border" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
      <div className="text-[18px] tabular font-light tracking-tightest">{v}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: "var(--text-mute)" }}>{label}</div>
      <div className="text-[9px] mt-0.5" style={{ color: "var(--text-mute)" }}>{unit}</div>
    </div>
  );
}

function Row({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-5 py-4 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
      <div className="flex-1 min-w-0 pr-3">
        <div className="text-[14px]">{label}</div>
        <div className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-mute)" }}>{note}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-mute)" }}><path d="M9 6l6 6-6 6" /></svg>
    </Link>
  );
}
