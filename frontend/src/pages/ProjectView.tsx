import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Code, Eye, LogOut, MoreVertical, Trash, Download, Edit } from "lucide-react";
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
                ? { ...msg, content: "Sorry, an error occurred.", isStreaming: false }
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
      toast({ title: "Success", description: "Project deleted successfully" });
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
      toast({ title: "Success", description: "Download started" });
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
        <p className="text-muted-foreground text-sm">Invalid project ID</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* 48px Header */}
      <header className="h-12 shrink-0 border-b border-border bg-panel flex items-center justify-between px-3 gap-2">
        {/* Left: Logo mark + breadcrumb + name + actions + status */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            to="/projects"
            className="hover:opacity-85 transition-opacity shrink-0 flex items-center"
            title="Back to projects"
          >
            <Logo size="sm" hideWordmark />
          </Link>

          <span className="text-border text-sm select-none font-light">/</span>

          {project ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-medium text-[15px] text-foreground truncate max-w-[160px] sm:max-w-[220px]">
                {project.name}
              </span>

              {project.role !== "VIEWER" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-[4px] text-muted-foreground hover:text-foreground"
                      aria-label="Project actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40 rounded-[6px] border-border bg-popover shadow-md">
                    <DropdownMenuItem onClick={openRenameDialog} className="text-xs cursor-pointer">
                      <Edit className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadProject} className="text-xs cursor-pointer">
                      <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                      onClick={promptDeleteProject}
                    >
                      <Trash className="w-3.5 h-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : (
            <div className="w-28 h-4 bg-muted/70 rounded-[4px] animate-pulse" />
          )}

          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 ml-3 pl-3 border-l border-border text-xs text-muted-foreground select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0 inline-block animate-pulse" />
            <span className="text-[11px]">Previewing last saved version</span>
          </div>
        </div>

        {/* Center: Segmented Preview | Code Toggle (Auralis Pill Scaffolding) */}
        <div className="shrink-0">
          <div className="flex items-center rounded-[6px] border border-border bg-panel p-0.5">
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[4px] transition-colors select-none border-b-2",
                viewMode === "preview"
                  ? "bg-card text-foreground border-signal font-semibold"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[4px] transition-colors select-none border-b-2",
                viewMode === "code"
                  ? "bg-card text-foreground border-signal font-semibold"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              <Code className="w-3.5 h-3.5" />
              Code
            </button>
          </div>
        </div>

        {/* Right: avatar + role, project actions and logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          {project && (
            <div className="hidden sm:flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-[5px] bg-panel-hover/60 border border-border/60">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px] bg-muted text-foreground font-semibold">
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
                className="h-8 px-2.5 text-xs font-medium rounded-[6px] border-border hover:bg-panel-hover"
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
                className="h-8 px-2.5 text-xs font-medium rounded-[6px] border-border hover:bg-panel-hover hidden sm:inline-flex"
              >
                Upgrade
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-xs font-medium rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Publish
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 rounded-[6px] text-muted-foreground hover:text-foreground"
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
            <div className="h-full border-r border-border bg-panel">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                isLoading={isLoadingHistory}
                readOnly={project?.role === "VIEWER"}
              />
            </div>
          </ResizablePanel>

          {/* Resizable Handle: 1px line, signal hover, hit area */}
          <ResizableHandle className="w-[1px] bg-border hover:bg-signal active:bg-signal transition-colors duration-150 relative after:absolute after:-left-2 after:-right-2 after:top-0 after:bottom-0 after:cursor-col-resize z-10" />

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
              disabled={!renameName.trim() || renameName === project?.name}
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
