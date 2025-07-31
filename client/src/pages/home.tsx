import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import PromptInput from "@/components/converter/prompt-input";
import JSONOutput from "@/components/converter/json-output";
import ReverseConverter from "@/components/converter/reverse-converter";
import ConversionHistory from "@/components/history/conversion-history";
import SubscriptionCTA from "@/components/subscription/subscription-cta";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the converter.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-50"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-purple-900/20"></div>
      
      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Transform{" "}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
              Prompts
            </span>{" "}
            into JSON
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Convert any natural language prompt into structured JSON for AI tools, APIs, and workflows.
          </p>
        </div>

        {/* Main Converter Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <PromptInput />
          <JSONOutput />
        </div>

        {/* Reverse Converter */}
        <div className="mb-12">
          <ReverseConverter />
        </div>

        {/* Conversion History */}
        <div className="mb-12">
          <ConversionHistory />
        </div>

        {/* Subscription CTA */}
        <SubscriptionCTA />
      </main>
    </div>
  );
}
