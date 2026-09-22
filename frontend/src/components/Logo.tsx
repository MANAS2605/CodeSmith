import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  hideWordmark?: boolean;
  size?: "sm" | "default" | "lg";
  inverted?: boolean;
}

export function Logo({
  className,
  hideWordmark = false,
  size = "default",
  inverted = false,
}: LogoProps) {
  const boxSize =
    size === "sm"
      ? "w-6 h-6 rounded-md"
      : size === "lg"
      ? "w-9 h-9 rounded-xl"
      : "w-7 h-7 rounded-lg";

  const starIconSize =
    size === "sm"
      ? "w-3.5 h-3.5"
      : size === "lg"
      ? "w-5 h-5"
      : "w-4 h-4";

  const textSize =
    size === "sm"
      ? "text-[13px]"
      : size === "lg"
      ? "text-[20px]"
      : "text-[16px]";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Celestial Icon Frame with Orbital Glow */}
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105",
          inverted
            ? "bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] ring-1 ring-white/30"
            : "bg-gradient-to-tr from-purple-900/80 via-indigo-900/60 to-slate-900/90 text-cyan-400 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950 dark:text-cyan-300 shadow-[0_0_16px_rgba(139,92,246,0.35)] ring-1 ring-purple-500/30 dark:ring-purple-400/20",
          boxSize
        )}
      >
        {/* Subtle rotating orbital ring on hover */}
        <div className="absolute inset-[-3px] rounded-full border border-dashed border-cyan-400/30 opacity-0 group-hover:opacity-100 animate-orbit transition-opacity" />

        {/* 4-point Celestial Gemini Star SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("transition-transform duration-500 group-hover:rotate-45", starIconSize)}
        >
          {/* Central Pulsar Star */}
          <path
            d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z"
            fill="currentColor"
          />
          {/* Central Starlight Core */}
          <circle cx="12" cy="12" r="2" fill="#ffffff" />
        </svg>
      </div>

      {!hideWordmark && (
        <div className="flex items-center gap-1 leading-none">
          <span
            className={cn(
              "font-display font-semibold tracking-tight transition-colors flex items-center leading-none",
              inverted
                ? "text-white"
                : "text-foreground group-hover:text-purple-600 dark:group-hover:text-cyan-300",
              textSize
            )}
          >
            Code<span className="bg-gradient-to-r from-violet-600 to-cyan-600 dark:from-white dark:via-purple-200 dark:to-cyan-300 bg-clip-text text-transparent">Smith</span>
          </span>
          {size === "lg" && (
            <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-cyan-300 border border-purple-500/20">
              Cosmos
            </span>
          )}
        </div>
      )}
    </div>
  );
}
