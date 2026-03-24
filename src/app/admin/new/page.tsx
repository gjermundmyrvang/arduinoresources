"use client";

import { useRouter } from "next/navigation";
import ResourceForm from "../../components/resource-form";
import { supabase } from "../../lib/supabase/browser";

export default function AdminNewResource() {
  const router = useRouter();
  return (
    <main>
      <h1 className="text-2xl font-semibold">Ny ressurs</h1>
      <ResourceForm
        onSubmit={async (fields) => {
          const { error } = await supabase.from("resources").insert({
            ...fields,
            summary: fields.summary || null,
          });
          if (error) throw new Error(error.message);
          router.push(`/resources/${fields.slug}`);
        }}
      />
    </main>
  );
}
