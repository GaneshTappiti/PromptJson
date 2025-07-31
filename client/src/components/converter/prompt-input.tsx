import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Zap, Loader2 } from "lucide-react";
import CategorySelector from "./category-selector";

interface ConvertResponse {
  id: string;
  jsonOutput: any;
  category: string;
  detectedCategory: string;
}

export default function PromptInput() {
  const [promptText, setPromptText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("auto");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const convertMutation = useMutation({
    mutationFn: async (data: { originalPrompt: string; category: string }) => {
      const response = await apiRequest("POST", "/api/convert", data);
      return response.json() as Promise<ConvertResponse>;
    },
    onSuccess: (data) => {
      // Store the result for the output component
      queryClient.setQueryData(['current-conversion'], data);
      
      // Invalidate history to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      
      toast({
        title: "Conversion Successful",
        description: `Prompt converted to ${data.detectedCategory} JSON`,
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
        title: "Conversion Failed",
        description: error.message || "Failed to convert prompt",
        variant: "destructive",
      });
    },
  });

  const handleConvert = () => {
    if (!promptText.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to convert",
        variant: "destructive",
      });
      return;
    }

    if (promptText.length > 2000) {
      toast({
        title: "Prompt Too Long",
        description: "Please limit your prompt to 2000 characters",
        variant: "destructive",
      });
      return;
    }

    convertMutation.mutate({
      originalPrompt: promptText,
      category: selectedCategory,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Input Prompt</h3>
          <CategorySelector 
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
        
        <Textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-40 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
          placeholder="Enter your prompt here...

Example: 'Generate a cinematic video of a mountain eagle flying at sunset with dramatic lighting and smooth camera movements'"
          maxLength={2000}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>{promptText.length} / 2000 characters</span>
            {promptText.length > 1800 && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                Approaching limit
              </Badge>
            )}
          </div>
          
          <Button
            onClick={handleConvert}
            disabled={convertMutation.isPending || !promptText.trim()}
            className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white shadow-lg shadow-primary-500/25 disabled:opacity-50"
          >
            {convertMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Convert Prompt
              </>
            )}
          </Button>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-2 text-xs text-slate-500 text-right">
          Press Ctrl+Enter to convert
        </div>
      </CardContent>
    </Card>
  );
}
