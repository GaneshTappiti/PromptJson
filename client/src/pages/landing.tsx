import ModernLanding from "@/components/ui/modern-landing";

export default function Landing() {
  return <ModernLanding />;
}
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Convert any natural language prompt into structured JSON for AI tools, APIs, and workflows. 
              Perfect for developers, prompt engineers, and AI builders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white text-lg px-8 py-4 shadow-lg shadow-primary-500/25 h-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Converting Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 text-lg px-8 py-4 h-auto"
              >
                View Examples
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">9</div>
                <div className="text-sm text-slate-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10k+</div>
                <div className="text-sm text-slate-400">Conversions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">&lt; 1s</div>
                <div className="text-sm text-slate-400">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                AI Builders
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to structure prompts for modern AI workflows
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Detection</h3>
                <p className="text-slate-400 text-sm">
                  Automatically categorizes prompts into 9 different types: Text, Image, Video, Code, Email, Research, Agent, and Design.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <ArrowRightLeft className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Bidirectional</h3>
                <p className="text-slate-400 text-sm">
                  Convert prompts to JSON and back again. Perfect for testing, validation, and understanding structured data.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Export Ready</h3>
                <p className="text-slate-400 text-sm">
                  One-click copy and export functionality. Download JSON files or copy to clipboard for immediate use in your projects.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-slate-400 text-sm">
                  Advanced prompt parsing with intelligent field extraction and semantic understanding of your requirements.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">History Tracking</h3>
                <p className="text-slate-400 text-sm">
                  Keep track of all your conversions with searchable history and easy re-use of previous prompts.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl shadow-slate-900/50">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-slate-400 text-sm">
                  Sub-second response times with optimized parsing algorithms and efficient data processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl shadow-slate-900/50">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-white mb-2">$0</div>
                  <p className="text-slate-400">Perfect for trying out</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    10 conversions per day
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    All 9 categories supported
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    Basic export options
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    Conversion history
                  </li>
                </ul>
                
                <Button
                  onClick={handleLogin}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 border-primary-500/50 backdrop-blur-sm shadow-xl shadow-primary-500/25 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full opacity-20"></div>
              <CardContent className="p-8 relative">
                <div className="text-center mb-8">
                  <Badge className="bg-gradient-to-r from-primary-500 to-purple-500 text-white mb-4">
                    Most Popular
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-white mb-2">$10</div>
                  <p className="text-slate-400">per month</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    50 conversions per day
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    Priority support
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    Advanced export formats
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    API access
                  </li>
                  <li className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                    Custom templates
                  </li>
                </ul>
                
                <Button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white shadow-lg shadow-primary-500/25"
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/80 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  PromptStruct
                </span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                The most powerful prompt-to-JSON converter for AI builders, developers, and prompt engineers.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#examples" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2024 PromptStruct. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
