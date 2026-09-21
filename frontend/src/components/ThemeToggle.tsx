import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const isDark = () => document.documentElement.classList.contains("dark");
  const handleToggle = () => {
    const nextDark = !isDark();
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} aria-label="Toggle color theme" title="Toggle color theme" className="h-8 w-8 rounded-full border border-border/70 bg-card hover:bg-panel-hover">
      <Sun className="h-3.5 w-3.5 dark:hidden" />
      <Moon className="hidden h-3.5 w-3.5 dark:block" />
    </Button>
  );
}
