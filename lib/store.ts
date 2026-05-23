"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  meals as defaultMeals,
  reminders as defaultReminders,
  workout as defaultWorkout,
} from "./mockData";
import type { DietId } from "./regions";

export type Profile = {
  sex: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFat: number;
  activity: "sedentary" | "light" | "moderate" | "athlete";
  goal: "cut" | "recomp" | "bulk";
};

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type LoggedMeal = {
  id: string;
  time: string;
  name: string;
  title: string;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: number | null;
};

export type SetEntry = { reps: number; kg: number; rpe: number; loggedAt: number };
export type ExerciseEntry = { name: string; targetSets: number; sets: SetEntry[] };
export type WorkoutEntry = {
  date: string;
  title: string;
  startedAt: number;
  endedAt?: number;
  currentIndex: number;
  exercises: ExerciseEntry[];
};

export type Reminder = { time: string; title: string; note: string; on: boolean };

export type ThemeId = "noir" | "snow" | "violet";

export type Settings = {
  channels: { push: boolean; telegram: boolean; email: boolean };
  leadMin: number;
  theme: ThemeId;
};

export type Account = {
  username: string;
  displayName: string;
  country: string; // ISO code
  diet: DietId;
  createdAt: number;
};

export type AppState = {
  account: Account | null;
  profile: Profile | null;
  targets: Targets;
  selectedProgramId: string | null;
  selectedPlanId: string | null;
  today: { date: string; meals: LoggedMeal[]; waterMl: number };
  workout: WorkoutEntry;
  reminders: Reminder[];
  settings: Settings;
};

const STORAGE_KEY = "pulse:v1";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const defaultState: AppState = {
  account: null,
  profile: null,
  targets: { calories: 2720, protein: 168, carbs: 306, fat: 76 },
  selectedProgramId: null,
  selectedPlanId: null,
  today: {
    date: today(),
    meals: defaultMeals.map((m) => ({
      ...m,
      loggedAt: m.status === "logged" ? Date.now() - 3600_000 : null,
    })),
    waterMl: 1800,
  },
  workout: {
    date: today(),
    title: defaultWorkout.title,
    startedAt: Date.now(),
    currentIndex: 0,
    exercises: defaultWorkout.exercises.map((e) => ({
      name: e.name,
      targetSets: e.target,
      sets: e.sets.map((s) => ({ ...s, loggedAt: Date.now() })),
    })),
  },
  reminders: defaultReminders.map((r) => ({ time: r.time, title: r.title, note: r.note, on: r.on })),
  settings: { channels: { push: true, telegram: true, email: false }, leadMin: 10, theme: "noir" },
};

let state: AppState = defaultState;
const listeners = new Set<() => void>();
let hydrated = false;

function load(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const merged: AppState = { ...defaultState, ...parsed };
    if (merged.today.date !== today()) {
      // new day: keep meal templates but unlog them
      merged.today = {
        date: today(),
        meals: defaultState.today.meals.map((m) => ({ ...m, loggedAt: null })),
        waterMl: 0,
      };
    }
    return merged;
  } catch {
    return defaultState;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function notify() {
  listeners.forEach((l) => l());
}

export function update(updater: (s: AppState) => AppState) {
  state = updater(state);
  persist();
  notify();
}

export function reset() {
  state = defaultState;
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  notify();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return defaultState;
}

export function useStore<T>(selector: (s: AppState) => T): T {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector(snap);
}

export function useHydrate() {
  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    state = load();
    notify();
  }, []);
}

// ---------- selectors ----------
export const totals = (s: AppState) => {
  return s.today.meals
    .filter((m) => m.loggedAt !== null)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.kcal * m.servings,
        protein: acc.protein + m.protein * m.servings,
        carbs: acc.carbs + m.carbs * m.servings,
        fat: acc.fat + m.fat * m.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
};

// ---------- actions ----------
export const actions = {
  setProfile(profile: Profile, targets: Targets) {
    update((s) => ({ ...s, profile, targets }));
  },
  toggleMealLogged(id: string) {
    update((s) => ({
      ...s,
      today: {
        ...s.today,
        meals: s.today.meals.map((m) =>
          m.id === id ? { ...m, loggedAt: m.loggedAt ? null : Date.now() } : m
        ),
      },
    }));
  },
  setMealServings(id: string, servings: number) {
    update((s) => ({
      ...s,
      today: {
        ...s.today,
        meals: s.today.meals.map((m) => (m.id === id ? { ...m, servings } : m)),
      },
    }));
  },
  addWater(ml: number) {
    update((s) => ({ ...s, today: { ...s.today, waterMl: Math.max(0, s.today.waterMl + ml) } }));
  },
  logSet(reps: number, kg: number, rpe: number) {
    update((s) => {
      const idx = s.workout.currentIndex;
      const exercises = s.workout.exercises.map((e, i) =>
        i === idx ? { ...e, sets: [...e.sets, { reps, kg, rpe, loggedAt: Date.now() }] } : e
      );
      const cur = exercises[idx];
      const advance = cur.sets.length >= cur.targetSets;
      return {
        ...s,
        workout: {
          ...s.workout,
          exercises,
          currentIndex: advance ? Math.min(idx + 1, exercises.length - 1) : idx,
        },
      };
    });
  },
  skipExercise() {
    update((s) => ({
      ...s,
      workout: {
        ...s.workout,
        currentIndex: Math.min(s.workout.currentIndex + 1, s.workout.exercises.length - 1),
      },
    }));
  },
  endWorkout() {
    update((s) => ({ ...s, workout: { ...s.workout, endedAt: Date.now() } }));
  },
  toggleReminder(idx: number) {
    update((s) => ({
      ...s,
      reminders: s.reminders.map((r, i) => (i === idx ? { ...r, on: !r.on } : r)),
    }));
  },
  setChannel(channel: keyof Settings["channels"], on: boolean) {
    update((s) => ({
      ...s,
      settings: { ...s.settings, channels: { ...s.settings.channels, [channel]: on } },
    }));
  },
  setTheme(theme: ThemeId) {
    update((s) => ({ ...s, settings: { ...s.settings, theme } }));
  },
  signUp(username: string, displayName: string, country: string, diet: DietId) {
    update((s) => ({
      ...s,
      account: {
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        country,
        diet,
        createdAt: Date.now(),
      },
    }));
  },
  setCountry(country: string) {
    update((s) => (s.account ? { ...s, account: { ...s.account, country } } : s));
  },
  setDiet(diet: DietId) {
    update((s) => (s.account ? { ...s, account: { ...s.account, diet } } : s));
  },
  logOut() {
    update((s) => ({ ...s, account: null }));
  },
  setSelectedProgram(id: string | null) {
    update((s) => ({ ...s, selectedProgramId: id }));
  },
  setSelectedPlan(id: string | null) {
    update((s) => ({ ...s, selectedPlanId: id }));
  },
};
