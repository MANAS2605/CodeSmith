import React from "react";
import { cn } from "@/lib/utils";

interface CelestialOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showOrbits?: boolean;
  glowColor?: "purple" | "cyan" | "gold" | "rose";
}

export function CelestialOrb({
  className,
  size = "md",
  showOrbits = true,
  glowColor = "purple",
}: CelestialOrbProps) {
  const sizeMap = {
    sm: {
      container: "w-24 h-24",
      core: "w-12 h-12",
      ring1: "w-20 h-20",
      ring2: "w-24 h-24",
      node: "w-2 h-2",
    },
    md: {
      container: "w-48 h-48",
      core: "w-24 h-24",
      ring1: "w-40 h-40",
      ring2: "w-48 h-48",
      node: "w-2.5 h-2.5",
    },
    lg: {
      container: "w-64 h-64",
      core: "w-32 h-32",
      ring1: "w-52 h-52",
      ring2: "w-64 h-64",
      node: "w-3 h-3",
    },
    xl: {
      container: "w-80 h-80",
      core: "w-40 h-40",
      ring1: "w-64 h-64",
      ring2: "w-80 h-80",
      node: "w-3.5 h-3.5",
    },
  };

  const currentSize = sizeMap[size];

  const glowStyles = {
    purple: {
      core: "from-violet-600 via-indigo-600 to-cyan-500",
      halo: "bg-purple-600/30 dark:bg-purple-500/25",
      ring: "border-purple-400/30 dark:border-purple-400/20",
      node: "bg-cyan-400 shadow-[0_0_10px_#22d3ee]",
    },
    cyan: {
      core: "from-cyan-500 via-blue-600 to-indigo-700",
      halo: "bg-cyan-500/30 dark:bg-cyan-400/25",
      ring: "border-cyan-400/30 dark:border-cyan-400/20",
      node: "bg-purple-400 shadow-[0_0_10px_#c084fc]",
    },
    gold: {
      core: "from-amber-400 via-orange-500 to-rose-600",
      halo: "bg-amber-500/30 dark:bg-amber-400/25",
      ring: "border-amber-400/30 dark:border-amber-400/20",
      node: "bg-amber-300 shadow-[0_0_10px_#fde047]",
    },
    rose: {
      core: "from-rose-500 via-pink-600 to-violet-700",
      halo: "bg-rose-500/30 dark:bg-rose-400/25",
      ring: "border-rose-400/30 dark:border-rose-400/20",
      node: "bg-indigo-400 shadow-[0_0_10px_#818cf8]",
    },
  }[glowColor];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none pointer-events-none",
        currentSize.container,
        className
      )}
    >
      {/* Outer Atmospheric Aura */}
      <div
        className={cn(
          "absolute rounded-full blur-2xl animate-pulse-glow",
          currentSize.ring1,
          glowStyles.halo
        )}
      />

      {/* Orbital Ring 1: Inclined forward */}
      {showOrbits && (
        <div
          className={cn(
            "absolute rounded-full border border-dashed animate-orbit",
            currentSize.ring1,
            glowStyles.ring
          )}
          style={{
            transform: "rotateX(68deg) rotateY(15deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Orbiting Satellite Node 1 */}
          <div
            className={cn(
              "absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full",
              currentSize.node,
              glowStyles.node
            )}
          />
        </div>
      )}

      {/* Orbital Ring 2: Inclined reverse */}
      {showOrbits && (
        <div
          className={cn(
            "absolute rounded-full border border-dashed animate-orbit-reverse",
            currentSize.ring2,
            glowStyles.ring
          )}
          style={{
            transform: "rotateX(72deg) rotateY(-25deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Orbiting Satellite Node 2 */}
          <div
            className={cn(
              "absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_#ffffff]",
              currentSize.node
            )}
          />
        </div>
      )}

      {/* Core Planet / Star Sphere */}
      <div
        className={cn(
          "relative rounded-full shadow-2xl bg-gradient-to-tr overflow-hidden transition-transform duration-700",
          currentSize.core,
          glowStyles.core
        )}
      >
        {/* Internal 3D Sphere Shading */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/60" />
        
        {/* Celestial Rim Glow Highlight */}
        <div className="absolute inset-0 rounded-full border border-white/40 opacity-70" />
        
        {/* Subtle internal swirling nebula texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
      </div>

      {/* Cross diffraction flare */}
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
      <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent opacity-60" />
    </div>
  );
}
