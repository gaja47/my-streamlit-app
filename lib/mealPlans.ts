export type MealSlot = {
  time: string;
  meal: string;
  recipeId: string;
  servings: number;
};

export type MealPlan = {
  id: string;
  name: string;
  goal: "cut" | "recomp" | "lean_bulk" | "mass";
  targetCal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  description: string;
  bestFor: string[];
  meals: MealSlot[];
};

export const mealPlans: Record<string, MealPlan> = {
  cut_1800: {
    id: "cut_1800",
    name: "Lean Cut - 1800 kcal",
    goal: "cut",
    targetCal: 1800,
    targetProtein: 180,
    targetCarbs: 150,
    targetFat: 60,
    description:
      "Aggressive but sustainable fat-loss plan. Very high protein (1.0 g per lb of bodyweight) preserves muscle while in a deficit. Carbs are timed around training; fat is moderate. Best paired with a 3-4x/week strength program.",
    bestFor: ["Fat loss with muscle retention", "Pre-event leaning out", "Anyone 70-90 kg cutting"],
    meals: [
      { time: "07:30", meal: "Breakfast", recipeId: "eggs_oats", servings: 1 },
      { time: "10:30", meal: "Snack", recipeId: "snack-am", servings: 1 },
      { time: "13:30", meal: "Lunch", recipeId: "tuna_wrap", servings: 1 },
      { time: "16:30", meal: "Pre-workout", recipeId: "preworkout", servings: 1 },
      { time: "19:30", meal: "Post-workout", recipeId: "postworkout", servings: 1 },
      { time: "21:00", meal: "Dinner", recipeId: "salmon_sweet_potato", servings: 1 },
    ],
  },

  recomp_2700: {
    id: "recomp_2700",
    name: "Body Recomposition - 2700 kcal",
    goal: "recomp",
    targetCal: 2700,
    targetProtein: 170,
    targetCarbs: 300,
    targetFat: 75,
    description:
      "Hold roughly maintenance calories with high protein to build muscle and shed fat simultaneously. Works best for early-intermediate lifters or anyone returning from a layoff.",
    bestFor: ["Early-intermediate lifters", "Returning after a break", "Slow & steady progress"],
    meals: [
      { time: "07:30", meal: "Breakfast", recipeId: "breakfast", servings: 1 },
      { time: "10:30", meal: "Snack", recipeId: "snack-am", servings: 1 },
      { time: "13:30", meal: "Lunch", recipeId: "lunch", servings: 1 },
      { time: "16:30", meal: "Pre-workout", recipeId: "preworkout", servings: 1 },
      { time: "19:30", meal: "Post-workout", recipeId: "postworkout", servings: 1 },
      { time: "21:00", meal: "Dinner", recipeId: "dinner", servings: 1 },
    ],
  },

  lean_bulk_3000: {
    id: "lean_bulk_3000",
    name: "Lean Bulk - 3000 kcal",
    goal: "lean_bulk",
    targetCal: 3000,
    targetProtein: 180,
    targetCarbs: 350,
    targetFat: 80,
    description:
      "Controlled surplus of ~250-350 kcal for steady muscle gain (target 0.25-0.5 kg per month) while staying lean. Heavier carbs to fuel training volume.",
    bestFor: ["Slow lean gaining", "Post-cut rebuild", "Anyone 70-85 kg adding muscle"],
    meals: [
      { time: "07:30", meal: "Breakfast", recipeId: "breakfast", servings: 1.25 },
      { time: "10:30", meal: "Snack", recipeId: "cottage_pancakes", servings: 1 },
      { time: "13:30", meal: "Lunch", recipeId: "lunch", servings: 1.25 },
      { time: "16:30", meal: "Pre-workout", recipeId: "preworkout", servings: 1 },
      { time: "19:30", meal: "Post-workout", recipeId: "postworkout", servings: 1.25 },
      { time: "21:00", meal: "Dinner", recipeId: "chicken_pasta", servings: 1 },
    ],
  },

  mass_3500: {
    id: "mass_3500",
    name: "Mass Gain - 3500 kcal",
    goal: "mass",
    targetCal: 3500,
    targetProtein: 200,
    targetCarbs: 400,
    targetFat: 100,
    description:
      "Aggressive surplus for hardgainers and anyone struggling to put on size. Aim for 0.5-0.75 kg per month; pull calories back if waist measurements grow faster than that.",
    bestFor: ["Hardgainers / ectomorphs", "Off-season strength athletes", "Adding size as a beginner"],
    meals: [
      { time: "07:00", meal: "Breakfast", recipeId: "eggs_oats", servings: 1.5 },
      { time: "10:00", meal: "Snack", recipeId: "smoothie_bowl", servings: 1 },
      { time: "13:00", meal: "Lunch", recipeId: "chicken_pasta", servings: 1.25 },
      { time: "16:30", meal: "Pre-workout", recipeId: "preworkout", servings: 1 },
      { time: "19:30", meal: "Post-workout", recipeId: "postworkout", servings: 1.5 },
      { time: "21:30", meal: "Dinner", recipeId: "salmon_sweet_potato", servings: 1.5 },
    ],
  },
};

export const mealPlanList = Object.values(mealPlans);
export const mealPlanIds = Object.keys(mealPlans);

export function planFromGoal(goal: "cut" | "recomp" | "bulk"): MealPlan {
  if (goal === "cut") return mealPlans.cut_1800;
  if (goal === "bulk") return mealPlans.lean_bulk_3000;
  return mealPlans.recomp_2700;
}
