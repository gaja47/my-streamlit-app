export type Ingredient = {
  name: string;
  qty: string;
  p: number;
  c: number;
  f: number;
  k: number;
};

export type Micro = { name: string; pct: number };

import type { DietId } from "./regions";

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
  diet?: DietId;
  cuisine?: string;
  regions?: string[]; // ISO codes or "*" for global
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
    diet: "omnivore",
    cuisine: "tex-mex",
    regions: ["*"],
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
    diet: "vegan",
    cuisine: "global",
    regions: ["*"],
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

recipes.eggs_oats = {
  id: "eggs_oats",
  diet: "eggetarian",
  cuisine: "global",
  regions: ["*"],
  meal: "Breakfast",
  time: "07:30",
  title: "Eggs & Oatmeal",
  prepMin: 5,
  cookMin: 8,
  servings: 1,
  kcal: 600,
  protein: 42,
  carbs: 55,
  fat: 20,
  fiber: 8,
  sugar: 6,
  sodium: 360,
  micros: [
    { name: "B12", pct: 80 },
    { name: "Choline", pct: 50 },
    { name: "Iron", pct: 22 },
    { name: "Mg", pct: 24 },
  ],
  ingredients: [
    { name: "Whole eggs", qty: "3 large", p: 18, c: 1, f: 15, k: 215 },
    { name: "Egg whites", qty: "100 g", p: 11, c: 1, f: 0, k: 50 },
    { name: "Rolled oats", qty: "60 g", p: 8, c: 40, f: 4, k: 230 },
    { name: "Milk, low-fat", qty: "100 ml", p: 3, c: 5, f: 1, k: 50 },
    { name: "Berries", qty: "60 g", p: 0, c: 9, f: 0, k: 36 },
  ],
  method: [
    "Start the oats with milk and a pinch of salt on low heat; stir occasionally.",
    "While oats cook, beat eggs + egg whites with cracked pepper.",
    "Cook eggs in a non-stick pan over medium-low, stirring gently for soft curds (~3 min).",
    "Plate oats, top with berries, serve eggs on the side.",
  ],
};

recipes.tuna_wrap = {
  id: "tuna_wrap",
  diet: "pescatarian",
  cuisine: "global",
  regions: ["*"],
  meal: "Lunch",
  time: "13:30",
  title: "Tuna & Greens Wrap",
  prepMin: 8,
  cookMin: 0,
  servings: 1,
  kcal: 430,
  protein: 38,
  carbs: 40,
  fat: 12,
  fiber: 7,
  sugar: 4,
  sodium: 720,
  micros: [
    { name: "Omega-3", pct: 60 },
    { name: "B12", pct: 80 },
    { name: "Selenium", pct: 90 },
    { name: "Vit C", pct: 25 },
  ],
  ingredients: [
    { name: "Tuna in water, drained", qty: "1 can (140 g)", p: 30, c: 0, f: 1, k: 140 },
    { name: "Whole-wheat tortilla", qty: "1 large", p: 6, c: 32, f: 5, k: 200 },
    { name: "Greek yogurt", qty: "30 g", p: 3, c: 1, f: 0, k: 16 },
    { name: "Dijon mustard", qty: "5 g", p: 0, c: 0, f: 0, k: 5 },
    { name: "Mixed greens, tomato, cucumber", qty: "100 g", p: 1, c: 6, f: 0, k: 25 },
    { name: "Olive oil", qty: "5 ml", p: 0, c: 0, f: 5, k: 44 },
  ],
  method: [
    "Drain tuna well and flake into a bowl.",
    "Stir in Greek yogurt and Dijon; season with pepper and a squeeze of lemon if you have it.",
    "Pile mixed greens, tomato, cucumber and tuna onto the tortilla.",
    "Roll tightly; cut on the bias and serve.",
  ],
};

recipes.salmon_sweet_potato = {
  id: "salmon_sweet_potato",
  diet: "pescatarian",
  cuisine: "global",
  regions: ["*"],
  meal: "Dinner",
  time: "21:00",
  title: "Salmon & Sweet Potato",
  prepMin: 5,
  cookMin: 20,
  servings: 1,
  kcal: 620,
  protein: 42,
  carbs: 45,
  fat: 26,
  fiber: 7,
  sugar: 10,
  sodium: 380,
  micros: [
    { name: "Omega-3", pct: 100 },
    { name: "Vit A", pct: 220 },
    { name: "Vit D", pct: 90 },
    { name: "B12", pct: 90 },
    { name: "K+", pct: 28 },
  ],
  ingredients: [
    { name: "Salmon fillet", qty: "180 g", p: 38, c: 0, f: 22, k: 360 },
    { name: "Sweet potato", qty: "220 g", p: 4, c: 42, f: 0, k: 190 },
    { name: "Asparagus / broccoli", qty: "120 g", p: 3, c: 6, f: 0, k: 40 },
    { name: "Olive oil", qty: "5 ml", p: 0, c: 0, f: 5, k: 44 },
    { name: "Lemon, salt, pepper", qty: "to taste", p: 0, c: 0, f: 0, k: 0 },
  ],
  method: [
    "Preheat oven to 200°C / 400°F.",
    "Cube sweet potato; toss with olive oil, salt, pepper. Roast 20 min on a sheet pan.",
    "After 10 min, push sweet potato aside; add seasoned salmon and trimmed asparagus to the same sheet.",
    "Roast another 10 min until salmon flakes easily (62°C internal) and asparagus is tender-crisp.",
    "Finish with a squeeze of fresh lemon.",
  ],
};

recipes.cottage_pancakes = {
  id: "cottage_pancakes",
  diet: "eggetarian",
  cuisine: "global",
  regions: ["*"],
  meal: "Snack",
  time: "10:30",
  title: "Cottage Cheese Pancakes",
  prepMin: 5,
  cookMin: 8,
  servings: 1,
  kcal: 380,
  protein: 32,
  carbs: 40,
  fat: 10,
  fiber: 4,
  sugar: 12,
  sodium: 320,
  micros: [
    { name: "Calcium", pct: 24 },
    { name: "B12", pct: 50 },
    { name: "Selenium", pct: 40 },
  ],
  ingredients: [
    { name: "Cottage cheese (low-fat)", qty: "150 g", p: 19, c: 6, f: 4, k: 130 },
    { name: "Egg + 1 white", qty: "1 + 30 g", p: 9, c: 1, f: 5, k: 90 },
    { name: "Rolled oats (blended)", qty: "40 g", p: 5, c: 27, f: 3, k: 150 },
    { name: "Berries", qty: "50 g", p: 0, c: 7, f: 0, k: 30 },
    { name: "Honey", qty: "5 g", p: 0, c: 4, f: 0, k: 15 },
  ],
  method: [
    "Blend cottage cheese, egg + white, and oats until smooth.",
    "Heat a non-stick pan on medium; pour 1/4-cup pools of batter.",
    "Flip when bubbles form on top and edges set (~2 min/side).",
    "Top with berries and a drizzle of honey.",
  ],
};

recipes.chicken_pasta = {
  id: "chicken_pasta",
  diet: "omnivore",
  cuisine: "italian",
  regions: ["*"],
  meal: "Dinner",
  time: "21:00",
  title: "Chicken & Tomato Pasta",
  prepMin: 5,
  cookMin: 18,
  servings: 1,
  kcal: 780,
  protein: 55,
  carbs: 90,
  fat: 18,
  fiber: 8,
  sugar: 12,
  sodium: 720,
  micros: [
    { name: "B6", pct: 55 },
    { name: "Lycopene", pct: 70 },
    { name: "Iron", pct: 25 },
    { name: "Zn", pct: 35 },
  ],
  ingredients: [
    { name: "Chicken breast, diced", qty: "180 g", p: 56, c: 0, f: 6, k: 297 },
    { name: "Whole-wheat pasta, dry", qty: "100 g", p: 14, c: 70, f: 3, k: 350 },
    { name: "Crushed tomatoes", qty: "150 g", p: 3, c: 8, f: 0, k: 40 },
    { name: "Olive oil", qty: "10 ml", p: 0, c: 0, f: 10, k: 88 },
    { name: "Garlic, basil, salt, pepper", qty: "to taste", p: 0, c: 2, f: 0, k: 5 },
  ],
  method: [
    "Boil salted water; cook pasta to al dente per package.",
    "Meanwhile, sauté garlic in olive oil over medium until fragrant.",
    "Add diced chicken; brown 5-6 min until cooked through.",
    "Pour in crushed tomatoes; simmer 5 min, season, tear in fresh basil.",
    "Toss drained pasta in the sauce; finish with cracked pepper.",
  ],
};

recipes.smoothie_bowl = {
  id: "smoothie_bowl",
  meal: "Snack",
  time: "10:00",
  title: "Mass Smoothie Bowl",
  prepMin: 5,
  cookMin: 0,
  servings: 1,
  kcal: 580,
  protein: 38,
  carbs: 80,
  fat: 14,
  fiber: 9,
  sugar: 38,
  sodium: 160,
  micros: [
    { name: "Potassium", pct: 30 },
    { name: "B12", pct: 60 },
    { name: "Mg", pct: 28 },
  ],
  ingredients: [
    { name: "Whey isolate", qty: "30 g", p: 24, c: 2, f: 1, k: 120 },
    { name: "Frozen banana", qty: "150 g", p: 2, c: 34, f: 0, k: 130 },
    { name: "Oats", qty: "40 g", p: 5, c: 27, f: 3, k: 150 },
    { name: "Milk, whole", qty: "200 ml", p: 7, c: 10, f: 6, k: 120 },
    { name: "Peanut butter", qty: "15 g", p: 4, c: 3, f: 8, k: 90 },
    { name: "Mixed berries (topping)", qty: "50 g", p: 0, c: 7, f: 0, k: 30 },
  ],
  method: [
    "Blend whey, banana, oats, milk, and peanut butter until thick (add a splash of milk if needed).",
    "Pour into a bowl; spoon thickness should hold toppings.",
    "Top with berries and an extra drizzle of peanut butter.",
  ],
};

// Indian-cuisine additions
recipes.dal_rice = {
  id: "dal_rice",
  diet: "vegan",
  cuisine: "indian",
  regions: ["IN", "PK", "BD", "LK", "*"],
  meal: "Lunch",
  time: "13:30",
  title: "Dal Tadka with Steamed Rice",
  prepMin: 10,
  cookMin: 25,
  servings: 1,
  kcal: 580,
  protein: 22,
  carbs: 95,
  fat: 12,
  fiber: 12,
  sugar: 5,
  sodium: 480,
  micros: [
    { name: "Iron", pct: 30 },
    { name: "Folate", pct: 60 },
    { name: "Mg", pct: 30 },
    { name: "Fiber", pct: 50 },
  ],
  ingredients: [
    { name: "Toor / yellow split dal", qty: "80 g dry", p: 20, c: 50, f: 1, k: 280 },
    { name: "Basmati rice, cooked", qty: "180 g", p: 4, c: 40, f: 0, k: 220 },
    { name: "Onion, tomato, ginger, garlic", qty: "100 g", p: 2, c: 8, f: 0, k: 40 },
    { name: "Ghee or oil (tadka)", qty: "10 g", p: 0, c: 0, f: 10, k: 90 },
    { name: "Cumin, mustard, turmeric, salt", qty: "to taste", p: 0, c: 0, f: 0, k: 0 },
  ],
  method: [
    "Rinse dal and pressure-cook with 3 cups water and turmeric for 3-4 whistles (about 12 min).",
    "Heat ghee in a small pan; add cumin and mustard seeds until they crackle.",
    "Saute ginger-garlic, onion, then tomato until soft; season with salt.",
    "Pour tadka over cooked dal; simmer 2-3 minutes.",
    "Serve over warm basmati rice with a lemon wedge.",
  ],
};

recipes.idli_sambar = {
  id: "idli_sambar",
  diet: "vegan",
  cuisine: "south_indian",
  regions: ["IN", "LK", "SG"],
  meal: "Breakfast",
  time: "07:30",
  title: "Idli with Sambar",
  prepMin: 0,
  cookMin: 15,
  servings: 1,
  kcal: 420,
  protein: 14,
  carbs: 78,
  fat: 6,
  fiber: 9,
  sugar: 6,
  sodium: 620,
  micros: [
    { name: "Iron", pct: 22 },
    { name: "Folate", pct: 40 },
    { name: "Mg", pct: 24 },
  ],
  ingredients: [
    { name: "Idli (rice + urad dal cake)", qty: "4 medium", p: 8, c: 60, f: 1, k: 280 },
    { name: "Sambar (lentil-vegetable stew)", qty: "200 ml", p: 6, c: 18, f: 5, k: 140 },
    { name: "Coconut chutney", qty: "20 g", p: 1, c: 2, f: 4, k: 50 },
  ],
  method: [
    "Steam pre-made idli batter in greased idli moulds for 10-12 minutes until a toothpick comes out clean.",
    "Reheat sambar; thin with a splash of water if needed.",
    "Plate 4 hot idlis with a ladle of sambar poured over and chutney on the side.",
  ],
};

recipes.chicken_curry_roti = {
  id: "chicken_curry_roti",
  diet: "omnivore",
  cuisine: "indian",
  regions: ["IN", "PK", "BD", "LK", "*"],
  meal: "Dinner",
  time: "20:30",
  title: "Chicken Curry & Roti",
  prepMin: 15,
  cookMin: 25,
  servings: 1,
  kcal: 720,
  protein: 56,
  carbs: 65,
  fat: 24,
  fiber: 8,
  sugar: 6,
  sodium: 720,
  micros: [
    { name: "Iron", pct: 32 },
    { name: "B12", pct: 60 },
    { name: "Zn", pct: 38 },
  ],
  ingredients: [
    { name: "Chicken breast, cubed", qty: "180 g", p: 56, c: 0, f: 6, k: 297 },
    { name: "Whole-wheat roti", qty: "3 medium", p: 9, c: 45, f: 6, k: 280 },
    { name: "Onion, tomato, ginger-garlic", qty: "120 g", p: 2, c: 10, f: 0, k: 50 },
    { name: "Yogurt", qty: "30 g", p: 1, c: 1, f: 1, k: 20 },
    { name: "Oil + masala (garam, turmeric, coriander)", qty: "10 g + spices", p: 0, c: 1, f: 10, k: 95 },
  ],
  method: [
    "Marinate chicken with yogurt, ginger-garlic paste, salt, turmeric, garam masala for 15 min.",
    "Heat oil; saute onion until golden, add tomatoes, cook to a thick masala.",
    "Add chicken and marinade; saute 5 min, then add 1/2 cup water and simmer 12-15 min covered.",
    "Roll dough into 3 thin rotis; cook on a hot tawa, flipping until they puff.",
    "Serve curry hot with rotis on the side; garnish with fresh cilantro.",
  ],
};

recipes.paneer_bhurji_paratha = {
  id: "paneer_bhurji_paratha",
  diet: "vegetarian",
  cuisine: "indian",
  regions: ["IN", "PK", "*"],
  meal: "Lunch",
  time: "13:30",
  title: "Paneer Bhurji & Paratha",
  prepMin: 8,
  cookMin: 15,
  servings: 1,
  kcal: 680,
  protein: 38,
  carbs: 55,
  fat: 32,
  fiber: 8,
  sugar: 6,
  sodium: 580,
  micros: [
    { name: "Calcium", pct: 40 },
    { name: "B12", pct: 50 },
    { name: "Iron", pct: 25 },
    { name: "Mg", pct: 28 },
  ],
  ingredients: [
    { name: "Paneer, crumbled", qty: "150 g", p: 30, c: 4, f: 18, k: 290 },
    { name: "Whole-wheat paratha", qty: "2 medium", p: 7, c: 40, f: 10, k: 320 },
    { name: "Onion, capsicum, tomato", qty: "100 g", p: 2, c: 8, f: 0, k: 40 },
    { name: "Oil + masala", qty: "5 g + spices", p: 0, c: 1, f: 5, k: 50 },
  ],
  method: [
    "Heat oil; saute onion till translucent, add capsicum then tomato.",
    "Toss in crumbled paneer with salt, turmeric, garam masala, and chili powder; cook 3 min.",
    "Finish with chopped cilantro and a squeeze of lemon.",
    "Cook parathas on a hot tawa with a thin smear of ghee until golden on both sides.",
  ],
};

recipes.egg_bhurji_toast = {
  id: "egg_bhurji_toast",
  diet: "eggetarian",
  cuisine: "indian",
  regions: ["IN", "PK", "BD", "*"],
  meal: "Breakfast",
  time: "07:30",
  title: "Egg Bhurji & Toast",
  prepMin: 5,
  cookMin: 8,
  servings: 1,
  kcal: 520,
  protein: 32,
  carbs: 40,
  fat: 24,
  fiber: 5,
  sugar: 4,
  sodium: 620,
  micros: [
    { name: "B12", pct: 90 },
    { name: "Choline", pct: 60 },
    { name: "Iron", pct: 18 },
  ],
  ingredients: [
    { name: "Whole eggs", qty: "3 large", p: 18, c: 1, f: 15, k: 215 },
    { name: "Onion, tomato, green chili", qty: "80 g", p: 2, c: 8, f: 0, k: 40 },
    { name: "Whole-wheat toast", qty: "2 slices", p: 8, c: 30, f: 4, k: 200 },
    { name: "Butter + masala", qty: "5 g + spices", p: 0, c: 1, f: 5, k: 60 },
  ],
  method: [
    "Heat butter; saute onion, chili, tomato until soft.",
    "Beat eggs lightly; pour over and stir continuously for soft scrambled texture.",
    "Season with salt, turmeric, garam masala; finish with cilantro.",
    "Serve with toast brushed with a little ghee.",
  ],
};

recipes.veg_thali = {
  id: "veg_thali",
  diet: "vegetarian",
  cuisine: "indian",
  regions: ["IN", "PK", "*"],
  meal: "Lunch",
  time: "13:30",
  title: "Veg Thali (Dal · Sabzi · Roti · Rice · Curd)",
  prepMin: 15,
  cookMin: 25,
  servings: 1,
  kcal: 760,
  protein: 28,
  carbs: 115,
  fat: 22,
  fiber: 14,
  sugar: 8,
  sodium: 640,
  micros: [
    { name: "Iron", pct: 35 },
    { name: "Calcium", pct: 30 },
    { name: "Fiber", pct: 60 },
    { name: "Folate", pct: 50 },
  ],
  ingredients: [
    { name: "Dal", qty: "150 ml", p: 8, c: 20, f: 3, k: 140 },
    { name: "Sabzi (mixed veg with paneer cubes)", qty: "150 g", p: 8, c: 12, f: 8, k: 160 },
    { name: "Whole-wheat roti", qty: "2", p: 6, c: 30, f: 4, k: 200 },
    { name: "Steamed rice", qty: "100 g", p: 2, c: 28, f: 0, k: 130 },
    { name: "Curd (yogurt)", qty: "100 g", p: 4, c: 4, f: 4, k: 80 },
    { name: "Pickle + salad", qty: "20 g", p: 0, c: 2, f: 0, k: 10 },
  ],
  method: [
    "Reheat or prepare dal as in dal_rice recipe.",
    "Saute mixed vegetables (cauliflower, beans, peas, carrots) with paneer cubes, masala, until tender-crisp.",
    "Cook rotis on the tawa; steam rice (about 1/3 cup uncooked).",
    "Plate thali style: small bowls of dal and sabzi, rotis stacked, rice mound, curd, pickle, salad.",
  ],
};

export function getRecipe(id: string): Recipe {
  const r = recipes[id] ?? recipes.breakfast;
  return {
    diet: "vegetarian",
    cuisine: "global",
    regions: ["*"],
    ...r,
  };
}

export const recipeIds = Object.keys(recipes);

export function recipeList(): Recipe[] {
  return Object.keys(recipes).map((id) => getRecipe(id));
}
