"use client";

import ResourceForm from "@/src/app/components/resource-form";
import { supabase } from "@/src/app/lib/supabase/browser";
import { ResourceRow } from "@/src/types";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function AdminEditResourcePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(props.params);
  const router = useRouter();

  const [initial, setInitial] = useState<ResourceRow | null>(null);

  async function load() {
    const { data } = await supabase
      .from("resources")
      .select(
        "id,title,slug,summary,content_md,type,level,tags,featured,published,links",
      )
      .eq("id", id)
      .maybeSingle();

    const row = data as ResourceRow;

    setInitial(row);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!initial) return <p>Laster…</p>;

  return (
    <main>
      <h1 className="text-2xl font-semibold">Rediger</h1>
      <p className="mt-1 text-sm text-neutral-600">ID: {id}</p>
      <ResourceForm
        resourceId={id}
        initialValues={initial}
        onSubmit={async (fields) => {
          const { error } = await supabase
            .from("resources")
            .update({ ...fields })
            .eq("id", id);
          if (error) throw new Error(error.message);
          router.push("/admin");
        }}
        onDelete={async () => {
          const { error } = await supabase
            .from("resources")
            .delete()
            .eq("id", id);
          if (error) throw new Error(error.message);
          router.push("/admin");
        }}
      />
    </main>
  );
}
