import { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink, RotateCw, Sparkles, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, PREVIEW_URL_KEY } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { RuntimeErrorAlert, RuntimeError } from "@/components/RuntimeErrorAlert";
import { ConstellationGraphic } from "./celestial/ConstellationGraphic";

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
        title: "Deployment Successful",
        description: "Your celestial application is live on orbit",
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Something went wrong during launch",
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
      {/* 48px Celestial Toolbar */}
      <div className="h-12 shrink-0 flex items-center gap-2 px-3 border-b border-border/70 dark:border-[#6D28D9]/30 bg-card/40 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={!previewUrl}
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#6D28D9]/15 disabled:opacity-30"
          aria-label="Refresh preview"
          title="Refresh"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </Button>

        {/* URL Bar: Starlight Glass Pill */}
        <div className="flex-1 flex items-center h-8 px-3 rounded-lg bg-card/70 border border-[#6D28D9]/30 text-xs font-mono text-muted-foreground select-all overflow-hidden backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shadow-[0_0_6px_#06B6D4] mr-2 shrink-0 animate-pulse" />
          <span className="truncate">
            {previewUrl || "https://preview.cosmos.codesmith.ai"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {previewUrl && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(previewUrl, "_blank")}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#6D28D9]/15"
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
            className="h-8 px-3.5 rounded-lg bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white text-xs font-medium gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.35)] transition-all"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Launching...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#06B6D4] fill-current" />
                <span>Run Preview</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Canvas Area: Celestial Star Grid */}
      <div className="flex-1 relative bg-card/30 bg-[radial-gradient(rgba(109,40,217,0.15)_1px,transparent_1px)] [background-size:20px_20px] overflow-hidden">
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0 bg-background"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none relative">
            {/* Ambient Celestial Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#6D28D9]/15 via-[#06B6D4]/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative mb-4">
              <ConstellationGraphic variant="galaxy" className="w-28 h-28 opacity-80" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1.5 celestial-gradient-text">
              Cosmic Viewport Idle
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
              Click <strong className="text-[#06B6D4] font-medium">Run Preview</strong> to compile and launch your application into live orbital execution.
            </p>
            <Button
              onClick={handleDeploy}
              disabled={isDeploying}
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-lg border-[#6D28D9]/40 hover:border-[#06B6D4]/60 text-xs gap-1.5 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Deploy Build Now</span>
            </Button>
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
