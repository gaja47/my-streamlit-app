export const user = {
  name: "Gaja",
  goal: "Recomp",
  day: 12,
  totalDays: 84,
};

export const targets = {
  calories: 2720,
  protein: 168,
  carbs: 306,
  fat: 76,
  fiber: 38,
  water_l: 3.0,
};

export const consumed = {
  calories: 2127,
  protein: 172,
  carbs: 221,
  fat: 46,
  fiber: 17,
  water_l: 1.8,
};

export const readiness = {
  score: 78,
  hrv: 62,
  rhr: 54,
  resp: 14.2,
  spo2: 97,
  skinTempDelta: 0.3,
  sleepHours: 7.7,
};

export const activity = {
  moveCalories: 720,
  moveTarget: 870,
  exerciseMin: 42,
  exerciseTarget: 60,
  standHours: 12,
  standTarget: 12,
  steps: 8420,
  stepsTarget: 10000,
  strain: 11.4,
};

export const hrSeries = [
  58, 56, 55, 54, 54, 55, 58, 64, 72, 80, 88, 95, 110, 130, 148, 162, 158, 142, 128,
  118, 108, 100, 95, 92, 88, 85, 84, 88, 96, 102, 110, 118, 122, 118, 110, 102, 94,
  88, 84, 80, 76, 72, 70, 68, 66, 64, 62, 60, 58, 56,
];

export const hrvSeries = [58, 60, 55, 61, 64, 59, 62];
export const rhrSeries = [56, 55, 56, 54, 55, 54, 54];

export const sleepStages: { stage: "awake" | "rem" | "light" | "deep"; minutes: number }[] = [
  { stage: "awake", minutes: 5 },
  { stage: "light", minutes: 40 },
  { stage: "deep", minutes: 35 },
  { stage: "light", minutes: 25 },
  { stage: "rem", minutes: 22 },
  { stage: "light", minutes: 40 },
  { stage: "deep", minutes: 25 },
  { stage: "light", minutes: 30 },
  { stage: "rem", minutes: 32 },
  { stage: "light", minutes: 35 },
  { stage: "awake", minutes: 5 },
  { stage: "light", minutes: 45 },
  { stage: "rem", minutes: 24 },
  { stage: "deep", minutes: 12 },
  { stage: "light", minutes: 27 },
  { stage: "awake", minutes: 10 },
  { stage: "rem", minutes: 30 },
  { stage: "light", minutes: 20 },
];

export type Meal = {
  id: string;
  time: string;
  name: string;
  title: string;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  status: "logged" | "upcoming" | "now";
  eta?: string;
};

export const meals: Meal[] = [
  { id: "breakfast", time: "07:30", name: "Breakfast", title: "Oats, Whey & Berries", servings: 1, kcal: 520, protein: 38, carbs: 62, fat: 11, status: "logged" },
  { id: "snack-am", time: "10:30", name: "Snack", title: "Greek Yogurt + Almonds", servings: 1, kcal: 250, protein: 22, carbs: 14, fat: 12, status: "logged" },
  { id: "lunch", time: "13:30", name: "Lunch", title: "Chicken Rice Bowl", servings: 1, kcal: 720, protein: 52, carbs: 78, fat: 12, status: "logged" },
  { id: "preworkout", time: "16:30", name: "Pre-workout", title: "Banana + Black Coffee", servings: 1, kcal: 115, protein: 2, carbs: 27, fat: 0, status: "logged" },
  { id: "postworkout", time: "19:30", name: "Post-workout", title: "Whey Isolate Shake", servings: 1, kcal: 270, protein: 30, carbs: 30, fat: 2, status: "now", eta: "1h 12m" },
  { id: "dinner", time: "21:00", name: "Dinner", title: "Paneer Stir-fry + Quinoa", servings: 1, kcal: 530, protein: 38, carbs: 40, fat: 22, status: "upcoming", eta: "2h 42m" },
];

export const mealDetail = {
  id: "breakfast",
  title: "Oats, Whey & Berries",
  meal: "Breakfast",
  time: "07:30",
  prepMin: 5,
  cookMin: 4,
  servings: 1,
  kcal: 520,
  protein: 38,
  carbs: 62,
  fat: 11,
  fiber: 8,
  sugar: 14,
  sodium: 180,
  micros: [
    { name: "Calcium", pct: 28 },
    { name: "Iron", pct: 18 },
    { name: "Vit C", pct: 45 },
    { name: "B12", pct: 60 },
    { name: "Mg", pct: 22 },
  ],
  ingredients: [
    { name: "Rolled oats", qty: "60 g", p: 8, c: 40, f: 4, k: 230 },
    { name: "Whey isolate", qty: "30 g", p: 24, c: 2, f: 1, k: 120 },
    { name: "Mixed berries", qty: "80 g", p: 1, c: 12, f: 0, k: 50 },
    { name: "Almond butter", qty: "10 g", p: 2, c: 2, f: 5, k: 60 },
    { name: "Milk, low-fat", qty: "120 ml", p: 4, c: 6, f: 2, k: 60 },
  ],
  method: [
    "Cook oats with milk over low heat for 4 minutes.",
    "Stir in whey isolate off heat to prevent clumping.",
    "Top with berries and a drizzle of almond butter.",
  ],
};

export const workout = {
  title: "Push Day",
  elapsed: "00:24:18",
  hr: 142,
  zone: 3,
  cals: 186,
  strain: 6.4,
  avgHr: 138,
  peakHr: 162,
  exercises: [
    { name: "Bench press", sets: [{ reps: 8, kg: 72.5, rpe: 8 }, { reps: 8, kg: 72.5, rpe: 8 }, { reps: 7, kg: 72.5, rpe: 9 }], target: 4, current: 3, rest: "01:14" },
    { name: "Incline DB press", sets: [], target: 3, current: 0 },
    { name: "Overhead press", sets: [], target: 4, current: 0 },
    { name: "Cable fly", sets: [], target: 3, current: 0 },
    { name: "Triceps pushdown", sets: [], target: 3, current: 0 },
    { name: "Lateral raise", sets: [], target: 4, current: 0 },
  ],
};

export const reminders = [
  { time: "07:20", title: "Breakfast prep", note: "Oats + whey + berries · 520 kcal", on: true },
  { time: "10:20", title: "Mid-morning snack", note: "Greek yogurt + almonds · 250 kcal", on: true },
  { time: "13:20", title: "Lunch", note: "Chicken rice bowl · P52 C78 F12 · 720 kcal", on: true },
  { time: "16:20", title: "Pre-workout", note: "Banana + black coffee · 115 kcal", on: true },
  { time: "17:55", title: "Strength session", note: "Push day · ~50 min", on: true },
  { time: "19:20", title: "Post-workout shake", note: "Whey isolate · 270 kcal", on: true },
  { time: "20:50", title: "Dinner", note: "Paneer stir-fry + quinoa · 530 kcal", on: true },
  { time: "22:30", title: "Wind-down + log day", note: "Reflect and prep for sleep", on: true },
  { time: "every 90 min", title: "Water reminder", note: "Aim for 3.0 L today", on: true },
];
