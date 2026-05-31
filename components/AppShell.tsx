"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// The fitness PWA lives inside a centered mobile frame with a bottom nav.
// The order-flow terminal (/orderflow) is a full-bleed desktop terminal, so it
// opts out of the frame entirely. Both apps live alongside each other.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = pathname?.startsWith("/orderflow");

  if (fullBleed) return <>{children}</>;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-[440px] shadow-[0_30px_120px_rgba(0,0,0,0.6)] sm:my-6 sm:rounded-[36px] sm:overflow-hidden sm:min-h-[860px] sm:border sm:border-[var(--border)]"
      style={{ background: "var(--bg)" }}
    >
      <main className="pb-28">{children}</main>
      <BottomNav />
    </div>
  );
}
