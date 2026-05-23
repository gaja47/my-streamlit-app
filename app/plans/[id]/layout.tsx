import { mealPlanIds } from "@/lib/mealPlans";

export function generateStaticParams() {
  return mealPlanIds.map((id) => ({ id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
