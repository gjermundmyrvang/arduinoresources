"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-xl font-semibold">Admin login</h1>

      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          setLoading(false);

          if (error) {
            setError(error.message);
            return;
          }

          router.replace("/admin");
        }}
      >
        <div>
          <label className="text-sm">E-post</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm">Passord</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          className="w-full rounded-md bg-black px-3 py-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logger inn…" : "Logg inn"}
        </button>
      </form>
    </main>
  );
}
