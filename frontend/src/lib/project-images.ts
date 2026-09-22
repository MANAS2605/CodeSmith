export interface GradientTheme {
  name: string;
  background: string;
  accent: string;
}

export const PROJECT_GRADIENTS: GradientTheme[] = [
  {
    name: "Celestial Aurora",
    background: "linear-gradient(135deg, #030712 0%, #1e1b4b 35%, #4338ca 70%, #06b6d4 100%)",
    accent: "#6366f1",
  },
  {
    name: "Cosmic Nebula",
    background: "linear-gradient(135deg, #0f172a 0%, #581c87 40%, #a855f7 100%)",
    accent: "#a855f7",
  },
  {
    name: "Stellar Horizon",
    background: "linear-gradient(135deg, #020617 0%, #1e3a8a 50%, #38bdf8 100%)",
    accent: "#38bdf8",
  },
  {
    name: "Astral Violet",
    background: "linear-gradient(135deg, #090d1f 0%, #312e81 40%, #7c3aed 75%, #c084fc 100%)",
    accent: "#8b5cf6",
  },
  {
    name: "Electric Crimson",
    background: "linear-gradient(135deg, #e11d48 0%, #f43f5e 40%, #fb923c 100%)",
    accent: "#f43f5e",
  },
  {
    name: "Deep Sapphire",
    background: "linear-gradient(135deg, #1e3a8a 0%, #4338ca 45%, #06b6d4 100%)",
    accent: "#3b82f6",
  },
  {
    name: "Amber Flame",
    background: "linear-gradient(135deg, #d97706 0%, #f97316 45%, #e11d48 100%)",
    accent: "#f97316",
  },
  {
    name: "Hyperdrive",
    background: "linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #f43f5e 100%)",
    accent: "#7c3aed",
  },
  {
    name: "Ocean Lagoon",
    background: "linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #2dd4bf 100%)",
    accent: "#0284c7",
  },
  {
    name: "Berry Fusion",
    background: "linear-gradient(135deg, #701a75 0%, #be123c 50%, #fb7185 100%)",
    accent: "#be123c",
  },
  {
    name: "Supernova Dusk",
    background: "linear-gradient(135deg, #ea580c 0%, #8b5cf6 50%, #0284c7 100%)",
    accent: "#8b5cf6",
  },
  {
    name: "Celestial Jade",
    background: "linear-gradient(135deg, #064e3b 0%, #059669 45%, #34d399 100%)",
    accent: "#059669",
  },
  {
    name: "Pastel Radiance",
    background: "linear-gradient(135deg, #818cf8 0%, #f472b6 45%, #fde047 100%)",
    accent: "#f472b6",
  },
  {
    name: "Midnight Cobalt",
    background: "linear-gradient(135deg, #18181b 0%, #2563eb 50%, #db2777 100%)",
    accent: "#2563eb",
  },
  {
    name: "Solar Flare",
    background: "linear-gradient(135deg, #facc15 0%, #f97316 50%, #b91c1c 100%)",
    accent: "#ea580c",
  },
  {
    name: "Mystic Nebula",
    background: "linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #9333ea 100%)",
    accent: "#9333ea",
  },
  {
    name: "Coral Tide",
    background: "linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #38bdf8 100%)",
    accent: "#fb7185",
  },
  {
    name: "Prism Wave",
    background: "linear-gradient(135deg, #6d28d9 0%, #0284c7 50%, #10b981 100%)",
    accent: "#6d28d9",
  },
];

/**
 * Returns a deterministic gradient theme based on project id and name.
 */
export function getProjectGradient(projectId?: number | string | null, projectName?: string | null): GradientTheme {
  const seed = `${projectId ?? "0"}-${projectName ?? "project"}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (seed.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  const index = Math.abs(hash) % PROJECT_GRADIENTS.length;
  return PROJECT_GRADIENTS[index] || PROJECT_GRADIENTS[0];
}

export function getProjectImage(projectId?: number | string | null, customThumbnail?: string | null): string {
  if (customThumbnail) return customThumbnail;
  return "";
}

export const AVATAR_COLORS = [
  "#6366f1", // Cosmic Indigo
  "#8b5cf6", // Astral Violet
  "#a855f7", // Stellar Purple
  "#0ea5e9", // Sky Cyan
  "#06b6d4", // Deep Cyan
  "#3b82f6", // Starlight Blue
  "#7c3aed", // Royal Violet
  "#f43f5e", // Astral Rose
];

export function getAvatarColor(idOrName?: string | number | null): string {
  let hash = 0;
  const str = String(idOrName || "0");
  for (let i = 0; i < str.length; i++) {
    hash = (str.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length] || AVATAR_COLORS[0];
}
