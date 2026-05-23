"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Today", icon: IconToday },
  { href: "/meals", label: "Meals", icon: IconFork },
  { href: "/workout", label: "Train", icon: IconBolt },
  { href: "/sleep", label: "Rest", icon: IconMoon },
  { href: "/profile", label: "Me", icon: IconUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 -translate-x-1/2 w-full max-w-[440px] sm:bottom-6 sm:rounded-[28px] sm:max-w-[420px]">
      <div className="mx-3 mb-3 rounded-[24px] border border-ink-300/60 bg-ink-50/90 backdrop-blur-md px-2 py-2 flex justify-between">
        {items.map((it) => {
          const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl flex-1 transition ${active ? "bg-ink-300/60" : ""}`}
            >
              <it.icon active={active} />
              <span className={`text-[10px] tracking-wide ${active ? "text-bone" : "text-bone-mute"}`}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function IconToday({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f5f5f0" : "#8a8a90"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill={active ? "#95c9a6" : "#6b6b72"} stroke="none" />
    </svg>
  );
}
function IconFork({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f5f5f0" : "#8a8a90"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v8a3 3 0 0 0 6 0V3" />
      <path d="M10 11v10" />
      <path d="M17 3c1.5 1.5 2 3 2 5s-.5 3.5-2 5v8" />
    </svg>
  );
}
function IconBolt({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f5f5f0" : "#8a8a90"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" />
    </svg>
  );
}
function IconMoon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f5f5f0" : "#8a8a90"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
function IconUser({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f5f5f0" : "#8a8a90"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
