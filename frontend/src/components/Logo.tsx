import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  hideWordmark?: boolean;
  size?: "sm" | "default" | "lg";
  inverted?: boolean;
}

export function Logo({ className, hideWordmark = false, size = "default", inverted = false }: LogoProps) {
  const boxSize =
    size === "sm"
      ? "w-5 h-5 rounded-[4px]"
      : size === "lg"
      ? "w-7 h-7 rounded-[6px]"
      : "w-[22px] h-[22px] rounded-[5px]";

  const letterSize =
    size === "sm"
      ? "text-[11px]"
      : size === "lg"
      ? "text-[14px]"
      : "text-[12px]";

  const textSize =
    size === "sm"
      ? "text-[13px]"
      : size === "lg"
      ? "text-[18px]"
      : "text-[15px]";

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <div
        className={cn(
          inverted
            ? "bg-white text-zinc-950 shadow-xs ring-1 ring-white/20"
            : "bg-primary text-primary-foreground shadow-xs ring-1 ring-border/60",
          "flex items-center justify-center shrink-0 transition-transform",
          boxSize
        )}
      >
        <span
          className={cn(
            "font-mono font-bold leading-none tracking-tight",
            letterSize
          )}
        >
          C
        </span>
      </div>
      {!hideWordmark && (
        <span
          className={cn(
            "font-display font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground",
            textSize
          )}
        >
          CodeSmith
        </span>
      )}
    </div>
  );
}
