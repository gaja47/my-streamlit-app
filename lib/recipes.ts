export type Ingredient = {
  name: string;
  qty: string;
  p: number;
  c: number;
  f: number;
  k: number;
};

export type Micro = { name: string; pct: number };

export type Recipe = {
  id: string;
  meal: string;
  time: string;
  title: string;
  prepMin: number;
  cookMin: number;
  servings: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  micros: Micro[];
  ingredients: Ingredient[];
  method: string[];
};

export const recipes: Record<string, Recipe> = {
  breakfast: {
    id: "breakfast",
    meal: "Breakfast",
    time: "07:30",
    title: "Oats, Whey & Berries",
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
      "In a small saucepan, combine oats with milk and a pinch of salt. Bring to a gentle simmer over medium-low heat.",
      "Cook for 3-4 minutes, stirring occasionally, until oats are tender and the mixture thickens.",
      "Remove from heat and let cool for 1 minute (whey clumps in scalding liquid).",
      "Whisk whey isolate with 2 tbsp cold water into a smooth slurry, then fold into the oats.",
      "Top with berries and drizzle with almond butter. Serve immediately.",
    ],
  },

  "snack-am": {
    id: "snack-am",
    meal: "Snack",
    time: "10:30",
    title: "Greek Yogurt & Almonds",
    prepMin: 2,
    cookMin: 0,
    servings: 1,
    kcal: 250,
    protein: 22,
    carbs: 14,
    fat: 12,
    fiber: 3,
    sugar: 10,
    sodium: 90,
    micros: [
      { name: "Calcium", pct: 30 },
      { name: "Vit E", pct: 24 },
      { name: "Mg", pct: 18 },
      { name: "Probiotics", pct: 100 },
    ],
    ingredients: [
      { name: "Greek yogurt, 0% fat", qty: "200 g", p: 20, c: 8, f: 0, k: 110 },
      { name: "Almonds, raw", qty: "20 g", p: 4, c: 4, f: 11, k: 120 },
      { name: "Honey", qty: "5 g", p: 0, c: 4, f: 0, k: 15 },
      { name: "Cinnamon", qty: "pinch", p: 0, c: 0, f: 0, k: 0 },
    ],
    method: [
      "Spoon Greek yogurt into a bowl.",
      "Roughly chop almonds and scatter over the yogurt.",
      "Drizzle with honey and dust with cinnamon. Eat right away.",
    ],
  },

  lunch: {
    id: "lunch",
    meal: "Lunch",
    time: "13:30",
    title: "Chicken Rice Bowl",
    prepMin: 10,
    cookMin: 15,
    servings: 1,
    kcal: 720,
    protein: 52,
    carbs: 78,
    fat: 12,
    fiber: 6,
    sugar: 4,
    sodium: 680,
    micros: [
      { name: "Iron", pct: 22 },
      { name: "B12", pct: 60 },
      { name: "Vit C", pct: 35 },
      { name: "Mg", pct: 18 },
      { name: "Zn", pct: 31 },
    ],
    ingredients: [
      { name: "Chicken breast", qty: "180 g", p: 56, c: 0, f: 6, k: 297 },
      { name: "Basmati rice, cooked", qty: "150 g", p: 4, c: 45, f: 0, k: 200 },
      { name: "Black beans", qty: "60 g", p: 5, c: 12, f: 0, k: 73 },
      { name: "Avocado", qty: "40 g", p: 1, c: 3, f: 6, k: 64 },
      { name: "Bell pepper + salsa + lime", qty: "80 g", p: 2, c: 8, f: 0, k: 40 },
      { name: "Olive oil", qty: "5 ml", p: 0, c: 0, f: 5, k: 44 },
    ],
    method: [
      "Pat chicken dry. Season both sides with paprika, salt, pepper, and a squeeze of lime.",
      "Heat olive oil in a non-stick pan over medium-high. Sear chicken 5-6 min per side until internal temp reads 74°C.",
      "Let chicken rest 3 minutes, then slice across the grain into 1 cm strips.",
      "Warm rice and beans together; brighten with lime juice and salt.",
      "Build the bowl: rice-bean base, chicken on top, sliced avocado, bell pepper, finish with salsa.",
    ],
  },

  preworkout: {
    id: "preworkout",
    meal: "Pre-workout",
    time: "16:30",
    title: "Banana & Black Coffee",
    prepMin: 1,
    cookMin: 0,
    servings: 1,
    kcal: 115,
    protein: 2,
    carbs: 27,
    fat: 0,
    fiber: 3,
    sugar: 14,
    sodium: 5,
    micros: [
      { name: "Potassium", pct: 12 },
      { name: "B6", pct: 22 },
      { name: "Caffeine", pct: 95 },
    ],
    ingredients: [
      { name: "Banana, medium", qty: "120 g", p: 1, c: 27, f: 0, k: 105 },
      { name: "Black coffee", qty: "240 ml", p: 0, c: 0, f: 0, k: 5 },
      { name: "Sea salt", qty: "pinch", p: 0, c: 0, f: 0, k: 0 },
    ],
    method: [
      "Brew coffee strong and black. Add a tiny pinch of sea salt to round the bitterness.",
      "Peel the banana and eat 25-40 minutes before training so glucose peaks during your warm-up.",
    ],
  },

  postworkout: {
    id: "postworkout",
    meal: "Post-workout",
    time: "19:30",
    title: "Whey Isolate Shake",
    prepMin: 2,
    cookMin: 0,
    servings: 1,
    kcal: 270,
    protein: 30,
    carbs: 30,
    fat: 2,
    fiber: 2,
    sugar: 22,
    sodium: 120,
    micros: [
      { name: "BCAAs", pct: 100 },
      { name: "Leucine", pct: 100 },
      { name: "Electrolytes", pct: 40 },
    ],
    ingredients: [
      { name: "Whey isolate", qty: "35 g", p: 28, c: 2, f: 1, k: 130 },
      { name: "Dextrose / sugar", qty: "20 g", p: 0, c: 20, f: 0, k: 80 },
      { name: "Banana, half", qty: "60 g", p: 1, c: 8, f: 0, k: 50 },
      { name: "Cold water", qty: "300 ml", p: 0, c: 0, f: 0, k: 0 },
      { name: "Pinch of salt", qty: "1 g", p: 0, c: 0, f: 0, k: 0 },
    ],
    method: [
      "Add cold water to a shaker first to prevent clumps.",
      "Drop in dextrose and salt; shake until dissolved.",
      "Add whey isolate and banana chunks; shake hard for 10 seconds.",
      "Drink within 30 minutes of finishing your session.",
    ],
  },

  dinner: {
    id: "dinner",
    meal: "Dinner",
    time: "21:00",
    title: "Paneer Stir-fry + Quinoa",
    prepMin: 10,
    cookMin: 15,
    servings: 1,
    kcal: 530,
    protein: 38,
    carbs: 40,
    fat: 22,
    fiber: 7,
    sugar: 6,
    sodium: 520,
    micros: [
      { name: "Calcium", pct: 35 },
      { name: "Iron", pct: 20 },
      { name: "Mg", pct: 28 },
      { name: "Vit C", pct: 60 },
      { name: "Zn", pct: 18 },
    ],
    ingredients: [
      { name: "Paneer, cubed", qty: "140 g", p: 28, c: 4, f: 18, k: 280 },
      { name: "Quinoa, cooked", qty: "120 g", p: 5, c: 26, f: 2, k: 140 },
      { name: "Bell pepper, broccoli, onion", qty: "180 g", p: 4, c: 10, f: 0, k: 60 },
      { name: "Soy sauce, ginger, garlic", qty: "to taste", p: 1, c: 0, f: 0, k: 10 },
      { name: "Sesame oil", qty: "5 ml", p: 0, c: 0, f: 5, k: 40 },
    ],
    method: [
      "Cube paneer; toss with a teaspoon of soy sauce and a pinch of black pepper.",
      "Heat sesame oil in a wok or wide pan over high heat until shimmering.",
      "Sear paneer 1 minute per side until edges are golden; transfer to a plate.",
      "In the same pan, stir-fry ginger and garlic 30 seconds, then add vegetables. Cook 3-4 minutes - they should stay crisp.",
      "Return paneer to the pan, splash with soy sauce, toss once, and serve over warm quinoa.",
    ],
  },
};

export function getRecipe(id: string): Recipe {
  return recipes[id] ?? recipes.breakfast;
}

export const recipeIds = Object.keys(recipes);
