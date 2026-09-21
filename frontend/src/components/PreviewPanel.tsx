import { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, PREVIEW_URL_KEY } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RuntimeErrorAlert, RuntimeError } from "@/components/RuntimeErrorAlert";

interface PreviewPanelProps {
  projectId: string;
  runtimeError: RuntimeError | null;
  onDismiss: () => void;
  onFix: (error: RuntimeError) => void;
}

export function PreviewPanel({
  projectId,
  runtimeError,
  onDismiss,
  onFix,
}: PreviewPanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => {
    return localStorage.getItem(PREVIEW_URL_KEY);
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (previewUrl) {
      localStorage.setItem(PREVIEW_URL_KEY, previewUrl);
    }
  }, [previewUrl]);

  const handleDeploy = async () => {
    setIsDeploying(true);

    try {
      const response = await api.deploy(projectId);
      setPreviewUrl(response.previewUrl);
      toast({
        title: "Deployment successful",
        description: "Your preview is now ready",
      });
    } catch (error) {
      toast({
        title: "Deployment failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRefresh = () => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      const current = iframe.src;
      iframe.src = "";
      iframe.src = current;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden">
      {/* 48px Toolbar */}
      <div className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-border bg-panel">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={!previewUrl}
          className="h-8 w-8 rounded-[6px] text-muted-foreground hover:text-foreground disabled:opacity-40"
          aria-label="Refresh preview"
          title="Refresh"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </Button>

        {/* URL Bar: 32px, mono 12px, muted bg, 6px radius, truncate */}
        <div className="flex-1 flex items-center h-8 px-3 rounded-[6px] bg-muted/60 border border-border/50 text-xs font-mono text-muted-foreground select-all overflow-hidden">
          <span className="truncate">
            {previewUrl || "No preview deployed"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {previewUrl && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(previewUrl, "_blank")}
              className="h-8 w-8 rounded-[6px] text-muted-foreground hover:text-foreground"
              aria-label="Open in new tab"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            size="sm"
            className="h-8 px-3 rounded-[6px] bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium gap-1.5 shadow-none"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deploying</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Run Preview</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas Area: subtle dot grid (radial-gradient 4-6% opacity) */}
      <div className="flex-1 relative bg-card bg-[radial-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:16px_16px]">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0 bg-background"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none">
            <h3 className="font-display text-lg font-medium text-foreground mb-1.5">
              No preview yet
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Run Preview to deploy the latest saved version.
            </p>
          </div>
        )}
      </div>

      {/* Error Alert Overlay */}
      <RuntimeErrorAlert
        error={runtimeError}
        onDismiss={onDismiss}
        onFix={onFix}
      />
    </div>
  );
}
