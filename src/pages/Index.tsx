import { useState, useCallback } from "react";
import { Recycle, Loader2, Leaf, Sparkles, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultCard } from "@/components/ResultCard";
import { StatsBar } from "@/components/StatsBar";
import { CategoryGuide } from "@/components/CategoryGuide";
import { classifyWaste, fileToBase64, type ClassificationResult } from "@/lib/classifyWaste";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

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

      if (classification.category === "Organic") {
        setStats((s) => ({ ...s, organic: s.organic + 1 }));
      } else if (classification.category === "Recyclable") {
        setStats((s) => ({ ...s, recyclable: s.recyclable + 1 }));
      } else if (classification.category === "Hazardous") {
        setStats((s) => ({ ...s, hazardous: s.hazardous + 1 }));
      }
    } catch (err) {
      toast({
        title: "Classification Failed",
        description: err instanceof Error ? err.message : "Unable to detect waste type",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-20 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <Recycle className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-3xl font-bold text-primary-foreground">EcoSort</h1>
              <p className="text-sm text-primary-foreground/70">AI Waste Classifier</p>
            </div>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground leading-tight mb-4">
            Sort Waste Smarter <br />
            <span className="text-accent">with AI</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
            Snap a photo or upload an image of waste and our AI instantly classifies it as Organic, Recyclable, or Hazardous — with disposal tips.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: Sparkles, text: "AI-Powered" },
              { icon: Leaf, text: "Eco-Friendly" },
              { icon: Recycle, text: "3 Categories" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-sm font-medium text-primary-foreground border border-primary-foreground/20"
              >
                <Icon className="w-4 h-4" />
                {text}
              </span>
            ))}
          </div>

          <a
            href="#classify"
            className="inline-flex items-center gap-2 text-primary-foreground/60 text-sm hover:text-primary-foreground transition-colors"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
            Start classifying
          </a>
        </div>
      </section>

      {/* Classify Section */}
      <section id="classify" className="max-w-2xl mx-auto px-4 py-16 space-y-6 scroll-mt-4">
        <div className="text-center space-y-2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">
            Upload & Analyze
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Classify Your Waste
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Upload or capture a photo and let AI do the sorting for you.
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
      </section>

      {/* Category Guide */}
      <div className="max-w-5xl mx-auto px-4">
        <CategoryGuide />
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Recycle className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-foreground">EcoSort</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Powered by AI · Helping you sort waste responsibly 🌍
        </p>
      </footer>
    </div>
  );
};

export default Index;
