import React, { useId, useMemo } from "react";
import { Constellation } from "@/lib/constellations";
import { cn } from "@/lib/utils";

interface ProjectConstellationProps {
  constellation: Constellation;
  size?: "default" | "icon";
  className?: string;
  showBadge?: boolean;
}

/**
 * Deterministic pseudo-random star generator for background starfield.
 * Produces identical stars on every render for a given constellation.
 */
function generateBackgroundStars(seedStr: string, count: number) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  const rnd = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };

  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Number((rnd() * 92 + 4).toFixed(1)),
      y: Number((rnd() * 90 + 5).toFixed(1)),
      r: Number((rnd() * 0.8 + 0.5).toFixed(1)),
      opacity: Number((rnd() * 0.45 + 0.2).toFixed(2)),
      twinkle: rnd() > 0.6,
      twinkleDelay: Number((rnd() * 4).toFixed(1)),
    });
  }
  return stars;
}

export const ProjectConstellation: React.FC<ProjectConstellationProps> = ({
  constellation,
  size = "default",
  className,
  showBadge = size === "default",
}) => {
  const uniqueId = useId().replace(/:/g, "_");
  const isIcon = size === "icon";

  const bgStars = useMemo(
    () => generateBackgroundStars(constellation.id, isIcon ? 10 : 28),
    [constellation.id, isIcon]
  );

  const nebulaGradId = `nebula-${uniqueId}`;
  const spaceGradId = `space-${uniqueId}`;
  const glowFilterId = `glow-${uniqueId}`;

  // Scale factors for star sizes and line thickness in icon view
  const starScale = isIcon ? 0.65 : 1;
  const lineStrokeWidth = isIcon ? 1.0 : 1.2;

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden select-none",
        "bg-[#02040a]", // Deep interstellar black universe background
        className
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Deep Black Universe Gradient */}
          <linearGradient id={spaceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#010309" />
            <stop offset="50%" stopColor="#020510" />
            <stop offset="100%" stopColor="#040816" />
          </linearGradient>

          {/* Diffuse Nebula Cloud Core */}
          <radialGradient
            id={nebulaGradId}
            cx={constellation.deepSky ? `${constellation.deepSky.x}%` : "50%"}
            cy={constellation.deepSky ? `${constellation.deepSky.y}%` : "50%"}
            r="60%"
          >
            <stop
              offset="0%"
              stopColor={constellation.spectralColor}
              stopOpacity={isIcon ? "0.32" : "0.22"}
            />
            <stop
              offset="45%"
              stopColor={constellation.nebulaColor.replace(/[\d.]+\)$/, "0.12)")}
              stopOpacity="0.12"
            />
            <stop offset="85%" stopColor="#02040a" stopOpacity="0" />
          </radialGradient>

          {/* Star Glow Filter */}
          <filter id={glowFilterId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={isIcon ? "0.6" : "1.2"} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Deep Space Base Canvas */}
        <rect width="100" height="100" fill={`url(#${spaceGradId})`} />

        {/* 2. Soft Nebula Radial Cloud */}
        <rect width="100" height="100" fill={`url(#${nebulaGradId})`} />

        {/* 3. Celestial Astrolabe / Coordinate Rings (Decorative) */}
        {!isIcon && (
          <g opacity="0.12" className="pointer-events-none">
            {/* Concentric Polar Coordinate Rings */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeDasharray="1.5 2.5"
              strokeWidth="0.3"
              className="text-white/40"
            />
            <circle
              cx="50"
              cy="50"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeDasharray="2 3"
              strokeWidth="0.25"
              className="text-white/30"
            />
            {/* Declination Axes */}
            <line
              x1="50"
              y1="4"
              x2="50"
              y2="96"
              stroke="currentColor"
              strokeDasharray="2 3"
              strokeWidth="0.25"
              className="text-white/20"
            />
            <line
              x1="6"
              y1="50"
              x2="94"
              y2="50"
              stroke="currentColor"
              strokeDasharray="2 3"
              strokeWidth="0.25"
              className="text-white/20"
            />
          </g>
        )}

        {/* 4. Micro Starfield Background */}
        <g className="pointer-events-none">
          {bgStars.map((s, idx) => (
            <circle
              key={idx}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#ffffff"
              opacity={s.opacity}
              className={s.twinkle ? "animate-pulse" : undefined}
              style={
                s.twinkle
                  ? { animationDuration: `${2 + (idx % 3)}s`, animationDelay: `${s.twinkleDelay}s` }
                  : undefined
              }
            />
          ))}
        </g>

        {/* 5. Deep Sky Feature (Galaxy / Cluster / Nebula glyph) */}
        {constellation.deepSky && !isIcon && (
          <g opacity="0.45" className="pointer-events-none">
            {constellation.deepSky.type === "galaxy" && (
              <g
                transform={`translate(${constellation.deepSky.x}, ${constellation.deepSky.y}) rotate(-35)`}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="9"
                  ry="3.5"
                  fill="none"
                  stroke={constellation.spectralColor}
                  strokeWidth="0.4"
                  strokeDasharray="2 1.5"
                />
                <circle cx="0" cy="0" r="1.5" fill={constellation.spectralColor} opacity="0.8" />
              </g>
            )}
            {constellation.deepSky.type === "nebula" && (
              <circle
                cx={constellation.deepSky.x}
                cy={constellation.deepSky.y}
                r="6"
                fill={constellation.spectralColor}
                opacity="0.25"
                filter={`url(#${glowFilterId})`}
              />
            )}
            {constellation.deepSky.type === "cluster" && (
              <g transform={`translate(${constellation.deepSky.x}, ${constellation.deepSky.y})`}>
                <circle cx="-2" cy="-1.5" r="0.6" fill="#ffffff" opacity="0.7" />
                <circle cx="1.5" cy="-2" r="0.7" fill="#ffffff" opacity="0.8" />
                <circle cx="-1" cy="2" r="0.6" fill="#ffffff" opacity="0.7" />
                <circle cx="2" cy="1.5" r="0.8" fill="#ffffff" opacity="0.9" />
                <circle cx="0" cy="0" r="0.9" fill={constellation.spectralColor} opacity="0.95" />
              </g>
            )}
          </g>
        )}

        {/* 6. Constellation Connecting Lines */}
        <g
          className="transition-opacity duration-500 group-hover:opacity-100"
          opacity={isIcon ? 0.75 : 0.6}
        >
          {constellation.lines.map(([fromIdx, toIdx], lineIdx) => {
            const starA = constellation.stars[fromIdx];
            const starB = constellation.stars[toIdx];
            if (!starA || !starB) return null;

            return (
              <g key={`line-${lineIdx}`}>
                {/* Outer Glow Halo */}
                {!isIcon && (
                  <line
                    x1={starA.x}
                    y1={starA.y}
                    x2={starB.x}
                    y2={starB.y}
                    stroke={constellation.spectralColor}
                    strokeWidth={lineStrokeWidth * 2.2}
                    strokeOpacity="0.22"
                    strokeLinecap="round"
                  />
                )}
                {/* Core Line */}
                <line
                  x1={starA.x}
                  y1={starA.y}
                  x2={starB.x}
                  y2={starB.y}
                  stroke="#ffffff"
                  strokeOpacity={isIcon ? "0.65" : "0.5"}
                  strokeWidth={lineStrokeWidth * 0.6}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* 7. Constellation Stars */}
        <g className="transition-transform duration-500">
          {constellation.stars.map((star) => {
            const isSupergiant = star.magnitude === "supergiant";
            const isAlpha = star.magnitude === "alpha";
            const hasRays = star.hasRays || isSupergiant;
            const starColor = star.color || constellation.spectralColor || "#ffffff";
            const r = Math.max(isIcon ? 1.4 : 1.8, (star.size * starScale) / 2);

            return (
              <g key={star.id} className="transition-all duration-300">
                {/* Corona Glow for Supergiant & Alpha */}
                {(isSupergiant || isAlpha) && !isIcon && (
                  <>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={r * 2.8}
                      fill={starColor}
                      opacity="0.25"
                      className="animate-pulse"
                      style={{ animationDuration: "3s" }}
                    />
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={r * 1.7}
                      fill={starColor}
                      opacity="0.45"
                    />
                  </>
                )}

                {/* Diffraction Spike Flares for Alpha & Supergiant stars */}
                {hasRays && !isIcon && (
                  <g
                    opacity="0.75"
                    className="group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {/* Vertical Spike */}
                    <line
                      x1={star.x}
                      y1={star.y - (r * 3.2)}
                      x2={star.x}
                      y2={star.y + (r * 3.2)}
                      stroke={starColor}
                      strokeWidth="0.45"
                      strokeLinecap="round"
                    />
                    {/* Horizontal Spike */}
                    <line
                      x1={star.x - (r * 3.2)}
                      y1={star.y}
                      x2={star.x + (r * 3.2)}
                      y2={star.y}
                      stroke={starColor}
                      strokeWidth="0.45"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Star Core Ring */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={r}
                  fill={starColor}
                  filter={isSupergiant || isAlpha ? `url(#${glowFilterId})` : undefined}
                />

                {/* Bright White Center Pinpoint */}
                {(isSupergiant || isAlpha || star.magnitude === "major") && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={Math.max(0.6, r * 0.45)}
                    fill="#ffffff"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 8. Vignette Edge Shading for Deep Interstellar Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#02040a]/80 via-transparent to-[#02040a]/40" />

      {/* 9. Constellation Badge Tag (Default size only) */}
      {showBadge && (
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/60 border border-white/10 shadow-lg pointer-events-none transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/75">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
            style={{ backgroundColor: constellation.spectralColor }}
          />
          <span className="font-mono text-[10.5px] tracking-wider uppercase font-semibold text-white/90">
            {constellation.name}
          </span>
          <span className="text-[9px] text-white/30">·</span>
          <span className="text-[9.5px] text-white/60 font-mono hidden xs:inline truncate max-w-[110px]">
            {constellation.latinName}
          </span>
        </div>
      )}

      {/* 10. Alpha Star Coordinate Tag (Default size, bottom right) */}
      {showBadge && (
        <div className="absolute bottom-2.5 right-2.5 z-10 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md backdrop-blur-sm bg-black/50 border border-white/5 text-[9px] font-mono text-white/50 pointer-events-none transition-opacity duration-300 group-hover:text-white/80 group-hover:border-white/10">
          <span className="text-white/30">★</span>
          <span>{constellation.alphaStar.split(" ")[0]}</span>
        </div>
      )}
    </div>
  );
};
