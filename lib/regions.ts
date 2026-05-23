export type DietId = "vegan" | "vegetarian" | "eggetarian" | "pescatarian" | "omnivore";

const DIET_RANK: Record<DietId, number> = {
  vegan: 0,
  vegetarian: 1,
  eggetarian: 2,
  pescatarian: 3,
  omnivore: 4,
};

export function recipeAllowedForDiet(recipeDiet: DietId, userDiet: DietId): boolean {
  return DIET_RANK[recipeDiet] <= DIET_RANK[userDiet];
}

export type DietPreset = "india" | "western" | "middle_east";

export const DIET_OPTIONS: Record<DietPreset, { id: DietId; label: string; desc: string }[]> = {
  india: [
    { id: "vegan", label: "Vegan", desc: "No animal products at all" },
    { id: "vegetarian", label: "Vegetarian", desc: "Dairy ok, no eggs or meat" },
    { id: "eggetarian", label: "Eggetarian", desc: "Vegetarian + eggs" },
    { id: "omnivore", label: "Non-vegetarian", desc: "All foods, including meat" },
  ],
  western: [
    { id: "vegan", label: "Vegan", desc: "No animal products" },
    { id: "vegetarian", label: "Vegetarian", desc: "Plants + dairy + eggs" },
    { id: "pescatarian", label: "Pescatarian", desc: "Vegetarian + seafood" },
    { id: "omnivore", label: "Omnivore", desc: "All foods" },
  ],
  middle_east: [
    { id: "vegan", label: "Vegan", desc: "No animal products" },
    { id: "vegetarian", label: "Vegetarian", desc: "Plants + dairy + eggs" },
    { id: "pescatarian", label: "Pescatarian", desc: "Plants + seafood" },
    { id: "omnivore", label: "Halal omnivore", desc: "Halal meats only" },
  ],
};

export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dietPreset: DietPreset;
  units: "metric" | "imperial";
  currency: string;
};

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", dietPreset: "india", units: "metric", currency: "INR" },
  { code: "US", name: "United States", dietPreset: "western", units: "imperial", currency: "USD" },
  { code: "GB", name: "United Kingdom", dietPreset: "western", units: "metric", currency: "GBP" },
  { code: "CA", name: "Canada", dietPreset: "western", units: "metric", currency: "CAD" },
  { code: "AU", name: "Australia", dietPreset: "western", units: "metric", currency: "AUD" },
  { code: "NZ", name: "New Zealand", dietPreset: "western", units: "metric", currency: "NZD" },
  { code: "IE", name: "Ireland", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "DE", name: "Germany", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "FR", name: "France", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "IT", name: "Italy", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "ES", name: "Spain", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "NL", name: "Netherlands", dietPreset: "western", units: "metric", currency: "EUR" },
  { code: "SE", name: "Sweden", dietPreset: "western", units: "metric", currency: "SEK" },
  { code: "NO", name: "Norway", dietPreset: "western", units: "metric", currency: "NOK" },
  { code: "AE", name: "United Arab Emirates", dietPreset: "middle_east", units: "metric", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", dietPreset: "middle_east", units: "metric", currency: "SAR" },
  { code: "EG", name: "Egypt", dietPreset: "middle_east", units: "metric", currency: "EGP" },
  { code: "TR", name: "Turkey", dietPreset: "middle_east", units: "metric", currency: "TRY" },
  { code: "ID", name: "Indonesia", dietPreset: "middle_east", units: "metric", currency: "IDR" },
  { code: "MY", name: "Malaysia", dietPreset: "middle_east", units: "metric", currency: "MYR" },
  { code: "PK", name: "Pakistan", dietPreset: "india", units: "metric", currency: "PKR" },
  { code: "BD", name: "Bangladesh", dietPreset: "india", units: "metric", currency: "BDT" },
  { code: "LK", name: "Sri Lanka", dietPreset: "india", units: "metric", currency: "LKR" },
  { code: "SG", name: "Singapore", dietPreset: "western", units: "metric", currency: "SGD" },
  { code: "JP", name: "Japan", dietPreset: "western", units: "metric", currency: "JPY" },
  { code: "KR", name: "South Korea", dietPreset: "western", units: "metric", currency: "KRW" },
  { code: "CN", name: "China", dietPreset: "western", units: "metric", currency: "CNY" },
  { code: "PH", name: "Philippines", dietPreset: "western", units: "metric", currency: "PHP" },
  { code: "TH", name: "Thailand", dietPreset: "western", units: "metric", currency: "THB" },
  { code: "VN", name: "Vietnam", dietPreset: "western", units: "metric", currency: "VND" },
  { code: "BR", name: "Brazil", dietPreset: "western", units: "metric", currency: "BRL" },
  { code: "MX", name: "Mexico", dietPreset: "western", units: "metric", currency: "MXN" },
  { code: "ZA", name: "South Africa", dietPreset: "western", units: "metric", currency: "ZAR" },
  { code: "NG", name: "Nigeria", dietPreset: "western", units: "metric", currency: "NGN" },
];

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function dietOptionsForCountry(code: string) {
  const country = countryByCode(code);
  return DIET_OPTIONS[country?.dietPreset ?? "western"];
}

export function dietLabel(diet: DietId, code: string): string {
  const opts = dietOptionsForCountry(code);
  return opts.find((o) => o.id === diet)?.label ?? diet;
}
