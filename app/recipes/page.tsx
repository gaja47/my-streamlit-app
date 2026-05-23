"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { recipeList } from "@/lib/recipes";
import { recipeAllowedForDiet, dietLabel } from "@/lib/regions";
import { useHydrate, useStore } from "@/lib/store";

export default function Recipes() {
  useHydrate();
  const account = useStore((s) => s.account);
  const [q, setQ] = useState("");
  const [onlyMyDiet, setOnlyMyDiet] = useState(true);
  const [onlyMyRegion, setOnlyMyRegion] = useState(false);

  const userDiet = account?.diet ?? "omnivore";
  const userCountry = account?.country ?? "*";

  const all = recipeList();
  const filtered = all.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q.toLowerCase()) && !r.cuisine?.toLowerCase().includes(q.toLowerCase())) return false;
    if (onlyMyDiet && !recipeAllowedForDiet(r.diet!, userDiet)) return false;
    if (onlyMyRegion && account && !(r.regions?.includes(userCountry) || r.regions?.includes("*"))) return false;
    return true;
  });

  return (
    <div>
      <Header
        title="Recipes"
        subtitle={`${filtered.length} of ${all.length}${account ? ` · ${dietLabel(userDiet, userCountry)}` : ""}`}
        back="/profile"
      />

      <div className="px-5 mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes or cuisine..."
          className="w-full bg-transparent border rounded-xl px-4 py-3 text-[14px] outline-none"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {account && (
        <div className="px-5 mt-3 flex gap-2">
          <Toggle label="My diet" on={onlyMyDiet} onToggle={() => setOnlyMyDiet((s) => !s)} />
          <Toggle label="My region" on={onlyMyRegion} onToggle={() => setOnlyMyRegion((s) => !s)} />
        </div>
      )}

      <div className="px-5 mt-4 space-y-2">
        {filtered.map((r) => (
          <Link key={r.id} href={`/meals/${r.id}`} className="block subcard p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-mute)" }}>{r.cuisine} · {r.meal}</div>
                <div className="text-[15px] mt-1">{r.title}</div>
                <div className="text-[11px] mt-1" style={{ color: "var(--text-mute)" }}>
                  {r.diet} · {r.regions?.includes("*") ? "Global" : r.regions?.join(", ")}
                </div>
              </div>
              <div className="text-right tabular">
                <div className="text-[16px] font-light">{r.kcal}</div>
                <div className="text-[10px]" style={{ color: "var(--text-mute)" }}>kcal</div>
              </div>
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t text-[11px] tabular" style={{ borderColor: "var(--border)" }}>
              <span><span style={{ color: "var(--text-mute)" }}>P</span> {r.protein}</span>
              <span><span style={{ color: "var(--text-mute)" }}>C</span> {r.carbs}</span>
              <span><span style={{ color: "var(--text-mute)" }}>F</span> {r.fat}</span>
              <span className="ml-auto" style={{ color: "var(--text-mute)" }}>{r.prepMin + r.cookMin} min</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-[12px] text-center py-8" style={{ color: "var(--text-mute)" }}>
            No matches. Try widening filters.
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="px-3 py-1.5 rounded-full text-[11px] border"
      style={{
        background: on ? "var(--text)" : "var(--surface-2)",
        color: on ? "var(--bg)" : "var(--text-mute)",
        borderColor: on ? "var(--text)" : "var(--border)",
      }}
    >
      {label}
    </button>
  );
}
