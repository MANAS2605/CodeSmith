import React from "react";
import { cn } from "@/lib/utils";

interface ConstellationGraphicProps {
  className?: string;
  variant?: "compass" | "cygnus" | "orion" | "galaxy";
}

export function ConstellationGraphic({
  className,
  variant = "compass",
}: ConstellationGraphicProps) {
  return (
    <div className={cn("relative flex items-center justify-center select-none pointer-events-none", className)}>
      {variant === "compass" && (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-indigo-500 dark:text-purple-400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orbital circles */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
            className="animate-orbit"
            style={{ transformOrigin: "center" }}
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            stroke="currentColor"
            strokeOpacity="0.25"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            stroke="currentColor"
            strokeOpacity="0.35"
          />

          {/* Coordinate axes */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeOpacity="0.15" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeOpacity="0.15" />

          {/* Constellation Polygon */}
          <polygon
            points="100,30 150,75 160,135 100,170 40,135 50,75"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.2"
          />
          <line x1="100" y1="30" x2="100" y2="170" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="50" y1="75" x2="150" y2="75" stroke="currentColor" strokeOpacity="0.2" />
          <line x1="40" y1="135" x2="160" y2="135" stroke="currentColor" strokeOpacity="0.2" />

          {/* Star Nodes */}
          {[
            { cx: 100, cy: 30, r: 3.5, glow: true },
            { cx: 150, cy: 75, r: 2.5, glow: false },
            { cx: 160, cy: 135, r: 3, glow: true },
            { cx: 100, cy: 170, r: 2.5, glow: false },
            { cx: 40, cy: 135, r: 3, glow: true },
            { cx: 50, cy: 75, r: 2.5, glow: false },
            { cx: 100, cy: 100, r: 4.5, glow: true, center: true },
          ].map((star, idx) => (
            <g key={idx}>
              {star.glow && (
                <circle
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r * 2.5}
                  fill="currentColor"
                  fillOpacity={star.center ? "0.2" : "0.15"}
                  className="animate-pulse"
                />
              )}
              <circle
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill={star.center ? "#38bdf8" : "currentColor"}
                className={star.center ? "dark:fill-[#38bdf8]" : ""}
              />
            </g>
          ))}
        </svg>
      )}

      {variant === "galaxy" && (
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-cyan-500 dark:text-cyan-400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spiral spiral paths */}
          <path
            d="M 100 100 Q 120 70, 155 80 T 180 130"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
          <path
            d="M 100 100 Q 80 130, 45 120 T 20 70"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.2"
            strokeDasharray="2 3"
          />
          <circle cx="100" cy="100" r="6" fill="currentColor" className="animate-pulse" />
          <circle cx="100" cy="100" r="16" stroke="currentColor" strokeOpacity="0.2" />
          <circle cx="155" cy="80" r="2.5" fill="currentColor" />
          <circle cx="180" cy="130" r="2" fill="currentColor" />
          <circle cx="45" cy="120" r="2.5" fill="currentColor" />
          <circle cx="20" cy="70" r="2" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
