import { useRef, useState, useCallback } from "react";
import { Upload, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/CameraCapture";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  previewUrl: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onImageSelected, previewUrl, onClear, isAnalyzing }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        onImageSelected(file);
      }
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (previewUrl) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <img
          src={previewUrl}
          alt="Waste to classify"
          className="w-full rounded-lg border border-border shadow-md object-cover max-h-80"
        />
        {!isAnalyzing && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm rounded-full p-1.5 border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium text-foreground">Drop an image here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP up to 10MB</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => cameraInputRef.current?.click()}
      >
        <Camera className="w-4 h-4 mr-2" />
        Capture with Camera
      </Button>
    </div>
  );
}
