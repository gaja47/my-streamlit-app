import { programIds } from "@/lib/programs";

export function generateStaticParams() {
  return programIds.map((id) => ({ id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
