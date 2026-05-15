import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Pulse — Fitness & Nutrition",
  description: "Activity, recovery, and personalized meal plans.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="mx-auto min-h-screen w-full max-w-[440px] bg-ink shadow-[0_30px_120px_rgba(0,0,0,0.6)] sm:my-6 sm:rounded-[36px] sm:overflow-hidden sm:min-h-[860px] sm:border sm:border-ink-300/40">
          <main className="pb-28">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
