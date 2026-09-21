import type React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit, Download, Trash } from "lucide-react";
import { ProjectSummaryResponse } from "@/lib/types";
import { getProjectGradient, getAvatarColor } from "@/lib/project-images";
import { getUserInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/RoleBadge";

interface ProjectTileProps {
  project: ProjectSummaryResponse;
  onNavigate: (id: number) => void;
  onRename: (e: React.MouseEvent, project: ProjectSummaryResponse) => void;
  onDownload: (e: React.MouseEvent, projectId: number) => void;
  onDelete: (e: React.MouseEvent, projectId: number) => void;
}

export function ProjectTile({
  project,
  onNavigate,
  onRename,
  onDownload,
  onDelete,
}: ProjectTileProps) {
  if (!project) return null;

  const gradient = getProjectGradient(project.id, project.name);
  const avatarBg = gradient.accent || getAvatarColor(project.name || project.id);
  const user = getUserInfo();
  const initial = (
    (user?.name && user.name.trim().charAt(0)) ||
    (user?.username && user.username.trim().charAt(0)) ||
    (project.name && project.name.trim().charAt(0)) ||
    "P"
  ).toUpperCase();

  const when = project.createdAt
    ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })
    : "recently";

  const customThumbnail = project.thumbnailUrl;
  const hasCustomImage =
    customThumbnail &&
    (customThumbnail.startsWith("http://") ||
      customThumbnail.startsWith("https://") ||
      customThumbnail.startsWith("data:image/"));

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onNavigate(project.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate(project.id);
        }
      }}
      className="group flex flex-col cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-[16px]"
    >
      {/* Visual Canvas Area */}
      <div className="relative aspect-[16/10] w-full rounded-[16px] overflow-hidden border border-border/80 dark:border-[#27272a] bg-card transition-all duration-300 group-hover:border-signal/50 group-hover:shadow-lg">
        {hasCustomImage ? (
          <img
            src={customThumbnail}
            alt={project.name || "Project"}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
            style={{
              background: gradient.background,
            }}
          >
            {/* Luminous multi-layered radial lighting aura */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.28) 0%, transparent 45%),
                  radial-gradient(circle at 82% 82%, rgba(0, 0, 0, 0.35) 0%, transparent 55%),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)
                `,
              }}
            />
            {/* Soft dark vignette bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5 opacity-70" />
          </div>
        )}

        {/* Hover overlay sheen */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-colors duration-200" />

        {/* Role badge */}
        {project.role && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <RoleBadge
              role={project.role}
              className="shadow-xs backdrop-blur-md bg-background/85"
            />
          </div>
        )}

        {/* 3-dot dropdown menu */}
        <div
          className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/85 backdrop-blur-md border border-border/60 hover:bg-background text-foreground shadow-xs"
                aria-label="Project options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-[6px] border-border bg-popover shadow-md"
            >
              <DropdownMenuItem
                onClick={(e) => onRename(e, project)}
                className="text-xs cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => onDownload(e, project.id)}
                className="text-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => onDelete(e, project.id)}
                className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                <Trash className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Footer Area */}
      <div className="flex items-center gap-3 px-1 pt-3">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-xs ring-1 ring-white/20"
          style={{ backgroundColor: avatarBg }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">
            {project.name || "Untitled Project"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Edited {when}
          </p>
        </div>
      </div>
    </div>
  );
}
