import { cn } from "@/lib/utils";
import { ProjectRole } from "@/lib/types";

interface RoleBadgeProps {
  role?: ProjectRole | string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (!role) return null;

  const upperRole = role.toUpperCase();

  const dotColor =
    upperRole === "OWNER"
      ? "bg-signal"
      : upperRole === "EDITOR"
      ? "bg-[#608038] dark:bg-[#7ba348]"
      : "bg-muted-foreground/60";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] border border-border/70 bg-panel/70 text-[10px] font-mono uppercase tracking-wider text-muted-foreground select-none",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      <span>{role}</span>
    </span>
  );
}
