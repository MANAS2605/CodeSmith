import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, Sparkles } from "lucide-react";
import { FileNode } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getFileIconInfo } from "@/lib/file-icons";

interface FileTreeProps {
  files: FileNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  isLoading?: boolean;
}

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
}

function FileTreeItem({ node, depth, selectedPath, onSelectFile }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  const isDirectory = node.type === "directory";
  const isSelected = selectedPath === node.path;
  const iconInfo = getFileIconInfo(node.name, isDirectory, isExpanded);
  const Icon = iconInfo.Icon;

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "file-tree-item group select-none relative transition-all duration-150",
          isSelected
            ? "bg-purple-500/15 text-purple-700 dark:text-cyan-300 font-medium before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-cyan-400 before:shadow-[0_0_8px_#38bdf8]"
            : "hover:bg-purple-500/10 hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        onClick={handleClick}
      >
        {isDirectory ? (
          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </span>
        ) : (
          <span className="w-3.5" />
        )}

        <Icon
          className={cn("w-3.5 h-3.5 shrink-0 transition-colors", iconInfo.className)}
          style={{ color: iconInfo.color }}
        />
        <span className="truncate text-[13px]">{node.name}</span>
      </div>

      {isDirectory && isExpanded && node.children && (
        <div className="relative">
          {/* Constellation thread indent guide */}
          <div
            className="absolute top-0 bottom-0 border-l border-purple-500/20"
            style={{ left: `${depth * 14 + 16}px` }}
          />
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ files, selectedPath, onSelectFile, isLoading }: FileTreeProps) {
  if (isLoading) {
    return (
      <div className="p-3 space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-6 flex items-center gap-2 animate-pulse">
            <div className="w-3.5 h-3.5 bg-purple-500/20 rounded" />
            <div className="h-3 bg-muted/50 rounded flex-1" style={{ width: `${40 + (i % 3) * 20}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground text-xs font-mono">
        No files in workspace
      </div>
    );
  }

  return (
    <div className="py-1.5">
      {files.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}
