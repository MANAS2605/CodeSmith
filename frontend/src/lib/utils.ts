import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProjectTone {
  bg: string;
  fg: string;
  border: string;
}

// Curated 8 muted earthy tones (terracotta, olive, ochre, slate, plum-brown, moss, clay, ink)
export const PROJECT_TONES: ProjectTone[] = [
  // Terracotta
  { bg: "hsl(14 55% 46%)", fg: "#faf8f5", border: "hsl(14 45% 38%)" },
  // Olive
  { bg: "hsl(84 34% 38%)", fg: "#faf8f5", border: "hsl(84 28% 30%)" },
  // Ochre
  { bg: "hsl(38 65% 38%)", fg: "#faf8f5", border: "hsl(38 55% 30%)" },
  // Slate
  { bg: "hsl(215 25% 42%)", fg: "#faf8f5", border: "hsl(215 20% 34%)" },
  // Plum-brown
  { bg: "hsl(340 24% 38%)", fg: "#faf8f5", border: "hsl(340 20% 30%)" },
  // Moss
  { bg: "hsl(150 25% 35%)", fg: "#faf8f5", border: "hsl(150 20% 28%)" },
  // Clay
  { bg: "hsl(25 45% 40%)", fg: "#faf8f5", border: "hsl(25 35% 32%)" },
  // Ink
  { bg: "hsl(30 15% 24%)", fg: "#faf8f5", border: "hsl(30 12% 18%)" },
];

export function projectTone(name: string): ProjectTone {
  let hash = 0;
  const str = name || "Project";
  for (let i = 0; i < str.length; i++) {
    hash = (str.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  const index = Math.abs(hash) % PROJECT_TONES.length;
  return PROJECT_TONES[index];
}
