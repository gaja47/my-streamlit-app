import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Pulse - Fitness & Nutrition",
  description: "Activity, recovery, and personalized meal plans.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Pulse",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ThemeProvider />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
