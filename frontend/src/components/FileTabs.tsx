import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileIconInfo } from "@/lib/file-icons";

interface FileTabsProps {
  openTabs: string[];
  activeTab: string | null;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
}

const getFileName = (path: string) => path.split("/").pop() || path;

export function FileTabs({ openTabs, activeTab, onSelectTab, onCloseTab }: FileTabsProps) {
  if (openTabs.length === 0) return null;

  return (
    <div className="h-9 flex items-stretch border-b border-border/70 dark:border-purple-500/20 bg-card/30 backdrop-blur-md overflow-x-auto select-none shrink-0">
      {openTabs.map((path) => {
        const isActive = activeTab === path;
        const fileName = getFileName(path);
        const iconInfo = getFileIconInfo(fileName, false);
        const Icon = iconInfo.Icon;

        return (
          <div
            key={path}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelectTab(path)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTab(path);
              }
            }}
            className={cn(
              "group flex items-center gap-2 px-3.5 h-full text-xs border-r border-border/60 dark:border-purple-500/20 cursor-pointer transition-all min-w-0 max-w-[210px] outline-none",
              isActive
                ? "bg-background/90 text-purple-600 dark:text-cyan-300 border-t-2 border-t-cyan-400 font-medium shadow-[0_-2px_12px_rgba(56,189,248,0.2)] -mt-[1px]"
                : "text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
            )}
          >
            <Icon
              className={cn("w-3.5 h-3.5 shrink-0 transition-colors", iconInfo.className)}
              style={{ color: iconInfo.color }}
            />
            <span className="truncate text-xs">{fileName}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(path);
              }}
              className={cn(
                "p-0.5 rounded-full hover:bg-purple-500/20 text-muted-foreground hover:text-purple-400 transition-all shrink-0 ml-auto",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
              )}
              aria-label={`Close ${getFileName(path)}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
