import { supabase } from "@/integrations/supabase/client";

export interface ClassificationResult {
  category: "Organic" | "Recyclable" | "Hazardous" | "Unknown";
  confidence: number;
  items: string[];
  disposal: string;
  tip: string;
}

export async function classifyWaste(imageBase64: string): Promise<ClassificationResult> {
  const { data, error } = await supabase.functions.invoke("classify-waste", {
    body: { imageBase64 },
  });

  if (error) {
    throw new Error(error.message || "Classification failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data as ClassificationResult;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
