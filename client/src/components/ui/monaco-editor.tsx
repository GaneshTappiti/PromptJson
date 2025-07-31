import { useEffect, useRef } from "react";

interface MonacoEditorProps {
  value: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  options?: any;
}

export default function MonacoEditor({
  value,
  language = "json",
  theme = "vs-dark",
  readOnly = false,
  onChange,
  options = {},
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Load Monaco Editor dynamically
    const loadMonaco = async () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        const monaco = await import("monaco-editor");
        
        // Configure Monaco for dark theme
        monaco.editor.defineTheme("json-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "key", foreground: "06b6d4" },
            { token: "string", foreground: "10b981" },
            { token: "number", foreground: "f59e0b" },
            { token: "keyword", foreground: "8b5cf6" },
          ],
          colors: {
            "editor.background": "#0f172a",
            "editor.foreground": "#e2e8f0",
            "editorLineNumber.foreground": "#64748b",
            "editor.selectionBackground": "#334155",
            "editor.lineHighlightBackground": "#1e293b",
          },
        });

        if (containerRef.current && !editorRef.current) {
          editorRef.current = monaco.editor.create(containerRef.current, {
            value,
            language,
            theme: "json-dark",
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            lineNumbers: 'on' as const,
            folding: true,
            wordWrap: 'on' as const,
            automaticLayout: true,
            ...options,
          });

          if (onChange) {
            editorRef.current.onDidChangeModelContent(() => {
              onChange(editorRef.current.getValue());
            });
          }
        }
      }
    };

    loadMonaco();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: "200px" }}
    />
  );
}
