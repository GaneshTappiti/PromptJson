import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ArrowRightLeft, Loader2 } from "lucide-react";

export default function ReverseConverter() {
  const [jsonInput, setJsonInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();

  const reverseMutation = useMutation({
    mutationFn: async (data: { originalPrompt: string; category: string; isReverse: boolean }) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedPrompt(data.jsonOutput);
      toast({
        title: "Reverse Conversion Successful",
        description: "JSON has been converted to a natural language prompt",
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      if (error.message.includes('429')) {
        toast({
          title: "Rate Limit Exceeded",
          description: "You've reached your daily limit. Upgrade to Pro for more conversions.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Reverse Conversion Failed",
        description: error.message || "Failed to convert JSON to prompt",
        variant: "destructive",
      });
    },
  });

  const handleReverseConvert = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty JSON",
        description: "Please enter JSON to convert",
        variant: "destructive",
      });
      return;
    }

    // Validate JSON
    try {
      JSON.parse(jsonInput);
    } catch {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON format",
        variant: "destructive",
      });
      return;
    }

    reverseMutation.mutate({
      originalPrompt: jsonInput,
      category: "auto", // Will be ignored for reverse conversion
      isReverse: true,
    });
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) {
      toast({
        title: "Nothing to Copy",
        description: "Convert JSON first to copy the generated prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied to Clipboard",
        description: "Generated prompt has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-primary-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <ArrowRightLeft className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Reverse Convert: JSON → Prompt</h3>
          </div>
          <Button
            onClick={handleReverseConvert}
            disabled={reverseMutation.isPending || !jsonInput.trim()}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 disabled:opacity-50"
          >
            {reverseMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert to Prompt"
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-slate-300 mb-2">JSON Input</Label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-32 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none font-mono text-sm"
              placeholder='{"task": "image_generation", "style": "photorealistic", "subject": "cat"}'
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-slate-300">Generated Prompt</Label>
              {generatedPrompt && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPrompt}
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white text-xs"
                >
                  Copy
                </Button>
              )}
            </div>
            <div className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl p-4 text-slate-300 overflow-y-auto">
              {generatedPrompt ? (
                <p className="text-sm">{generatedPrompt}</p>
              ) : (
                <p className="text-slate-400 italic text-sm">
                  Converted prompt will appear here...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Example Templates */}
        <div className="mt-4 border-t border-slate-700 pt-4">
          <Label className="text-xs text-slate-500 mb-2 block">Quick Examples:</Label>
          <div className="flex flex-wrap gap-2">
            {[
              '{"task": "video_generation", "style": "cinematic", "scene": "sunset"}',
              '{"task": "text_generation", "tone": "professional", "type": "email"}',
              '{"task": "image_generation", "style": "photorealistic", "subject": "landscape"}',
            ].map((example, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => setJsonInput(example)}
                className="text-xs bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-slate-300"
              >
                Example {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
