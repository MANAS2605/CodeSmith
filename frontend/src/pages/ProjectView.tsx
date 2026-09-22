import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Code, Eye, LogOut, MoreVertical, Trash, Download, Edit, Sparkles, ChevronRight, Orbit } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatPanel, ChatMessage } from "@/components/ChatPanel";
import { CodePanel } from "@/components/CodePanel";
import { PreviewPanel } from "@/components/PreviewPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api, isAuthenticated, removeAuthToken, getUserInfo, removeUserInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RuntimeErrorAlert, RuntimeError } from "@/components/RuntimeErrorAlert";
import { cn } from "@/lib/utils";
import { ProjectResponse } from "@/lib/types";
import { ShareDialog } from "@/components/ShareDialog";
import { Logo } from "@/components/Logo";
import { RoleBadge } from "@/components/RoleBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ThemeToggle } from "@/components/ThemeToggle";

type ViewMode = "code" | "preview";

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [updatedFiles, setUpdatedFiles] = useState<Map<string, string>>(new Map());
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);
  const [project, setProject] = useState<ProjectResponse | null>(null);

  // Rename state
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameName, setRenameName] = useState("");

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Track edited files for current streaming response
  const currentEditedFilesRef = useRef<string[]>([]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Load chat history on mount
  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      setIsLoadingHistory(true);
      try {
        const [history, projectData] = await Promise.all([
          api.getChatHistory(projectId),
          api.getProject(projectId),
        ]);

        const formattedMessages: ChatMessage[] = history.map((msg) => ({
          id: msg.id.toString(),
          role: msg.role === "USER" ? "user" : "assistant",
          content: msg.content,
          createdAt: msg.createdAt,
          events: msg.events,
        }));
        setMessages(formattedMessages);
        setProject(projectData);
      } catch (error) {
        console.error("Failed to load project data:", error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadData();
  }, [projectId, toast]);

  const handleLogout = () => {
    removeAuthToken();
    removeUserInfo();
    navigate("/login");
  };

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!projectId) return;

      currentEditedFilesRef.current = [];

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        isStreaming: true,
        editedFiles: [],
      };

      setMessages((prev) => [...prev, aiMessage]);

      const cleanup = api.streamChat(
        projectId,
        content,
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk, isStreaming: true }
                : msg
            )
          );
        },
        (path, fileContent) => {
          setUpdatedFiles((prev) => new Map(prev).set(path, fileContent));

          if (!currentEditedFilesRef.current.includes(path)) {
            currentEditedFilesRef.current.push(path);
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, editedFiles: [...currentEditedFilesRef.current] }
                : msg
            )
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, isStreaming: false, editedFiles: [...currentEditedFilesRef.current] }
                : msg
            )
          );
          setIsStreaming(false);
        },
        (error) => {
          toast({
            title: "Chat error",
            description: error.message,
            variant: "destructive",
          });
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: "Sorry, a cosmic connection error occurred.", isStreaming: false }
                : msg
            )
          );
          setIsStreaming(false);
        }
      );

      return cleanup;
    },
    [projectId, toast]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type === "PreviewError") {
        const error = data.payload;
        console.log("Caught runtime error:", error);
        setRuntimeError({
          message: error.message,
          source: data.subType,
          stack: error.stack,
          filename: error.source,
          lineno: error.lineno,
          colno: error.colno,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleFixError = useCallback(
    (error: RuntimeError) => {
      const prompt = `I encountered a ${error.source || "runtime error"} in my application:
    
Error Message: ${error.message}
${error.filename ? `File: ${error.filename}` : ""}
${error.lineno ? `Line: ${error.lineno}` : ""}

Stack Trace:
${error.stack || "No stack trace available"}

Please analyze this error and fix the code to resolve it.`;

      handleSendMessage(prompt);
      setRuntimeError(null);
    },
    [handleSendMessage]
  );

  const promptDeleteProject = () => {
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteProject = async () => {
    if (!projectId) return;

    try {
      await api.deleteProject(projectId);
      navigate("/projects");
      toast({ title: "Success", description: "Project orbit deleted successfully" });
    } catch (error) {
      console.error("Failed to delete:", error);
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
    }
  };

  const handleDownloadProject = async () => {
    if (!projectId) return;
    try {
      const blob = await api.downloadProjectZip(projectId);
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

  const openRenameDialog = () => {
    if (project) {
      setRenameName(project.name);
      setIsRenameDialogOpen(true);
    }
  };

  const handleRenameSubmit = async () => {
    if (!projectId || !renameName.trim()) return;

    try {
      const updated = await api.updateProject(projectId, renameName);
      setProject((prev) => (prev ? { ...prev, name: updated.name } : null));
      setIsRenameDialogOpen(false);
      toast({ title: "Success", description: "Project renamed successfully" });
    } catch (error) {
      console.error("Failed to rename:", error);
      toast({ title: "Error", description: "Failed to rename project", variant: "destructive" });
    }
  };

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Invalid project orbit ID</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Command Bridge Header */}
      <header className="h-13 shrink-0 border-b border-border/70 dark:border-purple-500/20 celestial-glass flex items-center justify-between px-3.5 gap-2.5 z-20">
        {/* Left: Logo mark + breadcrumb + name + actions + status */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Link
            to="/projects"
            className="p-1.5 rounded-lg border border-purple-500/30 hover:border-cyan-400/60 hover:bg-purple-500/10 transition-all shrink-0 flex items-center group"
            title="Back to cosmic workspaces"
          >
            <Logo size="sm" hideWordmark />
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />

          {project ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display font-semibold text-[15px] text-foreground truncate max-w-[160px] sm:max-w-[240px] celestial-gradient-text">
                {project.name}
              </span>

              {project.role !== "VIEWER" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
                      aria-label="Project actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 rounded-xl border-border/80 bg-popover/95 backdrop-blur-md shadow-2xl">
                    <DropdownMenuItem onClick={openRenameDialog} className="text-xs cursor-pointer gap-2">
                      <Edit className="w-3.5 h-3.5 text-purple-400" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadProject} className="text-xs cursor-pointer gap-2">
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      Download Zip
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                      onClick={promptDeleteProject}
                    >
                      <Trash className="w-3.5 h-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : (
            <div className="w-32 h-4 bg-muted/70 rounded-md animate-pulse" />
          )}

          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 ml-3 pl-3 border-l border-border/70 dark:border-purple-500/20 text-xs text-muted-foreground select-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] shrink-0 inline-block animate-pulse" />
            <span className="text-[11px] font-mono tracking-wide text-cyan-600 dark:text-cyan-400">
              Cosmos Sync: Active
            </span>
          </div>
        </div>

        {/* Center: Segmented Preview | Code Toggle */}
        <div className="shrink-0">
          <div className="flex items-center rounded-xl border border-border/70 dark:border-purple-500/20 bg-card/60 backdrop-blur-md p-1 gap-1 shadow-inner">
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all select-none",
                viewMode === "preview"
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)] font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all select-none",
                viewMode === "code"
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)] font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
              )}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code</span>
            </button>
          </div>
        </div>

        {/* Right: avatar + role, project actions and logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <ThemeToggle />
          {project && (
            <div className="hidden sm:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-card/70 border border-border/70 dark:border-purple-500/20 backdrop-blur-md">
              <Avatar className="h-5 w-5 ring-1 ring-purple-500/40">
                <AvatarFallback className="text-[10px] bg-gradient-to-tr from-violet-600 to-cyan-600 text-white font-semibold">
                  {(() => {
                    const userInfo = getUserInfo();
                    if (userInfo?.name) {
                      return userInfo.name.charAt(0).toUpperCase();
                    }
                    return "U";
                  })()}
                </AvatarFallback>
              </Avatar>
              <RoleBadge role={project.role} />
            </div>
          )}

          <ShareDialog
            projectId={projectId}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium rounded-lg border-purple-500/30 hover:border-cyan-400/60 hover:bg-purple-500/10 transition-all"
                disabled={project?.role === "VIEWER"}
              >
                Share
              </Button>
            }
          />

          {project?.role !== "VIEWER" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium rounded-lg border-purple-500/30 hover:border-cyan-400/60 hover:bg-purple-500/10 hidden sm:inline-flex transition-all"
              >
                Upgrade
              </Button>
              <Button
                size="sm"
                className="h-8 px-3.5 text-xs font-medium rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all"
              >
                Publish
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Chat Panel (35%) */}
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-full border-r border-border/70 dark:border-purple-500/20 bg-panel/70">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                isLoading={isLoadingHistory}
                readOnly={project?.role === "VIEWER"}
              />
            </div>
          </ResizablePanel>

          {/* Resizable Handle: 2px line with glowing cyan starlight hover */}
          <ResizableHandle className="w-[2px] bg-border/80 dark:bg-purple-500/20 hover:bg-cyan-400 active:bg-violet-500 transition-colors duration-200 relative after:absolute after:-left-2 after:-right-2 after:top-0 after:bottom-0 after:cursor-col-resize z-10" />

          {/* Right Code/Preview Panel (65%) */}
          <ResizablePanel defaultSize={65} minSize={50} maxSize={75}>
            <div className="h-full relative">
              <div className={cn("h-full absolute inset-0", viewMode !== "code" && "hidden")}>
                <CodePanel projectId={projectId} updatedFiles={updatedFiles} />
              </div>
              <div className={cn("h-full absolute inset-0", viewMode !== "preview" && "hidden")}>
                <PreviewPanel
                  projectId={projectId}
                  runtimeError={runtimeError}
                  onDismiss={() => setRuntimeError(null)}
                  onFix={handleFixError}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="max-w-md rounded-xl border border-border/80 dark:border-purple-500/20 celestial-glass p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-semibold text-foreground text-left">
              Rename Project Orbit
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
              className="h-10 text-sm rounded-lg bg-background/80 border-border/80 focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-purple-500/30"
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
              disabled={!renameName.trim() || renameName === project?.name}
              className="h-9 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.35)]"
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
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete Orbit"
      />
    </div>
  );
}
