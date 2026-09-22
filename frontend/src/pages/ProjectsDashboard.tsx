import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Search, Loader2, MoreVertical, Trash, Download, Edit, LayoutGrid, List, Sparkles, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api, removeAuthToken, removeUserInfo, getUserInfo } from "@/lib/api";
import { ProjectSummaryResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { RoleBadge } from "@/components/RoleBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProjectTile } from "@/components/ProjectTile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProjectGradient } from "@/lib/project-images";
import { CelestialBackground } from "@/components/celestial/CelestialBackground";
import { ConstellationGraphic } from "@/components/celestial/ConstellationGraphic";

export function ProjectsDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Rename state
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<ProjectSummaryResponse | null>(null);
  const [renameName, setRenameName] = useState("");

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    try {
      const newProject = await api.createProject(newProjectName);
      setProjects([newProject, ...projects]);
      setNewProjectName("");
      setIsDialogOpen(false);
      toast({
        title: "Constellation Initialized",
        description: `Project "${newProject.name}" forged successfully`,
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to forge project",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const promptDeleteProject = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setProjectToDeleteId(projectId);
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteProject = async () => {
    if (!projectToDeleteId) return;

    try {
      await api.deleteProject(projectToDeleteId.toString());
      setProjects((prev) => prev.filter((p) => p.id !== projectToDeleteId));
      toast({ title: "Success", description: "Project removed from workspace" });
    } catch (error) {
      console.error("Failed to delete:", error);
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    } finally {
      setProjectToDeleteId(null);
    }
  };

  const handleDownloadProject = async (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    try {
      const blob = await api.downloadProjectZip(projectId.toString());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Success", description: "Archive download initiated" });
    } catch (error) {
      console.error("Failed to download:", error);
      toast({ title: "Error", description: "Failed to download project", variant: "destructive" });
    }
  };

  const handleRenameClick = (e: React.MouseEvent, project: ProjectSummaryResponse) => {
    e.stopPropagation();
    setProjectToRename(project);
    setRenameName(project.name);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!projectToRename || !renameName.trim()) return;

    try {
      await api.updateProject(projectToRename.id.toString(), renameName);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectToRename.id ? { ...p, name: renameName } : p))
      );
      setIsRenameDialogOpen(false);
      setProjectToRename(null);
      toast({ title: "Success", description: "Project renamed successfully" });
    } catch (error) {
      console.error("Failed to rename:", error);
      toast({ title: "Error", description: "Failed to rename project", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUserInfo();
    navigate("/login");
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  const filteredProjects = safeProjects.filter((project) =>
    (project?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <CelestialBackground className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar with Celestial Glass */}
      <header className="h-14 border-b border-border/70 dark:border-purple-500/20 celestial-glass px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <Logo size="default" />

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 rounded-full border border-purple-500/30 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-tr from-purple-600 to-cyan-500 text-white text-xs font-semibold">
                    {(() => {
                      const userInfo = getUserInfo();
                      if (userInfo?.name) {
                        return userInfo.name.charAt(0).toUpperCase();
                      }
                      return "U";
                    })()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col space-y-1 p-3 border-b border-border/50">
                <p className="text-xs font-medium text-foreground leading-none truncate">
                  {getUserInfo()?.name || "Explorer"}
                </p>
                <p className="text-[11px] text-muted-foreground leading-none truncate font-mono">
                  {getUserInfo()?.username || ""}
                </p>
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-xs mt-1 m-1 rounded-md"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 relative z-10">
        {/* Title & Stats Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6D28D9]/40 bg-[#6D28D9]/15 text-[#06B6D4] text-xs font-mono uppercase tracking-widest mb-2 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#EC4899]" />
              <span>Cosmic Workspace</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                Projects
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6D28D9]/15 border border-[#6D28D9]/30 text-[#06B6D4] font-mono tabular-nums">
                {safeProjects.length} {safeProjects.length === 1 ? "orbit" : "orbits"}
              </span>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white text-sm font-medium gap-2 shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all duration-300 self-start sm:self-auto">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-xl border border-[#6D28D9]/30 celestial-glass p-6 shadow-2xl">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-lg bg-[#6D28D9]/15 text-[#EC4899] border border-[#6D28D9]/30">
                    <Sparkles className="w-4 h-4 text-[#06B6D4]" />
                  </span>
                  <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
                    Forge New Project
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground text-left leading-relaxed">
                  Give your celestial codebase a name. Your AI pair programming assistant will initialize the environment.
                </DialogDescription>
              </DialogHeader>
              <div className="py-3">
                <Input
                  placeholder="e.g. Celestial Analytics"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  className="h-10 text-sm rounded-lg bg-background/80 border-border/80 focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30"
                  autoFocus
                />
              </div>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-9 rounded-lg border-border/80">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isCreating || !newProjectName.trim()}
                  className="h-9 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white font-medium shadow-[0_0_15px_rgba(236,72,153,0.35)]"
                >
                  {isCreating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Forge Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Layout Toggle Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cosmic projects..."
              className="pl-9 h-10 text-sm rounded-xl bg-card/70 border-border/80 dark:border-[#6D28D9]/30 backdrop-blur-md focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-border/80 dark:border-[#6D28D9]/30 bg-card/60 backdrop-blur-md p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-all",
                viewMode === "grid"
                  ? "bg-[#6D28D9]/25 text-[#06B6D4] font-medium shadow-sm border border-[#6D28D9]/40"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg text-xs transition-all",
                viewMode === "list"
                  ? "bg-[#6D28D9]/25 text-[#06B6D4] font-medium shadow-sm border border-[#6D28D9]/40"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content: Grid Tiles / List Table / Skeleton / Empty */}
        {loading ? (
          <div className="border border-border/80 dark:border-purple-500/20 rounded-2xl divide-y divide-border/60 bg-card/60 backdrop-blur-md overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 px-5 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-muted/60 shrink-0" />
                <div className="h-4 bg-muted/60 rounded flex-1 max-w-xs" />
                <div className="h-4 w-16 bg-muted/40 rounded hidden sm:block" />
                <div className="h-4 w-24 bg-muted/40 rounded hidden md:block" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Celestial Empty State with Constellation Graphic */
          <div className="text-center py-20 px-4 border border-dashed border-[#6D28D9]/40 rounded-2xl bg-card/30 backdrop-blur-md relative overflow-hidden">
            <div className="max-w-xs mx-auto mb-6">
              <ConstellationGraphic variant="compass" className="w-32 h-32 mx-auto" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground mb-2 celestial-gradient-text">
              {searchQuery ? "No matching orbits found" : "The Cosmos is Quiet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? "No projects match your cosmic coordinates. Adjust your search to locate your workspace."
                : "Your universe is waiting for its first creation. Forge your first project to start streaming AI code."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="h-10 px-5 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white font-medium text-sm shadow-[0_0_20px_rgba(236,72,153,0.35)] gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Forge First Project</span>
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectTile
                key={project.id}
                project={project}
                index={index}
                onNavigate={(id) => navigate(`/projects/${id}`)}
                onRename={handleRenameClick}
                onDownload={handleDownloadProject}
                onDelete={promptDeleteProject}
              />
            ))}
          </div>
        ) : (
          <div className="border border-border/80 dark:border-[#6D28D9]/30 rounded-2xl overflow-hidden celestial-glass divide-y divide-border/60 shadow-xl">
            {/* Header row (>= md) */}
            <div className="hidden md:grid md:grid-cols-[1fr_130px_150px_48px] items-center px-5 py-3 bg-[#6D28D9]/10 text-[11px] font-mono uppercase tracking-wider text-muted-foreground select-none">
              <div>Orbit / Name</div>
              <div>Clearance</div>
              <div>Last Synced</div>
              <div className="text-right sr-only">Actions</div>
            </div>

            {/* Rows */}
            {filteredProjects.map((project, index) => {
              const gradient = getProjectGradient(project.id, project.name, index);
              const firstLetter = project.name ? project.name.charAt(0).toUpperCase() : "P";

              return (
                <div
                  key={project.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/projects/${project.id}`);
                    }
                  }}
                  className="group flex md:grid md:grid-cols-[1fr_130px_150px_48px] items-center px-5 py-3.5 gap-3 cursor-pointer hover:bg-[#6D28D9]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:ring-inset transition-colors"
                >
                  {/* Name Column with 40px tile */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden font-display text-base font-semibold text-white shadow-md ring-1 ring-white/20"
                      style={{
                        background: gradient.background,
                      }}
                    >
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="drop-shadow-sm">{firstLetter}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-foreground truncate group-hover:text-[#EC4899] dark:group-hover:text-[#06B6D4] transition-colors">
                        {project.name}
                      </div>
                      {/* Mobile meta row */}
                      <div className="flex md:hidden items-center gap-2 mt-1">
                        <RoleBadge role={project.role} />
                        <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Column (desktop) */}
                  <div className="hidden md:flex items-center">
                    <RoleBadge role={project.role} />
                  </div>

                  {/* Date Column (desktop) */}
                  <div className="hidden md:block text-xs text-muted-foreground font-mono tabular-nums">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>

                  {/* Action Menu Column */}
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 transition-opacity"
                          aria-label="Project actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl"
                      >
                        <DropdownMenuItem
                          onClick={(e) => handleRenameClick(e, project)}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#EC4899]" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDownloadProject(e, project.id)}
                          className="text-xs cursor-pointer gap-2"
                        >
                          <Download className="w-3.5 h-3.5 text-[#06B6D4]" />
                          Download Zip
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => promptDeleteProject(e, project.id)}
                          className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                        >
                          <Trash className="w-3.5 h-3.5" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="max-w-md rounded-xl border border-[#6D28D9]/30 celestial-glass p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
              Rename Project
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
              className="h-10 text-sm rounded-lg bg-background/80 border-border/80 focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="h-9 rounded-lg border-border/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!renameName.trim() || renameName === projectToRename?.name}
              className="h-9 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white font-medium shadow-[0_0_15px_rgba(236,72,153,0.35)]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={executeDeleteProject}
        title="Delete Project Orbit"
        description="Are you sure you want to delete this project? All associated code and history will be permanently erased."
        confirmLabel="Delete Orbit"
      />
    </CelestialBackground>
  );
}
