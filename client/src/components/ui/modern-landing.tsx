import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Zap, 
  Code, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Check,
  Star,
  Users,
  Layers,
  Brain,
  Cpu,
  Database,
  Globe
} from "lucide-react";

export default function ModernLanding() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Category Detection",
      description: "AI automatically identifies the type of content you want to generate - from videos to code to emails.",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Conversion",
      description: "Transform natural language prompts into structured JSON in milliseconds with our advanced parsing engine.",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Bidirectional Processing",
      description: "Convert prompts to JSON and JSON back to prompts - perfect for iterating and refining your content.",
      gradient: "from-green-500 to-emerald-400"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Developer-Ready Output",
      description: "Generate clean, structured JSON that integrates seamlessly with your APIs and applications.",
      gradient: "from-orange-500 to-red-400"
    }
  ];

  const stats = [
    { number: "10k+", label: "Conversions" },
    { number: "< 1s", label: "Response Time" },
    { number: "99.9%", label: "Accuracy" },
    { number: "24/7", label: "Availability" }
  ];

  const categories = [
    "Text Generation",
    "Image Creation", 
    "Video Production",
    "Code Development",
    "Email Composition",
    "Research Analysis",
    "Agent Configuration",
    "Design Systems"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <div className="mr-6 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PromptStruct
              </span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <a href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Features
                </a>
                <a href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Pricing
                </a>
                <a href="#examples" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Examples
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <Badge variant="outline" className="px-3 py-1">
              <Sparkles className="w-3 h-3 mr-2" />
              Powered by GPT-4.1 Methodology
            </Badge>
            
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Transform{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Natural Language
                </span>
                {" "}into Structured JSON
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl">
                Convert prompts to JSON and back with intelligent category detection. 
                Perfect for AI developers, prompt engineers, and content creators.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => window.location.href = '/api/login'}>
                Start Converting Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                View Examples
                <Code className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to structure your prompts
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Intelligent parsing, category detection, and seamless conversion for all your AI workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  hoveredFeature === index ? 'shadow-xl' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Support for All Content Types
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Our AI automatically detects and structures prompts across 8 different categories.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-center"
              >
                <div className="font-medium text-sm">{category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to structure your prompts?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Join thousands of developers using PromptStruct to streamline their AI workflows.
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold">PromptStruct</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 PromptStruct. Built for AI developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}