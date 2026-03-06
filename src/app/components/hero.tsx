import { CircuitBoard, Cpu, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-2">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
          <Cpu size={16} />
          Arduino · Fysisk interaksjon · Prosjektressurser
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Ressurser for Arduino-prosjektet
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-600">
          Kom i gang raskt med eksempler, wiring-diagrammer, kode og feilsøking.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/resources/kom-i-gang-med-arduino"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
          >
            <Lightbulb size={16} />
            Kom i gang
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
            <CircuitBoard size={14} />
            Knapper · LED · Sensorer
          </span>

          <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
            <Lightbulb size={14} />
            Prosjektidéer
          </span>
        </div>
      </div>
    </section>
  );
}
