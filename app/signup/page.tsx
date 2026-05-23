"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { actions, useHydrate, useStore } from "@/lib/store";
import { COUNTRIES, dietOptionsForCountry, type DietId } from "@/lib/regions";

export default function Signup() {
  useHydrate();
  const router = useRouter();
  const account = useStore((s) => s.account);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("IN");
  const [diet, setDiet] = useState<DietId>("vegetarian");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setUsername(account.username);
      setDisplayName(account.displayName);
      setCountry(account.country);
      setDiet(account.diet);
    }
  }, [account]);

  const dietOptions = useMemo(() => dietOptionsForCountry(country), [country]);

  // If country changes and current diet isn't in new options, reset to first
  useEffect(() => {
    if (!dietOptions.find((o) => o.id === diet)) {
      setDiet(dietOptions[0].id);
    }
  }, [dietOptions, diet]);

  function submit() {
    const u = username.trim().toLowerCase();
    if (u.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_.-]+$/i.test(u)) {
      setError("Letters, numbers, dot, dash, underscore only");
      return;
    }
    actions.signUp(u, displayName, country, diet);
    router.push(account ? "/profile" : "/onboarding");
  }

  return (
    <div>
      <Header title={account ? "Edit account" : "Create your account"} subtitle="Pulse" back={account ? "/profile" : undefined} />

      <div className="px-5 mt-2 space-y-4">
        <div className="card p-5 space-y-5">
          <Field
            label="Username"
            value={username}
            onChange={(v) => { setUsername(v); setError(null); }}
            placeholder="e.g. gaja47"
            help="Lowercase. Used as your handle."
          />
          <Field
            label="Display name"
            value={displayName}
            onChange={(v) => setDisplayName(v)}
            placeholder="What should we call you?"
            help="Optional. Shown on your home screen."
          />

          <Select
            label="Country"
            value={country}
            onChange={setCountry}
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            help="Drives meal terminology and recipe availability."
          />

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-mute)" }}>Diet preference</div>
            <div className="grid grid-cols-2 gap-2">
              {dietOptions.map((o) => {
                const active = o.id === diet;
                return (
                  <button
                    key={o.id}
                    onClick={() => setDiet(o.id)}
                    className="rounded-2xl border p-3 text-left"
                    style={{
                      background: active ? "var(--text)" : "var(--surface-2)",
                      color: active ? "var(--bg)" : "var(--text)",
                      borderColor: active ? "var(--text)" : "var(--border)",
                    }}
                  >
                    <div className="text-[13px] font-medium">{o.label}</div>
                    <div className="text-[10px] mt-1 opacity-70">{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="text-[12px]" style={{ color: "var(--accent-strain)" }}>{error}</div>}
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: "var(--text-mute)" }}>Your data is yours</div>
          <div className="text-[12px] leading-relaxed" style={{ color: "var(--text-mute)" }}>
            Pulse runs entirely on your device. Your account, profile, meals, and workouts stay in your browser. Cloud sync isn't enabled.
          </div>
        </div>

        <button onClick={submit} className="w-full rounded-2xl py-4 font-medium tracking-tight" style={{ background: "var(--text)", color: "var(--bg)" }}>
          {account ? "Save changes" : "Create account"}
        </button>

        {account && (
          <button onClick={() => { actions.logOut(); router.push("/"); }} className="w-full text-[12px] py-2" style={{ color: "var(--text-mute)" }}>
            Log out
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, help }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; help?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-mute)" }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border rounded-xl px-4 py-3 text-[15px] outline-none focus:outline-none"
        style={{ color: "var(--text)", borderColor: "var(--border)" }}
      />
      {help && <div className="text-[11px] mt-1.5" style={{ color: "var(--text-mute)" }}>{help}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, help }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; help?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-mute)" }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 text-[15px] outline-none appearance-none"
        style={{ background: "var(--surface-2)", color: "var(--text)", borderColor: "var(--border)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "var(--surface)", color: "var(--text)" }}>
            {o.label}
          </option>
        ))}
      </select>
      {help && <div className="text-[11px] mt-1.5" style={{ color: "var(--text-mute)" }}>{help}</div>}
    </div>
  );
}
