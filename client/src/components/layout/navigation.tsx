import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, User, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Navigation() {
  const { user } = useAuth();
  
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUsagePercentage = () => {
    if (!userData || typeof userData !== 'object' || !('usage' in userData)) return 0;
    const usage = (userData as any).usage || 0;
    const subscription = (userData as any).subscription;
    const limit = subscription?.plan === 'premium' ? 50 : 10;
    return (usage / limit) * 100;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-primary-500";
  };

  return (
    <nav className="relative z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              PromptStruct
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Docs</a>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-4">
            {userData && typeof userData === 'object' && 'usage' in userData && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {(userData as any).usage || 0}/{(userData as any).subscription?.plan === 'premium' ? 50 : 10}
                </Badge>
                <div className="hidden sm:block">
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getUsageColor()}`}
                      style={{ width: `${getUsagePercentage()}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={(userData as any)?.profileImageUrl} 
                alt="Profile" 
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <span className="hidden sm:block text-sm text-slate-300">
              {(userData as any)?.firstName || 'User'}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
