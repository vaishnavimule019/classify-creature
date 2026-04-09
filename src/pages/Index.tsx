import { useState, useCallback } from "react";
import { Recycle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultCard } from "@/components/ResultCard";
import { StatsBar } from "@/components/StatsBar";
import { classifyWaste, fileToBase64, type ClassificationResult } from "@/lib/classifyWaste";
import { useToast } from "@/hooks/use-toast";

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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Recycle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">EcoSort</h1>
            <p className="text-xs text-muted-foreground">AI Waste Classifier</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Hero text */}
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Classify Your Waste Instantly
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Upload or capture an image of waste and our AI will identify whether it's organic, recyclable, or hazardous.
          </p>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Upload area */}
        <ImageUploader
          onImageSelected={handleImageSelected}
          previewUrl={previewUrl}
          onClear={handleClear}
          isAnalyzing={isAnalyzing}
        />

        {/* Analyze button */}
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

        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* Analyze another */}
        {result && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleClear}>
              Classify Another
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Powered by AI · Helping you sort waste responsibly 🌍
      </footer>
    </div>
  );
};

export default Index;
