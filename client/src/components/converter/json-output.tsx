import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Copy, Download, FileJson } from "lucide-react";
import MonacoEditor from "@/components/ui/monaco-editor";

export default function JSONOutput() {
  const { toast } = useToast();
  
  const { data: conversionData } = useQuery({
    queryKey: ['current-conversion'],
    enabled: false, // Only enabled when we have data
  });

  const jsonString = (conversionData && typeof conversionData === 'object' && 'jsonOutput' in conversionData)
    ? JSON.stringify((conversionData as any).jsonOutput, null, 2)
    : '';

  const handleCopy = async () => {
    if (!jsonString) {
      toast({
        title: "Nothing to Copy",
        description: "Convert a prompt first to copy the JSON output",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonString);
      toast({
        title: "Copied to Clipboard",
        description: "JSON output has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (!jsonString) {
      toast({
        title: "Nothing to Export",
        description: "Convert a prompt first to export the JSON output",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${(conversionData as any)?.category || 'conversion'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "JSON file has been downloaded",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">JSON Output</h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="h-40 rounded-xl overflow-hidden border border-slate-600">
          {jsonString ? (
            <MonacoEditor
              value={jsonString}
              language="json"
              readOnly
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
                folding: true,
                wordWrap: 'on' as const,
              }}
            />
          ) : (
            <div className="h-full bg-slate-900 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <FileJson className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Convert a prompt to see JSON output here</p>
                <div className="mt-4 opacity-50 text-xs font-mono">
                  <div className="text-cyan-400">{"{"}</div>
                  <div className="ml-4">
                    <span className="text-blue-400">"task"</span>: <span className="text-green-400">"video_generation"</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">"scene"</span>: <span className="text-green-400">"mountain eagle flying"</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">"style"</span>: <span className="text-green-400">"cinematic"</span>
                  </div>
                  <div className="text-cyan-400">{"}"}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Auto-detected Category Badge */}
        {(conversionData && typeof conversionData === 'object' && 'detectedCategory' in conversionData) && (
          <div className="mt-4">
            <Badge className="bg-primary-500/20 text-primary-300 border border-primary-500/30">
              <div className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse"></div>
              Auto-detected: {(conversionData as any).detectedCategory}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
