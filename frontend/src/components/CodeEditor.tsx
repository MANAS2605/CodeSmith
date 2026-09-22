import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { Loader2 } from "lucide-react";
import { useIsDark } from "@/hooks/use-is-dark";
import { cleanCodeContent, vscodeDarkTheme, vscodeLightTheme } from "@/lib/code-theme";

interface CodeEditorProps {
  content: string;
  filePath: string | null;
  isLoading?: boolean;
  onCodeChange?: (newCode: string) => void;
}

export function CodeEditor({ content, filePath, isLoading, onCodeChange }: CodeEditorProps) {
  const isDark = useIsDark();

  // Strip enclosing markdown backtick code blocks if LLM output included them
  const displayContent = useMemo(() => {
    return cleanCodeContent(content);
  }, [content]);

  // Auto-detect language extension with stable reference via useMemo
  const languageExtension = useMemo(() => {
    if (!filePath) return [javascript({ jsx: true, typescript: true })];
    const ext = filePath.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return [javascript({ jsx: true, typescript: true })];
      case "json":
        return [json()];
      case "css":
      case "scss":
      case "sass":
      case "less":
        return [css()];
      case "html":
      case "svg":
      case "xml":
        return [javascript({ jsx: true })];
      default:
        return [javascript({ jsx: true, typescript: true })];
    }
  }, [filePath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!filePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background">
        <h3 className="font-display text-lg font-medium text-foreground mb-1">
          No file selected
        </h3>
        <p className="text-xs text-muted-foreground">
          Select a file from the explorer on the left to inspect its contents.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-[#080c1e]">
      <CodeMirror
        value={displayContent}
        height="100%"
        theme={isDark ? vscodeDarkTheme : vscodeLightTheme}
        editable={false}
        extensions={languageExtension}
        onChange={(value) => onCodeChange?.(value)}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
        className="text-xs sm:text-[13px] font-mono h-full [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono [&_.cm-gutters]:border-r [&_.cm-gutters]:border-white/5"
      />
    </div>
  );
}
