import { Resource } from "@/src/types";
import ResourceCard from "./resource-card";
import LCDScreen from "./lcd-screen";

type Props = {
  resources: Resource[];
};

export default function ResourceList({ resources }: Props) {
  if (resources.length === 0) {
    return (
      <LCDScreen
        statusLabel="DATABASE RETURNED []"
        statusColor="#fb923c"
        className="mt-4"
        showHeader={false}
      >
        <p className="text-xs">Ingen resultater ...</p>
      </LCDScreen>
    );
  }

  return (
    <ul id="resources" className="mt-6 columns-1 sm:columns-2 gap-3">
      {resources.map((r, i) => (
        <ResourceCard key={r.id} r={r} num={i} />
      ))}
    </ul>
  );
}
