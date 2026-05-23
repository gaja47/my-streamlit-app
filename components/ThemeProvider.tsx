"use client";

import { useEffect } from "react";
import { useHydrate, useStore } from "@/lib/store";

export default function ThemeProvider() {
  useHydrate();
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
