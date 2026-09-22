import type React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit, Download, Trash, Sparkles } from "lucide-react";
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
  index?: number;
  onNavigate: (id: number) => void;
  onRename: (e: React.MouseEvent, project: ProjectSummaryResponse) => void;
  onDownload: (e: React.MouseEvent, projectId: number) => void;
  onDelete: (e: React.MouseEvent, projectId: number) => void;
}

export function ProjectTile({
  project,
  index = 0,
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
      className="group flex flex-col cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 rounded-2xl transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Visual Canvas Area with Celestial Border Glow */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border/70 dark:border-[#6D28D9]/30 bg-card transition-all duration-500 group-hover:border-[#EC4899] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]">
        {hasCustomImage ? (
          <img
            src={customThumbnail}
            alt={project.name || "Project"}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
            style={{
              background: gradient.background,
            }}
          >
            {/* Luminous multi-layered cosmic aura */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.35) 0%, transparent 45%),
                  radial-gradient(circle at 80% 75%, rgba(11, 7, 30, 0.6) 0%, transparent 60%),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
                `,
              }}
            />

            {/* Constellation Grid Overlay Pattern */}
            <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:18px_18px]" />

            {/* Decorative Constellation Nodes */}
            <div className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              <svg className="w-full h-full text-white/40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25%" cy="35%" r="2" fill="white" className="animate-pulse" />
                <circle cx="75%" cy="65%" r="2.5" fill="white" />
                <circle cx="50%" cy="40%" r="3" fill="#06B6D4" />
                <line x1="25%" y1="35%" x2="50%" y2="40%" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="50%" y1="40%" x2="75%" y2="65%" stroke="white" strokeWidth="0.8" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* Soft dark vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B071E]/70 via-transparent to-white/10 opacity-85" />
          </div>
        )}

        {/* Hover Sheen Sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6D28D9]/0 via-white/10 to-[#06B6D4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Role badge */}
        {project.role && (
          <div className="absolute top-3 left-3 z-10">
            <RoleBadge
              role={project.role}
              className="backdrop-blur-md bg-background/80 shadow-md border-border/70"
            />
          </div>
        )}

        {/* 3-dot dropdown menu */}
        <div
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-md border border-[#6D28D9]/30 hover:border-[#06B6D4]/60 hover:bg-background text-foreground shadow-md transition-all"
                aria-label="Project options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-lg border-border/80 bg-popover/95 backdrop-blur-md shadow-xl"
            >
              <DropdownMenuItem
                onClick={(e) => onRename(e, project)}
                className="text-xs cursor-pointer gap-2"
              >
                <Edit className="w-3.5 h-3.5 text-[#EC4899]" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => onDownload(e, project.id)}
                className="text-xs cursor-pointer gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                Download Zip
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => onDelete(e, project.id)}
                className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Footer Area */}
      <div className="flex items-center gap-3 px-1.5 pt-3.5">
        <div
          className="relative h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-md ring-2 ring-[#6D28D9]/40 group-hover:ring-[#EC4899]/70 transition-all"
          style={{ backgroundColor: avatarBg }}
        >
          {initial}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#06B6D4] border-2 border-background animate-pulse shadow-[0_0_6px_#06B6D4]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-[#EC4899] dark:group-hover:text-[#06B6D4] transition-colors">
            {project.name || "Untitled Project"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/60" />
            Edited {when}
          </p>
        </div>
      </div>
    </div>
  );
}
