import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Delete Project Orbit",
  description = "Are you sure you want to delete this project? This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  isDestructive = true,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl border border-[#6D28D9]/40 celestial-glass p-6 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-lg font-semibold text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-end">
          <AlertDialogCancel className="h-9 px-4 rounded-lg border-border/80 text-sm font-medium hover:bg-[#6D28D9]/15">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onOpenChange(false);
            }}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium transition-all shadow-md",
              isDestructive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : "bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
