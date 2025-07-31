export interface ConversionCategory {
  value: string;
  label: string;
  icon: string;
  description: string;
  schema: Record<string, any>;
}

export const conversionCategories: ConversionCategory[] = [
  {
    value: "auto",
    label: "Auto-detect",
    icon: "🤖",
    description: "Let AI determine the category",
    schema: {},
  },
  {
    value: "text",
    label: "Text",
    icon: "🧾",
    description: "Articles, stories, content generation",
    schema: {
      task: "text_generation",
      content_type: "article",
      tone: "professional",
      length: "medium",
      target_audience: "general",
      format: "paragraph",
      language: "english",
      style: "informative"
    },
  },
  {
    value: "image",
    label: "Image",
    icon: "🖼️",
    description: "Pictures, artwork, visual generation",
    schema: {
      task: "image_generation",
      subject: "main subject",
      style: "photorealistic",
      composition: "centered",
      lighting: "natural",
      color_palette: "natural",
      aspect_ratio: "16:9",
      quality: "high",
      mood: "neutral"
    },
  },
  {
    value: "video",
    label: "Video",
    icon: "🎥",
    description: "Movies, clips, animations",
    schema: {
      task: "video_generation",
      scene: "main scene description",
      style: "cinematic",
      duration: "30s",
      lighting: "natural",
      camera_movement: "static",
      mood: "neutral",
      resolution: "1080p",
      fps: "24"
    },
  },
  {
    value: "code",
    label: "Code",
    icon: "🧠",
    description: "Functions, scripts, programs",
    schema: {
      task: "code_generation",
      language: "javascript",
      framework: null,
      functionality: "core functionality",
      style: "clean",
      comments: true,
      testing: false,
      documentation: true
    },
  },
  {
    value: "email",
    label: "Email",
    icon: "💼",
    description: "Messages, communications",
    schema: {
      task: "email_generation",
      type: "professional",
      tone: "formal",
      recipient: "colleague",
      subject: "Important Update",
      call_to_action: null,
      urgency: "normal",
      length: "medium"
    },
  },
  {
    value: "research",
    label: "Research",
    icon: "📚",
    description: "Analysis, studies, reports",
    schema: {
      task: "research_analysis",
      topic: "main research topic",
      depth: "comprehensive",
      sources: "academic",
      format: "report",
      focus_areas: [],
      methodology: "qualitative",
      timeline: "current"
    },
  },
  {
    value: "agent",
    label: "Agent",
    icon: "🧙‍♂️",
    description: "AI assistants, bots, personas",
    schema: {
      task: "agent_configuration",
      role: "assistant",
      personality: "helpful",
      capabilities: ["conversation"],
      constraints: [],
      knowledge_domain: "general",
      interaction_style: "conversational",
      response_length: "concise"
    },
  },
  {
    value: "design",
    label: "Design",
    icon: "🎨",
    description: "UI, layouts, interfaces",
    schema: {
      task: "design_specification",
      type: "web",
      style: "modern",
      color_scheme: "neutral",
      layout: "grid",
      components: [],
      typography: "sans-serif",
      spacing: "comfortable"
    },
  },
];

export function getCategoryByValue(value: string): ConversionCategory | undefined {
  return conversionCategories.find(cat => cat.value === value);
}

export function getDefaultSchema(category: string): Record<string, any> {
  const cat = getCategoryByValue(category);
  return cat?.schema || conversionCategories[1].schema; // Default to text schema
}

export function getCategoryIcon(category: string): string {
  const cat = getCategoryByValue(category);
  return cat?.icon || "📄";
}

export function getCategoryColor(category: string): string {
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
  return colors[category] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
}
