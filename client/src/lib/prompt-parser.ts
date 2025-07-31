import { getDefaultSchema } from './conversion-schemas';

export interface ParsedPrompt {
  detectedCategory: string;
  confidence: number;
  extractedFields: Record<string, any>;
  suggestions: string[];
}

// Keywords for category detection
const categoryKeywords: Record<string, string[]> = {
  video: [
    'video', 'cinematic', 'movie', 'film', 'footage', 'clip', 'animation',
    'camera', 'shot', 'scene', 'frame', 'motion', 'movement', 'flying',
    'sunset', 'sunrise', 'drone', 'aerial'
  ],
  image: [
    'image', 'picture', 'photo', 'artwork', 'illustration', 'draw', 'paint',
    'portrait', 'landscape', 'visual', 'graphic', 'render', 'composition',
    'lighting', 'color', 'style'
  ],
  code: [
    'code', 'function', 'script', 'program', 'algorithm', 'class', 'method',
    'javascript', 'python', 'react', 'component', 'api', 'database',
    'authentication', 'programming', 'development', 'software'
  ],
  email: [
    'email', 'message', 'letter', 'communication', 'memo', 'correspondence',
    'professional', 'business', 'client', 'colleague', 'team', 'subject',
    'reply', 'response', 'meeting', 'schedule'
  ],
  research: [
    'research', 'analyze', 'study', 'investigate', 'examine', 'report',
    'analysis', 'findings', 'data', 'statistics', 'survey', 'academic',
    'scholarly', 'literature', 'methodology'
  ],
  agent: [
    'agent', 'assistant', 'bot', 'chatbot', 'ai', 'persona', 'character',
    'helper', 'advisor', 'consultant', 'guide', 'support', 'service',
    'interaction', 'conversation'
  ],
  design: [
    'design', 'ui', 'interface', 'layout', 'wireframe', 'mockup',
    'prototype', 'user experience', 'ux', 'frontend', 'website',
    'app', 'dashboard', 'component', 'navigation'
  ],
  text: [
    'write', 'article', 'blog', 'story', 'content', 'paragraph',
    'essay', 'document', 'copy', 'text', 'words', 'prose',
    'narrative', 'description', 'summary'
  ]
};

// Style keywords
const styleKeywords: string[] = [
  'cinematic', 'photorealistic', 'artistic', 'vintage', 'modern',
  'minimalist', 'dramatic', 'elegant', 'professional', 'casual',
  'formal', 'friendly', 'serious', 'humorous', 'creative'
];

// Mood keywords
const moodKeywords: string[] = [
  'happy', 'sad', 'dramatic', 'peaceful', 'energetic', 'mysterious',
  'romantic', 'exciting', 'calm', 'intense', 'nostalgic', 'futuristic'
];

// Lighting keywords
const lightingKeywords: string[] = [
  'sunset', 'sunrise', 'golden hour', 'dramatic', 'soft', 'natural',
  'studio', 'harsh', 'warm', 'cool', 'bright', 'dim', 'backlit'
];

// Duration patterns
const durationPattern = /(\d+)\s*(second|minute|hour|s|m|h)/gi;

// Color patterns
const colorKeywords: string[] = [
  'warm', 'cool', 'monochrome', 'vibrant', 'muted', 'pastel',
  'bright', 'dark', 'colorful', 'neutral', 'blue', 'red', 'green'
];

export function detectCategory(prompt: string): string {
  const text = prompt.toLowerCase();
  const scores: Record<string, number> = {};

  // Initialize scores
  Object.keys(categoryKeywords).forEach(category => {
    scores[category] = 0;
  });

  // Score based on keyword matches
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        scores[category] += matches.length;
      }
    });
  });

  // Find the category with the highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) {
    return 'text'; // Default fallback
  }

  const detectedCategory = Object.entries(scores)
    .find(([_, score]) => score === maxScore)?.[0];

  return detectedCategory || 'text';
}

export function extractMainSubject(prompt: string): string {
  // Remove common stop words and extract meaningful subjects
  const stopWords = new Set([
    'a', 'an', 'the', 'of', 'for', 'with', 'to', 'in', 'on', 'at',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'must', 'shall',
    'generate', 'create', 'make', 'build', 'design', 'write'
  ]);

  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Take the first few meaningful words
  return words.slice(0, 4).join(' ') || 'subject';
}

export function extractStyle(prompt: string): string | null {
  const text = prompt.toLowerCase();
  return styleKeywords.find(style => text.includes(style)) || null;
}

export function extractMood(prompt: string): string | null {
  const text = prompt.toLowerCase();
  return moodKeywords.find(mood => text.includes(mood)) || null;
}

export function extractLighting(prompt: string): string | null {
  const text = prompt.toLowerCase();
  return lightingKeywords.find(light => text.includes(light)) || null;
}

export function extractDuration(prompt: string): string | null {
  const match = prompt.match(durationPattern);
  if (match) {
    const num = match[1];
    const unit = match[2].charAt(0);
    return `${num}${unit}`;
  }
  return null;
}

export function extractColorPalette(prompt: string): string | null {
  const text = prompt.toLowerCase();
  return colorKeywords.find(color => text.includes(color)) || null;
}

export function extractTone(prompt: string): string | null {
  const tones = ['professional', 'casual', 'formal', 'friendly', 'serious', 'humorous'];
  const text = prompt.toLowerCase();
  return tones.find(tone => text.includes(tone)) || null;
}

export function extractLanguage(prompt: string): string | null {
  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c++',
    'react', 'vue', 'angular', 'node', 'express', 'django'
  ];
  const text = prompt.toLowerCase();
  return languages.find(lang => text.includes(lang)) || null;
}

export function parsePrompt(prompt: string, category?: string): ParsedPrompt {
  const detectedCategory = category === 'auto' ? detectCategory(prompt) : category || detectCategory(prompt);
  const schema = getDefaultSchema(detectedCategory);
  const extractedFields: Record<string, any> = { ...schema };

  // Extract common fields
  const subject = extractMainSubject(prompt);
  const style = extractStyle(prompt);
  const mood = extractMood(prompt);
  const lighting = extractLighting(prompt);
  const duration = extractDuration(prompt);
  const colorPalette = extractColorPalette(prompt);
  const tone = extractTone(prompt);
  const language = extractLanguage(prompt);

  // Apply extracted values to schema based on category
  switch (detectedCategory) {
    case 'video':
      extractedFields.scene = subject;
      if (style) extractedFields.style = style;
      if (mood) extractedFields.mood = mood;
      if (lighting) extractedFields.lighting = lighting;
      if (duration) extractedFields.duration = duration;
      break;

    case 'image':
      extractedFields.subject = subject;
      if (style) extractedFields.style = style;
      if (mood) extractedFields.mood = mood;
      if (lighting) extractedFields.lighting = lighting;
      if (colorPalette) extractedFields.color_palette = colorPalette;
      break;

    case 'text':
      if (tone) extractedFields.tone = tone;
      if (style) extractedFields.style = style;
      break;

    case 'code':
      extractedFields.functionality = subject;
      if (language) extractedFields.language = language;
      break;

    case 'email':
      if (tone) extractedFields.tone = tone;
      break;

    case 'research':
      extractedFields.topic = subject;
      break;

    case 'agent':
      extractedFields.role = subject.includes('assistant') ? 'assistant' : 'helper';
      break;

    case 'design':
      if (style) extractedFields.style = style;
      if (colorPalette) extractedFields.color_scheme = colorPalette;
      break;
  }

  const suggestions: string[] = [];
  
  // Generate suggestions based on missing fields
  if (!style && (detectedCategory === 'video' || detectedCategory === 'image')) {
    suggestions.push('Consider adding a style specification (e.g., "cinematic", "photorealistic")');
  }
  
  if (!lighting && (detectedCategory === 'video' || detectedCategory === 'image')) {
    suggestions.push('Add lighting details (e.g., "golden hour", "dramatic lighting")');
  }
  
  if (!duration && detectedCategory === 'video') {
    suggestions.push('Specify duration (e.g., "30 seconds", "1 minute")');
  }

  return {
    detectedCategory,
    confidence: 0.8, // Simple confidence score
    extractedFields,
    suggestions
  };
}

export function convertPromptToJSON(prompt: string, category: string, isReverse = false): any {
  if (isReverse) {
    return generatePromptFromJSON(prompt);
  }

  const parsed = parsePrompt(prompt, category);
  return parsed.extractedFields;
}

export function generatePromptFromJSON(jsonString: string): string {
  try {
    const json = JSON.parse(jsonString);
    
    if (json.task === "video_generation") {
      const parts = [
        "Generate a",
        json.style || "standard",
        "video showing",
        json.scene || "a scene",
      ];
      
      if (json.lighting) parts.push(`with ${json.lighting} lighting`);
      if (json.duration) parts.push(`for ${json.duration}`);
      if (json.mood) parts.push(`with a ${json.mood} mood`);
      if (json.camera_movement && json.camera_movement !== "static") {
        parts.push(`using ${json.camera_movement} camera movement`);
      }
      
      return parts.join(" ") + ".";
    }
    
    if (json.task === "image_generation") {
      const parts = [
        "Create a",
        json.style || "photorealistic",
        "image of",
        json.subject || "a subject",
      ];
      
      if (json.lighting) parts.push(`with ${json.lighting} lighting`);
      if (json.composition) parts.push(`using ${json.composition} composition`);
      if (json.color_palette) parts.push(`with ${json.color_palette} colors`);
      if (json.mood) parts.push(`conveying a ${json.mood} mood`);
      
      return parts.join(" ") + ".";
    }
    
    if (json.task === "text_generation") {
      const parts = [
        "Write a",
        json.tone || "professional",
        json.content_type || "article",
      ];
      
      if (json.length) parts.push(`of ${json.length} length`);
      if (json.target_audience) parts.push(`for ${json.target_audience} audience`);
      if (json.format) parts.push(`in ${json.format} format`);
      
      return parts.join(" ") + ".";
    }
    
    if (json.task === "code_generation") {
      const parts = [
        "Build a",
        json.language || "JavaScript",
      ];
      
      if (json.framework) parts.push(json.framework);
      parts.push("solution for");
      parts.push(json.functionality || "the specified functionality");
      
      if (json.style) parts.push(`with ${json.style} code style`);
      if (json.comments) parts.push("including detailed comments");
      
      return parts.join(" ") + ".";
    }
    
    if (json.task === "email_generation") {
      const parts = [
        "Compose a",
        json.tone || "professional",
        json.type || "business",
        "email",
      ];
      
      if (json.recipient) parts.push(`to a ${json.recipient}`);
      if (json.subject) parts.push(`with subject "${json.subject}"`);
      if (json.call_to_action) parts.push(`requesting ${json.call_to_action}`);
      
      return parts.join(" ") + ".";
    }
    
    // Generic fallback
    return `Generate content based on the provided JSON structure with task: ${json.task || "unspecified"}.`;
    
  } catch (error) {
    return "Invalid JSON format. Please provide valid JSON to convert.";
  }
}
