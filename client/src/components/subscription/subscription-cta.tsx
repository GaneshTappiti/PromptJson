import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Zap, Crown, Check } from "lucide-react";

export default function SubscriptionCTA() {
  const { user } = useAuth();
  
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user,
  });

  // Don't show CTA if user is already premium
  if ((userData as any)?.subscription?.plan === 'premium') {
    return null;
  }

  const currentUsage = (userData as any)?.usage || 0;
  const dailyLimit = 10;
  const usagePercentage = (currentUsage / dailyLimit) * 100;

  const handleUpgrade = () => {
    // In a real app, this would integrate with a payment processor
    // For now, just show a toast or redirect to a payment page
    alert("Upgrade functionality would be integrated with Stripe/PayPal here");
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 via-slate-800/50 to-primary-900/20 border-primary-500/20 backdrop-blur-sm shadow-xl shadow-primary-500/10">
      <CardContent className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg shadow-primary-500/25">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Unlock Full Power with{" "}
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Pro
            </span>
          </h3>
          
          <p className="text-slate-400 mb-6 text-lg">
            Get 5x more conversions, priority support, and advanced features for just $10/month.
          </p>
          
          {/* Usage Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>Today's Usage</span>
              <span>
                <span className="text-white font-medium">{currentUsage}</span> of {dailyLimit} conversions
              </span>
            </div>
            <Progress 
              value={usagePercentage} 
              className="h-3 bg-slate-700"
            />
            {usagePercentage >= 80 && (
              <p className="text-yellow-400 text-sm mt-2 flex items-center justify-center">
                <Zap className="w-4 h-4 mr-1" />
                Running low on conversions!
              </p>
            )}
          </div>

          {/* Feature Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-center mb-4">
                <Badge variant="outline" className="text-slate-400 border-slate-600">
                  Free Plan
                </Badge>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-slate-500" />
                  10 conversions/day
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-slate-500" />
                  Basic categories
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-slate-500" />
                  Standard support
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl p-4 border border-primary-500/30">
              <div className="text-center mb-4">
                <Badge className="bg-gradient-to-r from-primary-500 to-purple-500 text-white">
                  Pro Plan
                </Badge>
              </div>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary-400" />
                  50 conversions/day
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary-400" />
                  All categories + advanced
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary-400" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary-400" />
                  API access
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-primary-400" />
                  Custom templates
                </li>
              </ul>
            </div>
          </div>
          
          <Button
            onClick={handleUpgrade}
            size="lg"
            className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg shadow-lg shadow-primary-500/25 h-auto"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Pro - $10/month
          </Button>

          <p className="text-xs text-slate-500 mt-4">
            Cancel anytime • No setup fees • Instant activation
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
