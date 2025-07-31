import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  { value: "auto", label: "🤖 Auto-detect", description: "Let AI determine the category" },
  { value: "text", label: "🧾 Text", description: "Articles, stories, content" },
  { value: "image", label: "🖼️ Image", description: "Pictures, artwork, visuals" },
  { value: "video", label: "🎥 Video", description: "Movies, clips, animations" },
  { value: "code", label: "🧠 Code", description: "Functions, scripts, programs" },
  { value: "email", label: "💼 Email", description: "Messages, communications" },
  { value: "research", label: "📚 Research", description: "Analysis, studies, reports" },
  { value: "agent", label: "🧙‍♂️ Agent", description: "AI assistants, bots" },
  { value: "design", label: "🎨 Design", description: "UI, layouts, interfaces" },
];

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="flex items-center space-x-3">
      <Label className="text-sm text-slate-400 whitespace-nowrap">Category:</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          {categories.map((category) => (
            <SelectItem 
              key={category.value} 
              value={category.value}
              className="text-white hover:bg-slate-700 focus:bg-slate-700"
            >
              <div className="flex flex-col">
                <span>{category.label}</span>
                <span className="text-xs text-slate-400">{category.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
