import type React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Edit, Download, Trash, Sparkles } from "lucide-react";
import { ProjectSummaryResponse } from "@/lib/types";
import { getProjectGradient, getAvatarColor } from "@/lib/project-images";
import { getConstellationForProject } from "@/lib/constellations";
import { ProjectConstellation } from "@/components/celestial/ProjectConstellation";
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
  const constellation = getConstellationForProject(project.id, project.name, index);
  const avatarBg = constellation.spectralColor || gradient.accent || getAvatarColor(project.name || project.id);
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
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border/70 dark:border-purple-500/20 bg-card transition-all duration-500 group-hover:border-purple-400/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]">
        {hasCustomImage ? (
          <img
            src={customThumbnail}
            alt={project.name || "Project"}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
            <ProjectConstellation constellation={constellation} />
          </div>
        )}

        {/* Hover Sheen Sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-white/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
                className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-md border border-border/80 dark:border-purple-500/20 hover:border-cyan-400/60 hover:bg-background text-foreground shadow-md transition-all"
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
                <Edit className="w-3.5 h-3.5 text-purple-400" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => onDownload(e, project.id)}
                className="text-xs cursor-pointer gap-2"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
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
          className="relative h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-md ring-2 ring-purple-500/30 group-hover:ring-cyan-400/70 transition-all"
          style={{ backgroundColor: avatarBg }}
        >
          {initial}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-background animate-pulse shadow-[0_0_6px_#38bdf8]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
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
