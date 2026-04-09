import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Leaf, Recycle, AlertTriangle, CheckCircle2, Info, Lightbulb, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import organicImg from "@/assets/organic-waste.jpg";
import recyclableImg from "@/assets/recyclable-waste.jpg";
import hazardousImg from "@/assets/hazardous-waste.jpg";

const categoryMeta: Record<string, { icon: typeof Leaf; image: string; gradient: string; glow: string; color: string; bg: string }> = {
  organic: { icon: Leaf, image: organicImg, gradient: "gradient-organic", glow: "card-glow-organic", color: "text-organic", bg: "bg-organic" },
  recyclable: { icon: Recycle, image: recyclableImg, gradient: "gradient-recyclable", glow: "card-glow-recyclable", color: "text-recyclable", bg: "bg-recyclable" },
  hazardous: { icon: AlertTriangle, image: hazardousImg, gradient: "gradient-hazardous", glow: "card-glow-hazardous", color: "text-hazardous", bg: "bg-hazardous" },
};

interface CategoryData {
  title: string;
  tagline: string;
  description: string;
  impact: Record<string, string | number>;
  examples: { name: string; detail: string }[];
  disposalSteps: string[];
  facts: string[];
}

const impactLabels: Record<string, string> = {
  landfillPercent: "Landfill Share",
  methaneReduction: "Methane Reduction via Composting",
  compostValue: "Compost Market Value",
  decompositionTime: "Decomposition Time",
  energySaved: "Energy Saved by Recycling",
  waterSaved: "Water Saved per Ton",
  treesSaved: "Trees Saved per Ton",
  contaminationRadius: "Contamination Radius",
  groundwaterRisk: "Groundwater Persistence",
  healthEffects: "Health Risks",
  properDisposalRate: "Proper Disposal Rate",
};

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = slug ? categoryMeta[slug] : null;
  const Icon = meta?.icon || Info;

  useEffect(() => {
    if (!slug || !categoryMeta[slug]) {
      setError("Invalid category");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke("category-info", {
          body: { category: slug },
        });
        if (fnError) throw fnError;
        if (result?.error) throw new Error(result.error);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${meta?.bg || "bg-primary"} animate-pulse`} />
          <p className="text-muted-foreground text-sm">Loading category info…</p>
        </div>
      </div>
    );
  }

  if (error || !data || !meta) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-medium">{error || "Not found"}</p>
        <Link to="/"><Button variant="outline">← Back Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className={`${meta.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <img src={meta.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 opacity-80 hover:opacity-100 transition-opacity" style={{ color: "white" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-background/20 backdrop-blur-md flex items-center justify-center">
              <Icon className="w-8 h-8" style={{ color: "white" }} />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold" style={{ color: "white" }}>{data.title}</h1>
              <p className="text-lg opacity-80" style={{ color: "white" }}>{data.tagline}</p>
            </div>
          </div>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed opacity-90" style={{ color: "white" }}>
            {data.description}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Impact stats */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className={`w-5 h-5 ${meta.color}`} />
            <h2 className="font-display text-xl font-bold text-foreground">Environmental Impact</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(data.impact).map(([key, value]) => (
              <div key={key} className={`rounded-xl border border-border bg-card p-5 ${meta.glow} hover:scale-[1.02] transition-transform`}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  {impactLabels[key] || key}
                </p>
                <p className={`text-2xl font-display font-bold ${meta.color}`}>{String(value)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Info className={`w-5 h-5 ${meta.color}`} />
            <h2 className="font-display text-xl font-bold text-foreground">Common Items</h2>
          </div>
          <div className="space-y-4">
            {data.examples.map((ex, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full ${meta.bg} shrink-0`} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{ex.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ex.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disposal steps */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className={`w-5 h-5 ${meta.color}`} />
            <h2 className="font-display text-xl font-bold text-foreground">How to Dispose Properly</h2>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {data.disposalSteps.map((step, i) => (
              <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={`w-7 h-7 rounded-full ${meta.gradient} flex items-center justify-center text-sm font-bold shrink-0`} style={{ color: "white" }}>
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Facts */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className={`w-5 h-5 ${meta.color}`} />
            <h2 className="font-display text-xl font-bold text-foreground">Did You Know?</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.facts.map((fact, i) => (
              <div key={i} className={`rounded-xl p-5 border-l-4 bg-card ${meta.color}`} style={{ borderLeftColor: `hsl(var(--${slug}))` }}>
                <p className="text-sm text-foreground leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4 pb-8">
          <Link to="/#classify">
            <Button size="lg" className="font-display font-semibold">
              Try the AI Classifier →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
