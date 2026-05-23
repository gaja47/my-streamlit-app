import { recipeIds } from "@/lib/recipes";

export function generateStaticParams() {
  return recipeIds.map((id) => ({ id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
