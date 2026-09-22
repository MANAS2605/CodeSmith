import { cn } from "@/lib/utils";
import { ProjectRole } from "@/lib/types";
import { Sparkles, Shield, Eye } from "lucide-react";

interface RoleBadgeProps {
  role?: ProjectRole | string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (!role) return null;

  const upperRole = role.toUpperCase();

  const roleConfig = {
    OWNER: {
      colorClass:
        "text-amber-600 dark:text-amber-300 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      dotClass: "bg-amber-400 shadow-[0_0_6px_#fbbf24]",
      icon: Sparkles,
    },
    EDITOR: {
      colorClass:
        "text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
      dotClass: "bg-emerald-400 shadow-[0_0_6px_#34d399]",
      icon: Shield,
    },
    VIEWER: {
      colorClass:
        "text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]",
      dotClass: "bg-cyan-400 shadow-[0_0_6px_#38bdf8]",
      icon: Eye,
    },
  }[upperRole] || {
    colorClass:
      "text-muted-foreground bg-muted/60 border-border/70",
    dotClass: "bg-muted-foreground",
    icon: Sparkles,
  };

  const Icon = roleConfig.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium uppercase tracking-wider select-none backdrop-blur-md transition-all",
        roleConfig.colorClass,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", roleConfig.dotClass)} />
      <Icon className="w-2.5 h-2.5 shrink-0 opacity-75" />
      <span>{role}</span>
    </span>
  );
}
