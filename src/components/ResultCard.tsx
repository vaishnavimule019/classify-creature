import { Leaf, Recycle, AlertTriangle, HelpCircle, Lightbulb } from "lucide-react";
import type { ClassificationResult } from "@/lib/classifyWaste";

const categoryConfig = {
  Organic: {
    icon: Leaf,
    color: "bg-organic text-organic-foreground",
    border: "border-organic/30",
    badge: "bg-organic/10 text-organic",
  },
  Recyclable: {
    icon: Recycle,
    color: "bg-recyclable text-recyclable-foreground",
    border: "border-recyclable/30",
    badge: "bg-recyclable/10 text-recyclable",
  },
  Hazardous: {
    icon: AlertTriangle,
    color: "bg-hazardous text-hazardous-foreground",
    border: "border-hazardous/30",
    badge: "bg-hazardous/10 text-hazardous",
  },
  Unknown: {
    icon: HelpCircle,
    color: "bg-muted text-muted-foreground",
    border: "border-border",
    badge: "bg-muted text-muted-foreground",
  },
};

export function ResultCard({ result }: { result: ClassificationResult }) {
  const config = categoryConfig[result.category];
  const Icon = config.icon;

  return (
    <div className={`w-full max-w-md mx-auto rounded-xl border-2 ${config.border} bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      {/* Header */}
      <div className={`${config.color} px-5 py-4 flex items-center gap-3`}>
        <Icon className="w-7 h-7" />
        <div>
          <h3 className="font-display text-lg font-bold">{result.category} Waste</h3>
          <p className="text-sm opacity-90">Confidence: {result.confidence}%</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Confidence bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium text-foreground">{result.confidence}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full ${config.color} transition-all duration-1000 ease-out`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* Identified items */}
        {result.items.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Identified Items</p>
            <div className="flex flex-wrap gap-1.5">
              {result.items.map((item, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${config.badge}`}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disposal */}
        <div>
          <p className="text-sm font-medium text-foreground mb-1">♻️ Disposal Instructions</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.disposal}</p>
        </div>

        {/* Tip */}
        {result.tip && (
          <div className="flex gap-2 bg-accent/10 rounded-lg p-3">
            <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{result.tip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
