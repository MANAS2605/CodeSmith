import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
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
          "file-tree-item group select-none relative",
          isSelected && "active before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-signal"
        )}
        style={{ paddingLeft: `${depth * 14 + 10}px` }}
        onClick={handleClick}
      >
        {isDirectory ? (
          <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-foreground">
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
          {/* Hairline indent guide */}
          <div
            className="absolute top-0 bottom-0 border-l border-border/40"
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
            <div className="w-3.5 h-3.5 bg-muted/60 rounded" />
            <div className="h-3 bg-muted/50 rounded flex-1" style={{ width: `${40 + (i % 3) * 20}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-xs font-mono">
        No files yet
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
