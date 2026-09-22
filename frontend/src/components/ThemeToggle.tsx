import { useState, useEffect } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleToggle = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle celestial atmosphere"
      title={dark ? "Switch to Astral Dawn" : "Switch to Cosmic Void"}
      className="relative h-8 w-8 rounded-full border border-border/80 dark:border-purple-500/20 bg-card/80 backdrop-blur-md hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all group overflow-hidden"
    >
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Sun (Astral Dawn) */}
        <Sun className="h-4 w-4 text-amber-500 transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 group-hover:rotate-45" />
        {/* Moon with subtle sparkle (Cosmic Void) */}
        <Moon className="absolute h-4 w-4 text-cyan-400 transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:-rotate-12" />
      </div>
    </Button>
  );
}
