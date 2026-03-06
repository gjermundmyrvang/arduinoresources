"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/browser";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }

    async function check() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setReady(true);
    }

    check();
  }, [router, isLoginRoute]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p>Laster…</p>
      </main>
    );
  }

  if (isLoginRoute) {
    // Ikke vis admin-nav når du er på login
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="flex items-center justify-between">
        <Link href="/admin" className="font-semibold">
          Admin
        </Link>
        <nav className="flex gap-4 text-sm">
          <button
            className="underline"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
            }}
          >
            Logg ut
          </button>
        </nav>
      </header>

      <div className="mt-8">{children}</div>
    </div>
  );
}
