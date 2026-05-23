import type { Profile, Targets } from "./store";

const ACTIVITY_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, athlete: 1.725 } as const;
const GOAL_MULT = { cut: 0.8, recomp: 1.0, bulk: 1.1 } as const;

export function computeTargets(p: Profile): Targets & { bmr: number; tdee: number } {
  const s = p.sex === "male" ? 5 : -161;
  const bmr = Math.round(10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + s);
  const tdee = Math.round(bmr * ACTIVITY_MULT[p.activity]);
  const cal = Math.round((tdee * GOAL_MULT[p.goal]) / 10) * 10;
  const protein = Math.round(p.weightKg * 2.2);
  const fat = Math.round((cal * 0.25) / 9);
  const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
  return { calories: cal, protein, carbs, fat, bmr, tdee };
}
