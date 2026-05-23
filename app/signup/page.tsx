"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { actions, useHydrate, useStore } from "@/lib/store";

export default function Signup() {
  useHydrate();
  const router = useRouter();
  const account = useStore((s) => s.account);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setUsername(account.username);
      setDisplayName(account.displayName);
    }
  }, [account]);

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
    actions.signUp(u, displayName);
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
            help="Lowercase, no spaces. Used as your handle."
          />
          <Field
            label="Display name"
            value={displayName}
            onChange={(v) => setDisplayName(v)}
            placeholder="What should we call you?"
            help="Optional. Shown on your home screen."
          />
          {error && <div className="text-[12px] text-strain">{error}</div>}
        </div>

        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-bone-mute mb-2">Your data is yours</div>
          <div className="text-[12px] text-bone-mute leading-relaxed">
            Pulse runs entirely on your device. Your username, profile, meals, and workouts are stored locally in your browser. Nothing is sent to a server. To sync across devices, you'd need to add cloud sync later.
          </div>
        </div>

        <button onClick={submit} className="w-full rounded-2xl bg-bone text-ink py-4 font-medium tracking-tight" style={{ background: "var(--text)", color: "var(--bg)" }}>
          {account ? "Save changes" : "Create account"}
        </button>

        {account && (
          <button onClick={() => { actions.logOut(); router.push("/"); }} className="w-full text-[12px] text-bone-mute py-2">
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
      <div className="text-[10px] uppercase tracking-[0.2em] text-bone-mute mb-2">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[var(--text-mute)]"
        style={{ color: "var(--text)" }}
      />
      {help && <div className="text-[11px] text-bone-mute mt-1.5">{help}</div>}
    </div>
  );
}
