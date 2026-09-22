import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { CelestialBackground } from "@/components/celestial/CelestialBackground";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Short grace delay to show celestial portal before transition
    const timer = setTimeout(() => {
      if (isAuthenticated()) {
        navigate("/projects");
      } else {
        navigate("/login");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <CelestialBackground className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 z-10">
        {/* Orbital Starlight Core */}
        <div className="relative flex items-center justify-center">
          {/* Concentric Rotating Celestial Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-purple-500/35 animate-orbit" />
          <div className="absolute w-20 h-20 rounded-full border border-dashed border-cyan-400/40 animate-orbit-reverse" />
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/25 to-cyan-400/25 blur-xl animate-pulse-glow" />

          {/* Logo */}
          <Logo size="lg" />
        </div>

        {/* Celestial Loading Status */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-48 h-1 bg-[#080c1e] rounded-full overflow-hidden relative border border-purple-500/30">
            <div className="absolute inset-y-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 w-1/2 rounded-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-muted-foreground/80">
            Initializing Celestial Environment...
          </span>
        </div>
      </div>
    </CelestialBackground>
  );
};

export default Index;
