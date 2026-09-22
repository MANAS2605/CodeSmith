import { useState } from "react";
import { X, Wrench, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RuntimeError {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  filename?: string;
  stack?: string;
}

interface RuntimeErrorAlertProps {
  error: RuntimeError | null;
  onDismiss: () => void;
  onFix: (error: RuntimeError) => void;
}

export function RuntimeErrorAlert({
  error,
  onDismiss,
  onFix,
}: RuntimeErrorAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  const filenameBasename = error.filename?.split("/").pop();

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div className="w-[400px] max-w-[calc(100vw-2rem)] bg-card dark:bg-[#2D1B4E] border border-border dark:border-[#6D28D9]/40 border-l-[3px] border-l-destructive rounded-xl shadow-2xl overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/60 dark:border-[#6D28D9]/30 bg-muted/30 dark:bg-[#0B071E]/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
            <h3 className="text-xs font-semibold text-foreground">
              Issue detected
            </h3>
            {error.source && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-muted dark:bg-[#0B071E] border border-border dark:border-[#6D28D9]/30 text-muted-foreground uppercase">
                {error.source}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
            aria-label="Dismiss issue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-3.5 space-y-2.5">
          <div
            className="group cursor-pointer select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5 shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                {filenameBasename && (
                  <div className="text-[11px] font-mono text-muted-foreground mb-1 truncate">
                    in {filenameBasename}
                    {error.lineno ? `:${error.lineno}` : ""}
                  </div>
                )}
                <p
                  className={cn(
                    "text-xs font-mono text-foreground/90 break-words leading-relaxed",
                    !isExpanded && "line-clamp-2"
                  )}
                >
                  {error.message}
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Stack Trace */}
          {isExpanded && error.stack && (
            <div className="mt-2 pl-5">
              <div className="p-2.5 bg-muted/40 dark:bg-[#0B071E]/70 rounded-[6px] border border-border/70 dark:border-[#6D28D9]/30 overflow-auto max-h-[180px]">
                <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap leading-tight">
                  {error.stack}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-panel dark:bg-[#2D1B4E]/80 border-t border-border dark:border-[#6D28D9]/30 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
          >
            Dismiss
          </button>
          <Button
            size="sm"
            onClick={() => onFix(error)}
            className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white text-xs font-medium gap-1.5 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fix issues</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
