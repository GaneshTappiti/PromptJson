import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  Copy, 
  RotateCcw, 
  Trash2, 
  Clock,
  AlertCircle
} from "lucide-react";

interface ConversionItem {
  id: string;
  originalPrompt: string;
  category: string;
  jsonOutput: any;
  isReverse: boolean;
  createdAt: string;
}

export default function ConversionHistory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['/api/prompts'],
    retry: false,
  });

  const deletePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      await apiRequest("DELETE", `/api/prompts/${promptId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: "Deleted",
        description: "Conversion removed from history",
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
      
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete conversion",
        variant: "destructive",
      });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/prompts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: "History Cleared",
        description: "All conversions have been removed from history",
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
      
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear history",
        variant: "destructive",
      });
    },
  });

  const handleCopyJSON = async (jsonOutput: any) => {
    try {
      const jsonString = JSON.stringify(jsonOutput, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast({
        title: "Copied to Clipboard",
        description: "JSON has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleReloadConversion = (item: ConversionItem) => {
    // Set the current conversion data for the output component
    queryClient.setQueryData(['current-conversion'], {
      id: item.id,
      jsonOutput: item.jsonOutput,
      category: item.category,
      detectedCategory: item.category,
    });

    toast({
      title: "Conversion Loaded",
      description: "Previous conversion has been loaded in the output panel",
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      text: "🧾",
      image: "🖼️",
      video: "🎥",
      code: "🧠",
      email: "💼",
      research: "📚",
      agent: "🧙‍♂️",
      design: "🎨",
    };
    return icons[category] || "📄";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      text: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      image: "bg-green-500/20 text-green-300 border-green-500/30",
      video: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      code: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      email: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      research: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      agent: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      design: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[category] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading history...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Recent Conversions</h3>
            <Badge variant="outline" className="text-slate-400 border-slate-600">
              {Array.isArray(history) ? history.length : 0}
            </Badge>
          </div>
          {Array.isArray(history) && history.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear History
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {!Array.isArray(history) || history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No conversion history yet</p>
              <p className="text-sm">Start by converting your first prompt!</p>
            </div>
          ) : (
            Array.isArray(history) && history.map((item: any) => (
              <div
                key={item.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 hover:bg-slate-800/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)} {item.category}
                      </Badge>
                      {item.isReverse && (
                        <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
                          Reverse
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2 line-clamp-2">
                      {item.originalPrompt}
                    </p>
                    
                    <p className="text-xs text-slate-500 font-mono line-clamp-1">
                      {JSON.stringify(item.jsonOutput).substring(0, 80)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReloadConversion(item)}
                      className="p-2 text-slate-400 hover:text-primary-400 hover:bg-slate-700"
                      title="Load conversion"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyJSON(item.jsonOutput)}
                      className="p-2 text-slate-400 hover:text-primary-400 hover:bg-slate-700"
                      title="Copy JSON"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePromptMutation.mutate(item.id)}
                      disabled={deletePromptMutation.isPending}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
