import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Search, Loader2, MoreVertical, Trash, Download, Edit, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api, removeAuthToken, removeUserInfo, getUserInfo } from "@/lib/api";
import { ProjectSummaryResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { projectTone, cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { RoleBadge } from "@/components/RoleBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProjectTile } from "@/components/ProjectTile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProjectGradient } from "@/lib/project-images";

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
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.error("Failed to create project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
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
      toast({ title: "Success", description: "Project deleted successfully" });
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
      toast({ title: "Success", description: "Download started" });
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar: 52px, hairline bottom border, solid background */}
      <header className="h-[52px] border-b border-border bg-card px-4 sm:px-8 flex items-center justify-between shrink-0">
        <Logo size="default" />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-border/60 hover:bg-panel-hover"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
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
            <DropdownMenuContent align="end" className="w-56 rounded-[6px] border-border bg-popover shadow-md">
              <div className="flex flex-col space-y-1 p-2 border-b border-border/50">
                <p className="text-xs font-medium text-foreground leading-none truncate">
                  {getUserInfo()?.name || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground leading-none truncate">
                  {getUserInfo()?.username || ""}
                </p>
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-xs mt-1"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {/* Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[32px] font-semibold tracking-tight text-foreground">
              Projects
            </h1>
            <span className="text-sm text-muted-foreground tabular-nums font-mono">
              {safeProjects.length} {safeProjects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 px-4 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium gap-1.5 shadow-none self-start sm:self-auto">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-[6px] border border-border bg-card p-6 shadow-md">
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
                  Create new project
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground text-left">
                  Give your project a name to get started. You can change this later.
                </DialogDescription>
              </DialogHeader>
              <div className="py-3">
                <Input
                  placeholder="My project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  className="h-10 text-sm rounded-[6px] bg-background border-input focus-visible:ring-signal"
                  autoFocus
                />
              </div>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-9 rounded-[6px]">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isCreating || !newProjectName.trim()}
                  className="h-9 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {isCreating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Create project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 h-9 text-sm rounded-[6px] bg-card border-input focus-visible:ring-signal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-[6px] border border-border bg-panel p-0.5 shrink-0">
            <button onClick={() => setViewMode("grid")} className={cn("p-1.5 rounded-[4px] text-xs transition-colors", viewMode === "grid" ? "bg-card text-foreground shadow-xs font-medium" : "text-muted-foreground hover:text-foreground")} title="Grid View" aria-label="Grid View"><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("list")} className={cn("p-1.5 rounded-[4px] text-xs transition-colors", viewMode === "list" ? "bg-card text-foreground shadow-xs font-medium" : "text-muted-foreground hover:text-foreground")} title="List View" aria-label="List View"><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Content: Grid Tiles / List Table / Skeleton / Empty */}
        {loading ? (
          <div className="border border-border rounded-[6px] divide-y divide-border bg-card overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 px-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-[6px] bg-muted/60 shrink-0" />
                  <div className="h-4 bg-muted/60 rounded flex-1 max-w-xs" />
                  <div className="h-4 w-16 bg-muted/40 rounded hidden sm:block" />
                  <div className="h-4 w-24 bg-muted/40 rounded hidden md:block" />
                </div>
              ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Bordered dashed empty area */
          <div className="text-center py-16 px-4 border border-dashed border-border rounded-[6px] bg-card/40">
            <h3 className="font-display text-lg font-medium text-foreground mb-1.5">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search query to find the project you are looking for."
                : "Create your first project to start planning, coding, and deploying."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="h-9 px-4 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
              >
                Create project
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="border border-border rounded-[6px] overflow-hidden bg-card divide-y divide-border shadow-none">
            {/* Header row (>= md) */}
            <div className="hidden md:grid md:grid-cols-[1fr_120px_140px_48px] items-center px-4 py-2.5 bg-panel text-[11px] font-mono uppercase tracking-wider text-muted-foreground select-none">
              <div>Name</div>
              <div>Role</div>
              <div>Updated</div>
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
                  className="group flex md:grid md:grid-cols-[1fr_120px_140px_48px] items-center px-4 py-3 gap-3 cursor-pointer hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-inset transition-colors"
                >
                  {/* Name Column with 40px tile */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden font-display text-base font-semibold text-white shadow-xs"
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
                        <span className="drop-shadow-xs">{firstLetter}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-foreground truncate group-hover:text-signal transition-colors">
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
                          className="h-8 w-8 rounded-[6px] text-muted-foreground hover:text-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100 transition-opacity"
                          aria-label="Project actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-[6px] border-border bg-popover shadow-md">
                        <DropdownMenuItem
                          onClick={(e) => handleRenameClick(e, project)}
                          className="text-xs cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => handleDownloadProject(e, project.id)}
                          className="text-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => promptDeleteProject(e, project.id)}
                          className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5 mr-2" />
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
        <DialogContent className="max-w-md rounded-[6px] border border-border bg-card p-6 shadow-md">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
              Rename project
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
              className="h-10 text-sm rounded-[6px] bg-background border-input focus-visible:ring-signal"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              className="h-9 rounded-[6px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!renameName.trim() || renameName === projectToRename?.name}
              className="h-9 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={executeDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
