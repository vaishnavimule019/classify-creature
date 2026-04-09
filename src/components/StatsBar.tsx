import { Leaf, Recycle, AlertTriangle } from "lucide-react";

interface Stats {
  organic: number;
  recyclable: number;
  hazardous: number;
}

export function StatsBar({ stats }: { stats: Stats }) {
  const total = stats.organic + stats.recyclable + stats.hazardous;
  if (total === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2">
      <div className="flex items-center gap-2 bg-organic/10 rounded-lg px-3 py-2">
        <Leaf className="w-4 h-4 text-organic" />
        <span className="text-sm font-medium text-foreground">{stats.organic}</span>
      </div>
      <div className="flex items-center gap-2 bg-recyclable/10 rounded-lg px-3 py-2">
        <Recycle className="w-4 h-4 text-recyclable" />
        <span className="text-sm font-medium text-foreground">{stats.recyclable}</span>
      </div>
      <div className="flex items-center gap-2 bg-hazardous/10 rounded-lg px-3 py-2">
        <AlertTriangle className="w-4 h-4 text-hazardous" />
        <span className="text-sm font-medium text-foreground">{stats.hazardous}</span>
      </div>
    </div>
  );
}
