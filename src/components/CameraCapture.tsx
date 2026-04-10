import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, SwitchCamera, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  const startCamera = useCallback(async (facing: "environment" | "user") => {
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      setStream(mediaStream);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera permissions in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else if (err.name === "NotReadableError") {
        setError("Camera is in use by another application.");
      } else {
        setError("Unable to access camera. Try uploading an image instead.");
      }
    }
  }, [stream]);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      // cleanup on unmount
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFlip = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    startCamera(next);
  }, [facingMode, startCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
          // Stop camera
          stream?.getTracks().forEach((t) => t.stop());
          onCapture(file);
        }
      },
      "image/jpeg",
      0.9
    );
  }, [stream, onCapture]);

  const handleClose = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    onClose();
  }, [stream, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 bg-black/80">
        <span className="text-white font-display font-semibold text-sm">Capture Waste Image</span>
        <button onClick={handleClose} className="text-white/80 hover:text-white p-1">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Video / Error */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center px-6 space-y-4">
            <Camera className="w-16 h-16 mx-auto text-white/40" />
            <p className="text-white/80 text-sm max-w-xs">{error}</p>
            <Button variant="outline" onClick={handleClose} className="border-white/30 text-white hover:bg-white/10">
              Go Back
            </Button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {/* Viewfinder overlay */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 border-2 border-white/20 rounded-2xl" />
            <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br-lg" />
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {!error && (
        <div className="flex items-center justify-center gap-8 p-6 bg-black/80">
          <button onClick={handleFlip} className="text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors">
            <SwitchCamera className="w-6 h-6" />
          </button>
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
          <div className="w-12" /> {/* spacer */}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
