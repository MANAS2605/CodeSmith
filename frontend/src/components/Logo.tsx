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
            ? "bg-gradient-to-tr from-[#6D28D9] via-[#EC4899] to-[#06B6D4] text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] ring-1 ring-white/30"
            : "bg-gradient-to-tr from-[#0B071E] via-[#2D1B4E] to-[#6D28D9] text-[#06B6D4] dark:from-[#0B071E] dark:via-[#2D1B4E] dark:to-[#6D28D9] dark:text-[#06B6D4] shadow-[0_0_16px_rgba(109,40,217,0.45)] ring-1 ring-[#6D28D9]/40 dark:ring-[#06B6D4]/30",
          boxSize
        )}
      >
        {/* Subtle rotating orbital ring on hover */}
        <div className="absolute inset-[-3px] rounded-full border border-dashed border-[#06B6D4]/40 opacity-0 group-hover:opacity-100 animate-orbit transition-opacity" />

        {/* 4-point Celestial Star SVG */}
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
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "font-display font-semibold tracking-tight transition-colors",
              inverted
                ? "text-white"
                : "text-foreground group-hover:text-[#EC4899] dark:group-hover:text-[#06B6D4]",
              textSize
            )}
          >
            Code<span className="bg-gradient-to-r from-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent">Smith</span>
          </span>
          {size === "lg" && (
            <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-[#6D28D9]/15 text-[#EC4899] dark:text-[#06B6D4] border border-[#6D28D9]/30">
              Cosmos
            </span>
          )}
        </div>
      )}
    </div>
  );
}
