import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Recycle, Loader2, Leaf, Sparkles, ArrowDown, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultCard } from "@/components/ResultCard";
import { StatsBar } from "@/components/StatsBar";
import { classifyWaste, fileToBase64, type ClassificationResult } from "@/lib/classifyWaste";
import { useToast } from "@/hooks/use-toast";
import organicImg from "@/assets/organic-waste.jpg";
import recyclableImg from "@/assets/recyclable-waste.jpg";
import hazardousImg from "@/assets/hazardous-waste.jpg";

const categories = [
  {
    slug: "organic",
    name: "Organic Waste",
    icon: Leaf,
    image: organicImg,
    gradient: "gradient-organic",
    glow: "card-glow-organic",
    description: "Food scraps, leaves, coffee grounds — biodegradable materials that return nutrients to the earth through composting.",
    examples: ["Fruit peels", "Eggshells", "Garden clippings"],
  },
  {
    slug: "recyclable",
    name: "Recyclable Waste",
    icon: Recycle,
    image: recyclableImg,
    gradient: "gradient-recyclable",
    glow: "card-glow-recyclable",
    description: "Plastic, paper, glass, and metals that can be processed and manufactured into brand new products.",
    examples: ["Plastic bottles", "Cardboard", "Aluminum cans"],
  },
  {
    slug: "hazardous",
    name: "Hazardous Waste",
    icon: AlertTriangle,
    image: hazardousImg,
    gradient: "gradient-hazardous",
    glow: "card-glow-hazardous",
    description: "Toxic or dangerous materials like batteries and chemicals that require special handling and disposal.",
    examples: ["Batteries", "E-waste", "Paint cans"],
  },
];

const Index = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState({ organic: 0, recyclable: 0, hazardous: 0 });
  const { toast } = useToast();

  const handleImageSelected = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const base64 = await fileToBase64(imageFile);
      const classification = await classifyWaste(base64);
      setResult(classification);

      if (classification.category === "Organic") setStats((s) => ({ ...s, organic: s.organic + 1 }));
      else if (classification.category === "Recyclable") setStats((s) => ({ ...s, recyclable: s.recyclable + 1 }));
      else if (classification.category === "Hazardous") setStats((s) => ({ ...s, hazardous: s.hazardous + 1 }));
    } catch (err) {
      toast({ title: "Classification Failed", description: err instanceof Error ? err.message : "Unable to detect waste type", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO ===== */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-24 md:pt-16 md:pb-32">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-background/15 backdrop-blur-md flex items-center justify-center">
                <Recycle className="w-5 h-5" style={{ color: "white" }} />
              </div>
              <span className="font-display text-xl font-bold" style={{ color: "white" }}>EcoSort</span>
            </div>
            <div className="flex gap-2">
              <a href="#categories">
                <Button variant="ghost" size="sm" className="text-background/80 hover:text-background hover:bg-background/10">
                  Categories
                </Button>
              </a>
              <a href="#classify">
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Classify Now
                </Button>
              </a>
            </div>
          </nav>

          {/* Hero content */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-xs font-semibold tracking-wide" style={{ color: "hsl(38 92% 65%)" }}>
                ✨ AI-POWERED
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] mb-5" style={{ color: "white" }}>
              Sort Waste Smarter{" "}
              <span className="hero-gradient-text">with AI</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-lg" style={{ color: "hsl(0 0% 100% / 0.75)" }}>
              Snap a photo of any waste item and instantly know if it's organic, recyclable, or hazardous — plus get proper disposal instructions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#classify">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold text-base px-8">
                  Start Classifying
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#categories">
                <Button size="lg" variant="outline" className="border-background/25 text-background hover:bg-background/10 font-display font-semibold text-base px-8">
                  Explore Categories
                </Button>
              </a>
            </div>
          </div>

          {/* Floating feature pills */}
          <div className="flex flex-wrap gap-3 mt-12">
            {[
              { icon: Sparkles, text: "Instant Results" },
              { icon: Leaf, text: "Eco Tips Included" },
              { icon: Recycle, text: "3 Waste Categories" },
            ].map(({ icon: FIcon, text }) => (
              <span key={text} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm text-sm font-medium border border-background/15" style={{ color: "hsl(0 0% 100% / 0.8)" }}>
                <FIcon className="w-3.5 h-3.5" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 50 1440 20V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section id="categories" className="max-w-5xl mx-auto px-4 py-16 scroll-mt-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Know Your Waste
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Three Types of Waste
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tap any category below to learn more — including examples, disposal guides, and environmental facts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`group block rounded-2xl overflow-hidden bg-card border border-border ${cat.glow} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className={`absolute bottom-3 left-3 ${cat.gradient} flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold`} style={{ color: "white" }}>
                    <CatIcon className="w-4 h-4" />
                    {cat.name}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.examples.map((ex) => (
                      <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{ex}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== CLASSIFY SECTION ===== */}
      <section id="classify" className="scroll-mt-4">
        <div className="max-w-2xl mx-auto px-4 py-16 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">
              Upload & Analyze
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              AI Waste Classifier
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Upload or capture a photo and our AI will classify it instantly.
            </p>
          </div>

          <StatsBar stats={stats} />

          <ImageUploader
            onImageSelected={handleImageSelected}
            previewUrl={previewUrl}
            onClear={handleClear}
            isAnalyzing={isAnalyzing}
          />

          {imageFile && !result && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="min-w-[200px] font-display font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  "Analyze Waste"
                )}
              </Button>
            </div>
          )}

          {result && <ResultCard result={result} />}

          {result && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleClear}>
                Classify Another
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center bg-card/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Recycle className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-foreground">EcoSort</span>
        </div>
        <p className="text-xs text-muted-foreground">Powered by AI · Helping you sort waste responsibly 🌍</p>
      </footer>
    </div>
  );
};

export default Index;
