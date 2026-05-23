import { exerciseIds } from "@/lib/exercises";

export function generateStaticParams() {
  return exerciseIds.map((id) => ({ id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
