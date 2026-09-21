import {
  Folder,
  FolderOpen,
  FileCode,
  FileCode2,
  FileText,
  FileJson,
  FileImage,
  File,
  LucideIcon,
} from "lucide-react";

export interface FileIconInfo {
  Icon: LucideIcon;
  color: string;
  className: string;
}

export function getFileIconInfo(
  name: string,
  isDirectory: boolean = false,
  isExpanded: boolean = false
): FileIconInfo {
  if (isDirectory) {
    return {
      Icon: isExpanded ? FolderOpen : Folder,
      color: "hsl(var(--muted-foreground))",
      className: "text-muted-foreground",
    };
  }

  const lowerName = name.toLowerCase();
  const ext = lowerName.split(".").pop() || "";

  // Special config files
  if (lowerName === "package.json") {
    return {
      Icon: FileJson,
      color: "hsl(84 34% 38%)",
      className: "text-[hsl(84_34%_38%)]",
    };
  }
  if (lowerName.startsWith(".env")) {
    return {
      Icon: FileCode,
      color: "hsl(38 65% 38%)",
      className: "text-[hsl(38_65%_38%)]",
    };
  }
  if (lowerName.startsWith(".git")) {
    return {
      Icon: FileCode,
      color: "hsl(var(--signal))",
      className: "text-signal",
    };
  }

  // Extensions according to standard VS Code schema
  switch (ext) {
    case "tsx":
    case "ts":
      return {
        Icon: FileCode2,
        color: "hsl(215 25% 42%)",
        className: "text-[hsl(215_25%_42%)]",
      };
    case "jsx":
    case "js":
    case "mjs":
    case "cjs":
      return {
        Icon: FileCode,
        color: "hsl(38 65% 38%)",
        className: "text-[hsl(38_65%_38%)]",
      };
    case "json":
      return {
        Icon: FileJson,
        color: "hsl(38 65% 38%)",
        className: "text-[hsl(38_65%_38%)]",
      };
    case "html":
    case "htm":
      return {
        Icon: FileCode,
        color: "hsl(var(--signal))",
        className: "text-signal",
      };
    case "css":
    case "scss":
    case "sass":
    case "less":
      return {
        Icon: FileCode,
        color: "hsl(215 25% 42%)",
        className: "text-[hsl(215_25%_42%)]",
      };
    case "md":
    case "mdx":
    case "txt":
      return {
        Icon: FileText,
        color: "hsl(var(--muted-foreground))",
        className: "text-muted-foreground",
      };
    case "svg":
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "ico":
    case "webp":
      return {
        Icon: FileImage,
        color: "hsl(var(--muted-foreground))",
        className: "text-muted-foreground",
      };
    default:
      return {
        Icon: File,
        color: "hsl(var(--muted-foreground))",
        className: "text-muted-foreground",
      };
  }
}
