import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CelestialBackgroundProps {
  className?: string;
  contentClassName?: string;
  showNebula?: boolean;
  interactive?: boolean;
  density?: "low" | "medium" | "high";
  children?: React.ReactNode;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  isPulsar: boolean;
  colorDark: string;
  colorLight: string;
  vx: number;
  vy: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  decay: number;
}

export function CelestialBackground({
  className = "",
  contentClassName = "",
  showNebula = true,
  interactive = true,
  density = "medium",
  children,
}: CelestialBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const starCount =
      density === "low"
        ? Math.floor((width * height) / 18000)
        : density === "high"
        ? Math.floor((width * height) / 7000)
        : Math.floor((width * height) / 10000);

    const starColorsDark = ["#ffffff", "#06B6D4", "#EC4899", "#C084FC", "#67E8F9", "#F472B6"];
    const starColorsLight = ["#6D28D9", "#EC4899", "#06B6D4", "#8B5CF6", "#D946EF"];

    // Initialize stars with both dark and light palette values
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const isPulsar = Math.random() < 0.08;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPulsar ? Math.random() * 2.2 + 1.2 : Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        isPulsar,
        colorDark: starColorsDark[Math.floor(Math.random() * starColorsDark.length)],
        colorLight: starColorsLight[Math.floor(Math.random() * starColorsLight.length)],
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    const meteors: Meteor[] = [];
    let lastMeteorTime = Date.now();

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 1.2,
        y: -50,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 7 + 8,
        angle: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
        opacity: 1,
        decay: Math.random() * 0.015 + 0.01,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    const parent = canvas.parentElement;
    if (parent && interactive) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Always read live theme mode
      const dark = document.documentElement.classList.contains("dark");
      const currentMouse = mouseRef.current;

      // Occasional meteor
      const now = Date.now();
      if (!isReducedMotion && now - lastMeteorTime > Math.random() * 6000 + 4000) {
        spawnMeteor();
        lastMeteorTime = now;
      }

      // Draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        ctx.save();
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(
          1,
          dark
            ? `rgba(236, 72, 153, ${m.opacity})`
            : `rgba(109, 40, 217, ${m.opacity * 0.7})`
        );
        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= m.decay;

        if (m.opacity <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
        }
      }

      // Draw stars and subtle constellation lines
      const maxConnectDist = 80;
      const mouseInfluenceDist = 130;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!isReducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }

        // Twinkle factor
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
        let alpha = s.baseAlpha + twinkle * 0.35;
        alpha = Math.max(0.1, Math.min(1, alpha));

        // Mouse proximity boost
        const dx = currentMouse.x - s.x;
        const dy = currentMouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseInfluenceDist) {
          alpha = Math.min(1, alpha + (1 - dist / mouseInfluenceDist) * 0.5);
        }

        const color = dark ? s.colorDark : s.colorLight;

        // Draw star
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = dark ? alpha : alpha * 0.45;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Pulsar cross diffraction spikes (celestial JWST/Hubble look)
        if (s.isPulsar && alpha > 0.6) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.7;
          ctx.globalAlpha = dark ? alpha * 0.5 : alpha * 0.25;

          const spikeLength = s.size * 3.5;
          ctx.beginPath();
          ctx.moveTo(s.x - spikeLength, s.y);
          ctx.lineTo(s.x + spikeLength, s.y);
          ctx.moveTo(s.x, s.y - spikeLength);
          ctx.lineTo(s.x + spikeLength, s.y);
          ctx.stroke();
        }

        ctx.restore();

        // Connect nearby stars with faint constellation lines
        if (interactive && dist < mouseInfluenceDist) {
          for (let j = i + 1; j < stars.length; j++) {
            const s2 = stars[j];
            const dStarsX = s.x - s2.x;
            const dStarsY = s.y - s2.y;
            const dStars = Math.sqrt(dStarsX * dStarsX + dStarsY * dStarsY);

            if (dStars < maxConnectDist) {
              const lineAlpha = (1 - dStars / maxConnectDist) * (1 - dist / mouseInfluenceDist) * 0.3;
              ctx.save();
              ctx.strokeStyle = dark
                ? `rgba(6, 182, 212, ${lineAlpha})`
                : `rgba(109, 40, 217, ${lineAlpha * 0.5})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(s2.x, s2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (parent && interactive) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [density, interactive]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background canvas for stars & meteors */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Radiant Nebula Glow Pools */}
      {showNebula && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
          {/* Top-right Meteor Violet & Nebula Purple */}
          <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-purple-200/50 via-pink-100/30 to-transparent dark:from-[#6D28D9]/30 dark:via-[#2D1B4E]/30 blur-3xl animate-pulse-glow" />
          {/* Bottom-left Stellar Cyan */}
          <div className="absolute -bottom-36 -left-36 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-cyan-200/40 via-blue-100/30 to-transparent dark:from-[#06B6D4]/25 dark:via-[#6D28D9]/20 blur-3xl" />
          {/* Center ambient astral drift with Supernova Pink & Nebula Purple */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[650px] rounded-full bg-gradient-to-r from-pink-100/30 via-purple-100/30 to-cyan-100/30 dark:from-[#EC4899]/20 dark:via-[#2D1B4E]/40 dark:to-[#06B6D4]/20 blur-[110px]" />
        </div>
      )}

      {/* Content wrapper */}
      <div className={cn("relative z-10 h-full w-full", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
