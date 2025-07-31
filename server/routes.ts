import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPromptSchema, insertUsageLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user subscription and usage
      const subscription = await storage.getUserSubscription(userId);
      const usage = await storage.getUserDailyUsage(userId);
      
      res.json({
        ...user,
        subscription,
        usage
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Convert prompt to JSON
  app.post('/api/convert', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check rate limit
      const canConvert = await storage.checkRateLimit(userId);
      if (!canConvert) {
        return res.status(429).json({ 
          message: "Rate limit exceeded. Upgrade to Pro for more conversions.",
          upgradeRequired: true 
        });
      }

      const { originalPrompt, category, isReverse } = insertPromptSchema.parse(req.body);
      
      // Convert prompt based on category
      const jsonOutput = convertPromptToJSON(originalPrompt, category, isReverse);
      
      // Save prompt and increment usage
      const prompt = await storage.createPrompt({
        userId,
        originalPrompt,
        category,
        jsonOutput,
        isReverse: isReverse ?? false
      });
      
      await storage.incrementDailyUsage(userId);
      
      res.json({
        id: prompt.id,
        jsonOutput,
        category,
        detectedCategory: category === 'auto' ? detectCategory(originalPrompt) : category
      });
    } catch (error) {
      console.error("Error converting prompt:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to convert prompt" });
    }
  });

  // Get conversion history
  app.get('/api/prompts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prompts = await storage.getUserPrompts(userId);
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // Delete prompt from history
  app.delete('/api/prompts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const promptId = req.params.id;
      
      await storage.deletePrompt(promptId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  // Clear all history
  app.delete('/api/prompts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearUserPrompts(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing prompts:", error);
      res.status(500).json({ message: "Failed to clear prompts" });
    }
  });

  // Create subscription (mock endpoint for now)
  app.post('/api/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { plan } = req.body;
      
      const subscription = await storage.createSubscription({
        userId,
        plan,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Prompt conversion logic
function detectCategory(prompt: string): string {
  const text = prompt.toLowerCase();
  
  if (text.includes('video') || text.includes('cinematic') || text.includes('movie') || text.includes('film')) {
    return 'video';
  }
  if (text.includes('image') || text.includes('picture') || text.includes('photo') || text.includes('draw')) {
    return 'image';
  }
  if (text.includes('code') || text.includes('function') || text.includes('script') || text.includes('programming')) {
    return 'code';
  }
  if (text.includes('email') || text.includes('message') || text.includes('letter')) {
    return 'email';
  }
  if (text.includes('research') || text.includes('analyze') || text.includes('study')) {
    return 'research';
  }
  if (text.includes('agent') || text.includes('assistant') || text.includes('bot')) {
    return 'agent';
  }
  if (text.includes('design') || text.includes('ui') || text.includes('interface') || text.includes('layout')) {
    return 'design';
  }
  
  return 'text';
}

function convertPromptToJSON(prompt: string, category: string, isReverse: boolean = false): any {
  if (isReverse) {
    // JSON to prompt conversion
    try {
      const json = JSON.parse(prompt);
      return generatePromptFromJSON(json);
    } catch {
      return { error: "Invalid JSON format" };
    }
  }

  const detectedCategory = category === 'auto' ? detectCategory(prompt) : category;
  
  const schemas: Record<string, any> = {
    video: {
      task: "video_generation",
      scene: extractMainSubject(prompt),
      style: extractStyle(prompt) || "standard",
      duration: extractDuration(prompt) || "30s",
      lighting: extractLighting(prompt) || "natural",
      camera_movement: extractCameraMovement(prompt) || "static",
      mood: extractMood(prompt) || "neutral"
    },
    image: {
      task: "image_generation",
      subject: extractMainSubject(prompt),
      style: extractStyle(prompt) || "photorealistic",
      composition: extractComposition(prompt) || "centered",
      lighting: extractLighting(prompt) || "natural",
      color_palette: extractColorPalette(prompt) || "natural",
      aspect_ratio: "16:9"
    },
    text: {
      task: "text_generation",
      content_type: extractContentType(prompt) || "article",
      tone: extractTone(prompt) || "professional",
      length: extractLength(prompt) || "medium",
      target_audience: extractAudience(prompt) || "general",
      format: extractFormat(prompt) || "paragraph"
    },
    code: {
      task: "code_generation",
      language: extractProgrammingLanguage(prompt) || "javascript",
      framework: extractFramework(prompt) || null,
      functionality: extractFunctionality(prompt),
      style: extractCodeStyle(prompt) || "clean",
      comments: extractCommentsPreference(prompt) || true
    },
    email: {
      task: "email_generation",
      type: extractEmailType(prompt) || "professional",
      tone: extractTone(prompt) || "formal",
      recipient: extractRecipient(prompt) || "colleague",
      subject: extractSubject(prompt) || "Important Update",
      call_to_action: extractCallToAction(prompt) || null
    },
    research: {
      task: "research_analysis",
      topic: extractMainSubject(prompt),
      depth: extractDepth(prompt) || "comprehensive",
      sources: extractSources(prompt) || "academic",
      format: extractFormat(prompt) || "report",
      focus_areas: extractFocusAreas(prompt) || []
    },
    agent: {
      task: "agent_configuration",
      role: extractRole(prompt) || "assistant",
      personality: extractPersonality(prompt) || "helpful",
      capabilities: extractCapabilities(prompt) || ["conversation"],
      constraints: extractConstraints(prompt) || [],
      knowledge_domain: extractKnowledgeDomain(prompt) || "general"
    },
    design: {
      task: "design_specification",
      type: extractDesignType(prompt) || "web",
      style: extractStyle(prompt) || "modern",
      color_scheme: extractColorScheme(prompt) || "neutral",
      layout: extractLayout(prompt) || "grid",
      components: extractComponents(prompt) || []
    }
  };

  return schemas[detectedCategory] || schemas.text;
}

function generatePromptFromJSON(json: any): string {
  if (json.task === "video_generation") {
    return `Generate a ${json.style || 'standard'} video showing ${json.scene} with ${json.lighting || 'natural'} lighting for ${json.duration || '30s'}.`;
  }
  if (json.task === "image_generation") {
    return `Create a ${json.style || 'photorealistic'} image of ${json.subject} with ${json.lighting || 'natural'} lighting and ${json.composition || 'centered'} composition.`;
  }
  if (json.task === "text_generation") {
    return `Write a ${json.tone || 'professional'} ${json.content_type || 'article'} in ${json.format || 'paragraph'} format with ${json.length || 'medium'} length.`;
  }
  
  return "Generate content based on the provided JSON structure.";
}

// Helper functions for extraction
function extractMainSubject(prompt: string): string {
  // Simple extraction - in production, use NLP
  const words = prompt.split(' ');
  const stopWords = ['a', 'an', 'the', 'of', 'for', 'with', 'to', 'in', 'on', 'at'];
  const subjects = words.filter(word => word.length > 3 && !stopWords.includes(word.toLowerCase()));
  return subjects.slice(0, 3).join(' ') || 'subject';
}

function extractStyle(prompt: string): string | null {
  const styles = ['cinematic', 'photorealistic', 'artistic', 'vintage', 'modern', 'minimalist', 'dramatic'];
  return styles.find(style => prompt.toLowerCase().includes(style)) || null;
}

function extractDuration(prompt: string): string | null {
  const match = prompt.match(/(\d+)\s*(second|minute|hour|s|m|h)/i);
  return match ? `${match[1]}${match[2][0]}` : null;
}

function extractLighting(prompt: string): string | null {
  const lighting = ['sunset', 'sunrise', 'golden hour', 'dramatic', 'soft', 'natural', 'studio'];
  return lighting.find(light => prompt.toLowerCase().includes(light)) || null;
}

function extractCameraMovement(prompt: string): string | null {
  const movements = ['pan', 'zoom', 'dolly', 'crane', 'handheld', 'steady'];
  return movements.find(movement => prompt.toLowerCase().includes(movement)) || null;
}

function extractMood(prompt: string): string | null {
  const moods = ['happy', 'sad', 'dramatic', 'peaceful', 'energetic', 'mysterious'];
  return moods.find(mood => prompt.toLowerCase().includes(mood)) || null;
}

function extractComposition(prompt: string): string | null {
  const compositions = ['centered', 'rule of thirds', 'close-up', 'wide shot', 'portrait'];
  return compositions.find(comp => prompt.toLowerCase().includes(comp)) || null;
}

function extractColorPalette(prompt: string): string | null {
  const palettes = ['warm', 'cool', 'monochrome', 'vibrant', 'muted', 'pastel'];
  return palettes.find(palette => prompt.toLowerCase().includes(palette)) || null;
}

function extractContentType(prompt: string): string | null {
  const types = ['article', 'blog post', 'essay', 'story', 'poem', 'script'];
  return types.find(type => prompt.toLowerCase().includes(type)) || null;
}

function extractTone(prompt: string): string | null {
  const tones = ['professional', 'casual', 'formal', 'friendly', 'serious', 'humorous'];
  return tones.find(tone => prompt.toLowerCase().includes(tone)) || null;
}

function extractLength(prompt: string): string | null {
  const lengths = ['short', 'medium', 'long', 'brief', 'detailed'];
  return lengths.find(length => prompt.toLowerCase().includes(length)) || null;
}

function extractAudience(prompt: string): string | null {
  const audiences = ['general', 'technical', 'business', 'academic', 'children'];
  return audiences.find(audience => prompt.toLowerCase().includes(audience)) || null;
}

function extractFormat(prompt: string): string | null {
  const formats = ['paragraph', 'bullet points', 'list', 'outline', 'table'];
  return formats.find(format => prompt.toLowerCase().includes(format)) || null;
}

function extractProgrammingLanguage(prompt: string): string | null {
  const languages = ['javascript', 'python', 'java', 'react', 'typescript', 'html', 'css'];
  return languages.find(lang => prompt.toLowerCase().includes(lang)) || null;
}

function extractFramework(prompt: string): string | null {
  const frameworks = ['react', 'vue', 'angular', 'express', 'django', 'flask'];
  return frameworks.find(framework => prompt.toLowerCase().includes(framework)) || null;
}

function extractFunctionality(prompt: string): string {
  // Extract what the code should do
  return extractMainSubject(prompt);
}

function extractCodeStyle(prompt: string): string | null {
  const styles = ['clean', 'functional', 'object-oriented', 'modular'];
  return styles.find(style => prompt.toLowerCase().includes(style)) || null;
}

function extractCommentsPreference(prompt: string): boolean {
  return prompt.toLowerCase().includes('comment') || prompt.toLowerCase().includes('document');
}

function extractEmailType(prompt: string): string | null {
  const types = ['professional', 'marketing', 'follow-up', 'introduction', 'thank you'];
  return types.find(type => prompt.toLowerCase().includes(type)) || null;
}

function extractRecipient(prompt: string): string | null {
  const recipients = ['client', 'colleague', 'manager', 'customer', 'team'];
  return recipients.find(recipient => prompt.toLowerCase().includes(recipient)) || null;
}

function extractSubject(prompt: string): string | null {
  const match = prompt.match(/subject:?\s*["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractCallToAction(prompt: string): string | null {
  const ctas = ['reply', 'schedule', 'call', 'meet', 'review', 'approve'];
  return ctas.find(cta => prompt.toLowerCase().includes(cta)) || null;
}

function extractDepth(prompt: string): string | null {
  const depths = ['surface', 'comprehensive', 'detailed', 'overview'];
  return depths.find(depth => prompt.toLowerCase().includes(depth)) || null;
}

function extractSources(prompt: string): string | null {
  const sources = ['academic', 'news', 'industry', 'government', 'peer-reviewed'];
  return sources.find(source => prompt.toLowerCase().includes(source)) || null;
}

function extractFocusAreas(prompt: string): string[] {
  // Simple extraction of key topics
  return [];
}

function extractRole(prompt: string): string | null {
  const roles = ['assistant', 'teacher', 'consultant', 'advisor', 'expert'];
  return roles.find(role => prompt.toLowerCase().includes(role)) || null;
}

function extractPersonality(prompt: string): string | null {
  const personalities = ['helpful', 'friendly', 'professional', 'casual', 'authoritative'];
  return personalities.find(personality => prompt.toLowerCase().includes(personality)) || null;
}

function extractCapabilities(prompt: string): string[] {
  const capabilities = ['conversation', 'analysis', 'writing', 'coding', 'research'];
  return capabilities.filter(capability => prompt.toLowerCase().includes(capability));
}

function extractConstraints(prompt: string): string[] {
  // Extract any mentioned constraints
  return [];
}

function extractKnowledgeDomain(prompt: string): string | null {
  const domains = ['general', 'technical', 'business', 'medical', 'legal', 'creative'];
  return domains.find(domain => prompt.toLowerCase().includes(domain)) || null;
}

function extractDesignType(prompt: string): string | null {
  const types = ['web', 'mobile', 'desktop', 'print', 'logo', 'ui', 'ux'];
  return types.find(type => prompt.toLowerCase().includes(type)) || null;
}

function extractColorScheme(prompt: string): string | null {
  const schemes = ['neutral', 'warm', 'cool', 'monochrome', 'vibrant', 'pastel'];
  return schemes.find(scheme => prompt.toLowerCase().includes(scheme)) || null;
}

function extractLayout(prompt: string): string | null {
  const layouts = ['grid', 'flexbox', 'sidebar', 'header', 'footer', 'card'];
  return layouts.find(layout => prompt.toLowerCase().includes(layout)) || null;
}

function extractComponents(prompt: string): string[] {
  const components = ['button', 'form', 'navigation', 'modal', 'card', 'table'];
  return components.filter(component => prompt.toLowerCase().includes(component));
}
