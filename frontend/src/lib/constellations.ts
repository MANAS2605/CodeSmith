export type StarMagnitude = "supergiant" | "alpha" | "major" | "minor";

export interface ConstellationStar {
  id: string;
  name?: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // radius in px
  magnitude: StarMagnitude;
  color?: string; // specific star spectral color
  hasRays?: boolean; // diffraction spike flares
}

export interface DeepSkyFeature {
  type: "galaxy" | "nebula" | "cluster" | "milkyway";
  x: number;
  y: number;
  label?: string;
}

export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  alphaStar: string;
  spectralColor: string; // primary tint e.g. #38bdf8
  nebulaColor: string; // subtle background dust rgba
  coordinates: string;
  stars: ConstellationStar[];
  lines: [number, number][]; // pairs of star indices
  deepSky?: DeepSkyFeature;
}

export const CONSTELLATIONS: Constellation[] = [
  // 1. ORION - The Hunter
  {
    id: "orion",
    name: "Orion",
    latinName: "The Hunter",
    alphaStar: "Betelgeuse (α Ori)",
    spectralColor: "#38bdf8",
    nebulaColor: "rgba(99, 102, 241, 0.22)",
    coordinates: "RA 05h 55m · Dec +07°24'",
    stars: [
      { id: "betelgeuse", name: "Betelgeuse", x: 30, y: 26, size: 4.5, magnitude: "supergiant", color: "#fb923c", hasRays: true },
      { id: "bellatrix", name: "Bellatrix", x: 68, y: 29, size: 3.5, magnitude: "major", color: "#93c5fd" },
      { id: "alnitak", name: "Alnitak", x: 44, y: 50, size: 3.0, magnitude: "major", color: "#e0e7ff" },
      { id: "alnilam", name: "Alnilam", x: 50, y: 49, size: 3.2, magnitude: "alpha", color: "#bae6fd", hasRays: true },
      { id: "mintaka", name: "Mintaka", x: 56, y: 48, size: 3.0, magnitude: "major", color: "#e0e7ff" },
      { id: "saiph", name: "Saiph", x: 32, y: 76, size: 3.2, magnitude: "major", color: "#818cf8" },
      { id: "rigel", name: "Rigel", x: 72, y: 78, size: 4.5, magnitude: "supergiant", color: "#38bdf8", hasRays: true },
      { id: "meissa", name: "Meissa", x: 49, y: 15, size: 2.8, magnitude: "minor", color: "#e0e7ff" },
      { id: "bow1", x: 80, y: 38, size: 2.2, magnitude: "minor" },
      { id: "bow2", x: 83, y: 50, size: 2.2, magnitude: "minor" },
      { id: "bow3", x: 80, y: 62, size: 2.2, magnitude: "minor" },
    ],
    lines: [
      [0, 7], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4],
      [2, 5], [4, 6], [5, 6], [1, 8], [8, 9], [9, 10],
    ],
    deepSky: { type: "nebula", x: 50, y: 59, label: "M42 Orion Nebula" },
  },

  // 2. CASSIOPEIA - The Queen
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    latinName: "The Queen",
    alphaStar: "Schedar (α Cas)",
    spectralColor: "#c084fc",
    nebulaColor: "rgba(168, 85, 247, 0.22)",
    coordinates: "RA 00h 40m · Dec +56°32'",
    stars: [
      { id: "caph", name: "Caph", x: 18, y: 44, size: 3.6, magnitude: "major", color: "#fef08a" },
      { id: "schedar", name: "Schedar", x: 34, y: 68, size: 4.2, magnitude: "supergiant", color: "#fb923c", hasRays: true },
      { id: "gamma_cas", name: "Navi", x: 52, y: 38, size: 4.0, magnitude: "alpha", color: "#38bdf8", hasRays: true },
      { id: "ruchbah", name: "Ruchbah", x: 70, y: 65, size: 3.5, magnitude: "major", color: "#e0e7ff" },
      { id: "segin", name: "Segin", x: 84, y: 34, size: 3.2, magnitude: "major", color: "#93c5fd" },
      { id: "crown1", x: 35, y: 25, size: 2.2, magnitude: "minor" },
      { id: "crown2", x: 68, y: 22, size: 2.2, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6],
    ],
    deepSky: { type: "cluster", x: 42, y: 52, label: "NGC 457" },
  },

  // 3. URSA MAJOR - The Great Bear
  {
    id: "ursa-major",
    name: "Ursa Major",
    latinName: "The Great Bear",
    alphaStar: "Dubhe (α UMa)",
    spectralColor: "#60a5fa",
    nebulaColor: "rgba(59, 130, 246, 0.22)",
    coordinates: "RA 11h 03m · Dec +61°45'",
    stars: [
      { id: "alkaid", name: "Alkaid", x: 14, y: 66, size: 3.6, magnitude: "major", color: "#93c5fd" },
      { id: "mizar", name: "Mizar", x: 26, y: 56, size: 3.8, magnitude: "alpha", color: "#e0e7ff", hasRays: true },
      { id: "alioth", name: "Alioth", x: 39, y: 50, size: 4.0, magnitude: "supergiant", color: "#38bdf8" },
      { id: "megrez", name: "Megrez", x: 53, y: 48, size: 3.0, magnitude: "minor", color: "#bae6fd" },
      { id: "phecda", name: "Phecda", x: 55, y: 70, size: 3.4, magnitude: "major", color: "#e0e7ff" },
      { id: "merak", name: "Merak", x: 74, y: 66, size: 3.8, magnitude: "major", color: "#e0e7ff" },
      { id: "dubhe", name: "Dubhe", x: 76, y: 44, size: 4.4, magnitude: "supergiant", color: "#fbbf24", hasRays: true },
      { id: "nose", x: 88, y: 32, size: 2.4, magnitude: "minor" },
      { id: "front_paw", x: 80, y: 84, size: 2.2, magnitude: "minor" },
      { id: "back_paw", x: 46, y: 86, size: 2.2, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3],
      [6, 7], [5, 8], [4, 9],
    ],
    deepSky: { type: "galaxy", x: 86, y: 22, label: "M81 Galaxy" },
  },

  // 4. CYGNUS - The Swan
  {
    id: "cygnus",
    name: "Cygnus",
    latinName: "The Swan",
    alphaStar: "Deneb (α Cyg)",
    spectralColor: "#22d3ee",
    nebulaColor: "rgba(34, 211, 238, 0.22)",
    coordinates: "RA 20h 41m · Dec +45°16'",
    stars: [
      { id: "deneb", name: "Deneb", x: 50, y: 16, size: 4.8, magnitude: "supergiant", color: "#67e8f9", hasRays: true },
      { id: "sadr", name: "Sadr", x: 50, y: 46, size: 3.8, magnitude: "alpha", color: "#e0e7ff" },
      { id: "albireo", name: "Albireo", x: 50, y: 84, size: 3.8, magnitude: "major", color: "#facc15", hasRays: true },
      { id: "gienah", name: "Gienah", x: 22, y: 48, size: 3.4, magnitude: "major", color: "#bae6fd" },
      { id: "delta_cyg", name: "Delta Cyg", x: 78, y: 44, size: 3.4, magnitude: "major", color: "#bae6fd" },
      { id: "left_wingtip", x: 12, y: 56, size: 2.4, magnitude: "minor" },
      { id: "right_wingtip", x: 88, y: 40, size: 2.4, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [3, 1], [1, 4], [5, 3], [4, 6],
    ],
    deepSky: { type: "nebula", x: 62, y: 28, label: "North America Nebula" },
  },

  // 5. PEGASUS - The Winged Horse
  {
    id: "pegasus",
    name: "Pegasus",
    latinName: "The Winged Horse",
    alphaStar: "Markab (α Peg)",
    spectralColor: "#a855f7",
    nebulaColor: "rgba(147, 51, 234, 0.22)",
    coordinates: "RA 23h 04m · Dec +15°12'",
    stars: [
      { id: "markab", name: "Markab", x: 30, y: 64, size: 4.0, magnitude: "alpha", color: "#38bdf8", hasRays: true },
      { id: "scheat", name: "Scheat", x: 32, y: 30, size: 4.2, magnitude: "supergiant", color: "#fb7185", hasRays: true },
      { id: "alpheratz", name: "Alpheratz", x: 68, y: 28, size: 4.0, magnitude: "major", color: "#e0e7ff" },
      { id: "algenib", name: "Algenib", x: 66, y: 62, size: 3.4, magnitude: "major", color: "#93c5fd" },
      { id: "neck", x: 20, y: 76, size: 2.6, magnitude: "minor" },
      { id: "enif", name: "Enif", x: 12, y: 52, size: 3.6, magnitude: "major", color: "#f59e0b" },
      { id: "wing_high", x: 22, y: 16, size: 2.4, magnitude: "minor" },
      { id: "wing_mid", x: 44, y: 15, size: 2.4, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [1, 6], [1, 7],
    ],
    deepSky: { type: "cluster", x: 10, y: 44, label: "M15 Globular Cluster" },
  },

  // 6. ANDROMEDA - The Princess
  {
    id: "andromeda",
    name: "Andromeda",
    latinName: "The Chained Maiden",
    alphaStar: "Alpheratz (α And)",
    spectralColor: "#38bdf8",
    nebulaColor: "rgba(56, 189, 248, 0.22)",
    coordinates: "RA 00h 42m · Dec +41°16'",
    stars: [
      { id: "alpheratz", name: "Alpheratz", x: 22, y: 68, size: 4.2, magnitude: "supergiant", color: "#e0e7ff", hasRays: true },
      { id: "delta_and", name: "Delta And", x: 40, y: 55, size: 3.2, magnitude: "major", color: "#fde047" },
      { id: "mirach", name: "Mirach", x: 58, y: 44, size: 4.2, magnitude: "supergiant", color: "#fb923c", hasRays: true },
      { id: "almach", name: "Almach", x: 80, y: 30, size: 3.8, magnitude: "alpha", color: "#38bdf8" },
      { id: "mu_and", name: "Mu And", x: 52, y: 30, size: 2.8, magnitude: "minor" },
      { id: "nu_and", name: "Nu And", x: 62, y: 22, size: 2.8, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5],
    ],
    deepSky: { type: "galaxy", x: 70, y: 18, label: "M31 Andromeda Galaxy" },
  },

  // 7. TAURUS - The Bull
  {
    id: "taurus",
    name: "Taurus",
    latinName: "The Bull",
    alphaStar: "Aldebaran (α Tau)",
    spectralColor: "#f59e0b",
    nebulaColor: "rgba(245, 158, 11, 0.22)",
    coordinates: "RA 04h 35m · Dec +16°30'",
    stars: [
      { id: "aldebaran", name: "Aldebaran", x: 48, y: 54, size: 5.0, magnitude: "supergiant", color: "#f97316", hasRays: true },
      { id: "elnath", name: "Elnath", x: 78, y: 24, size: 3.8, magnitude: "major", color: "#93c5fd" },
      { id: "tianguan", name: "Tianguan", x: 82, y: 54, size: 3.4, magnitude: "major", color: "#e0e7ff" },
      { id: "ain", name: "Ain", x: 42, y: 42, size: 3.2, magnitude: "alpha", color: "#fbbf24" },
      { id: "gamma_tau", name: "Prima Hyadum", x: 34, y: 50, size: 3.0, magnitude: "major" },
      { id: "delta_tau", name: "Secunda Hyadum", x: 38, y: 46, size: 2.8, magnitude: "minor" },
      { id: "hyades_base", x: 26, y: 62, size: 2.4, magnitude: "minor" },
    ],
    lines: [
      [4, 5], [5, 3], [3, 0], [0, 4], [3, 1], [0, 2], [4, 6],
    ],
    deepSky: { type: "cluster", x: 20, y: 30, label: "M45 Pleiades" },
  },

  // 8. SCORPIUS - The Scorpion
  {
    id: "scorpius",
    name: "Scorpius",
    latinName: "The Scorpion",
    alphaStar: "Antares (α Sco)",
    spectralColor: "#ef4444",
    nebulaColor: "rgba(239, 68, 68, 0.22)",
    coordinates: "RA 16h 29m · Dec -26°25'",
    stars: [
      { id: "graffias", name: "Graffias", x: 20, y: 24, size: 3.2, magnitude: "major", color: "#93c5fd" },
      { id: "dschubba", name: "Dschubba", x: 22, y: 34, size: 3.6, magnitude: "alpha", color: "#38bdf8" },
      { id: "pi_sco", name: "Fang", x: 20, y: 44, size: 3.0, magnitude: "minor" },
      { id: "antares", name: "Antares", x: 36, y: 42, size: 5.2, magnitude: "supergiant", color: "#ef4444", hasRays: true },
      { id: "tau_sco", name: "Paikauhale", x: 42, y: 50, size: 3.0, magnitude: "minor" },
      { id: "epsilon_sco", name: "Larawag", x: 48, y: 60, size: 3.4, magnitude: "major", color: "#fb923c" },
      { id: "mu_sco", x: 56, y: 70, size: 3.0, magnitude: "minor" },
      { id: "sargas", name: "Sargas", x: 70, y: 74, size: 3.8, magnitude: "major", color: "#fef08a" },
      { id: "shaula", name: "Shaula", x: 80, y: 58, size: 4.2, magnitude: "supergiant", color: "#38bdf8", hasRays: true },
      { id: "lesath", name: "Lesath", x: 78, y: 48, size: 3.2, magnitude: "major" },
    ],
    lines: [
      [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    ],
    deepSky: { type: "nebula", x: 36, y: 42, label: "Rho Ophiuchi Cloud" },
  },

  // 9. LEO - The Lion
  {
    id: "leo",
    name: "Leo",
    latinName: "The Lion",
    alphaStar: "Regulus (α Leo)",
    spectralColor: "#67e8f9",
    nebulaColor: "rgba(6, 182, 212, 0.22)",
    coordinates: "RA 10h 08m · Dec +11°58'",
    stars: [
      { id: "regulus", name: "Regulus", x: 32, y: 72, size: 4.8, magnitude: "supergiant", color: "#67e8f9", hasRays: true },
      { id: "algieba", name: "Algieba", x: 38, y: 46, size: 3.8, magnitude: "alpha", color: "#fde047" },
      { id: "adhafera", name: "Adhafera", x: 48, y: 35, size: 3.2, magnitude: "major" },
      { id: "ras_elased", name: "Ras Elased", x: 42, y: 22, size: 3.0, magnitude: "minor" },
      { id: "zosma", name: "Zosma", x: 68, y: 42, size: 3.6, magnitude: "major", color: "#e0e7ff" },
      { id: "denebola", name: "Denebola", x: 86, y: 52, size: 4.2, magnitude: "supergiant", color: "#93c5fd", hasRays: true },
      { id: "chertan", name: "Chertan", x: 66, y: 68, size: 3.4, magnitude: "major" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [4, 6], [6, 0],
    ],
    deepSky: { type: "galaxy", x: 74, y: 62, label: "Leo Triplet (M66)" },
  },

  // 10. LYRA - The Celestial Harp
  {
    id: "lyra",
    name: "Lyra",
    latinName: "The Celestial Harp",
    alphaStar: "Vega (α Lyr)",
    spectralColor: "#a5f3fc",
    nebulaColor: "rgba(129, 140, 248, 0.22)",
    coordinates: "RA 18h 36m · Dec +38°47'",
    stars: [
      { id: "vega", name: "Vega", x: 46, y: 18, size: 5.2, magnitude: "supergiant", color: "#a5f3fc", hasRays: true },
      { id: "epsilon_lyr", name: "Double-Double", x: 58, y: 22, size: 3.0, magnitude: "minor", color: "#bae6fd" },
      { id: "zeta_lyr", name: "Zeta Lyr", x: 42, y: 38, size: 3.4, magnitude: "major" },
      { id: "delta_lyr", name: "Delta Lyr", x: 56, y: 40, size: 3.4, magnitude: "major", color: "#fca5a5" },
      { id: "sulafat", name: "Sulafat", x: 60, y: 72, size: 3.8, magnitude: "alpha", color: "#38bdf8" },
      { id: "sheliak", name: "Sheliak", x: 44, y: 70, size: 3.6, magnitude: "major", color: "#fde047" },
    ],
    lines: [
      [0, 1], [0, 2], [0, 3], [2, 3], [2, 5], [3, 4], [5, 4],
    ],
    deepSky: { type: "nebula", x: 52, y: 71, label: "M57 Ring Nebula" },
  },

  // 11. AQUILA - The Eagle
  {
    id: "aquila",
    name: "Aquila",
    latinName: "The Eagle",
    alphaStar: "Altair (α Aql)",
    spectralColor: "#e0e7ff",
    nebulaColor: "rgba(99, 102, 241, 0.22)",
    coordinates: "RA 19h 50m · Dec +08°52'",
    stars: [
      { id: "altair", name: "Altair", x: 50, y: 46, size: 4.8, magnitude: "supergiant", color: "#ffffff", hasRays: true },
      { id: "tarazed", name: "Tarazed", x: 48, y: 32, size: 3.8, magnitude: "alpha", color: "#fb923c" },
      { id: "alshain", name: "Alshain", x: 52, y: 60, size: 3.4, magnitude: "major", color: "#fde047" },
      { id: "delta_aql", name: "Delta Aql", x: 24, y: 56, size: 3.4, magnitude: "major", color: "#93c5fd" },
      { id: "zeta_aql", name: "Deneb el Okab", x: 76, y: 36, size: 3.6, magnitude: "major", color: "#bae6fd" },
      { id: "theta_aql", name: "Tseen Foo", x: 64, y: 80, size: 3.2, magnitude: "minor" },
      { id: "lambda_aql", name: "Al Thalimain", x: 30, y: 76, size: 3.0, magnitude: "minor" },
    ],
    lines: [
      [1, 0], [0, 2], [3, 0], [0, 4], [2, 5], [2, 6],
    ],
    deepSky: { type: "cluster", x: 32, y: 38, label: "NGC 6709" },
  },

  // 12. CRUX - The Southern Cross
  {
    id: "crux",
    name: "Crux",
    latinName: "The Southern Cross",
    alphaStar: "Acrux (α Cru)",
    spectralColor: "#38bdf8",
    nebulaColor: "rgba(56, 189, 248, 0.22)",
    coordinates: "RA 12h 26m · Dec -60°11'",
    stars: [
      { id: "acrux", name: "Acrux", x: 50, y: 80, size: 4.8, magnitude: "supergiant", color: "#38bdf8", hasRays: true },
      { id: "gacrux", name: "Gacrux", x: 50, y: 20, size: 4.2, magnitude: "supergiant", color: "#f87171", hasRays: true },
      { id: "mimosa", name: "Mimosa", x: 26, y: 48, size: 4.2, magnitude: "alpha", color: "#93c5fd", hasRays: true },
      { id: "delta_cru", name: "Imai", x: 74, y: 46, size: 3.6, magnitude: "major", color: "#e0e7ff" },
      { id: "epsilon_cru", name: "Ginan", x: 62, y: 58, size: 2.6, magnitude: "minor", color: "#fb923c" },
      { id: "hadar", name: "Hadar", x: 18, y: 78, size: 4.0, magnitude: "major", color: "#67e8f9" },
      { id: "rigil_kent", name: "Alpha Centauri", x: 10, y: 64, size: 4.6, magnitude: "supergiant", color: "#fde047", hasRays: true },
    ],
    lines: [
      [1, 0], [2, 3], [5, 6],
    ],
    deepSky: { type: "nebula", x: 60, y: 74, label: "Coalsack Dark Nebula" },
  },

  // 13. PHOENIX - The Firebird
  {
    id: "phoenix",
    name: "Phoenix",
    latinName: "The Firebird",
    alphaStar: "Ankaa (α Phe)",
    spectralColor: "#fbbf24",
    nebulaColor: "rgba(251, 191, 36, 0.22)",
    coordinates: "RA 00h 26m · Dec -42°18'",
    stars: [
      { id: "ankaa", name: "Ankaa", x: 50, y: 22, size: 4.8, magnitude: "supergiant", color: "#fbbf24", hasRays: true },
      { id: "beta_phe", name: "Beta Phe", x: 34, y: 52, size: 3.6, magnitude: "alpha", color: "#fde047" },
      { id: "gamma_phe", name: "Gamma Phe", x: 66, y: 50, size: 3.6, magnitude: "major", color: "#f87171" },
      { id: "delta_phe", name: "Delta Phe", x: 16, y: 40, size: 3.0, magnitude: "minor", color: "#e0e7ff" },
      { id: "epsilon_phe", name: "Epsilon Phe", x: 84, y: 38, size: 3.0, magnitude: "minor", color: "#e0e7ff" },
      { id: "zeta_phe", name: "Zeta Phe", x: 50, y: 80, size: 3.8, magnitude: "major", color: "#93c5fd" },
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 5],
    ],
    deepSky: { type: "cluster", x: 50, y: 52, label: "Phoenix Cluster" },
  },

  // 14. DRACO - The Dragon
  {
    id: "draco",
    name: "Draco",
    latinName: "The Dragon",
    alphaStar: "Eltanin (γ Dra)",
    spectralColor: "#34d399",
    nebulaColor: "rgba(52, 211, 153, 0.20)",
    coordinates: "RA 17h 56m · Dec +51°29'",
    stars: [
      { id: "rastaban", name: "Rastaban", x: 74, y: 22, size: 3.8, magnitude: "alpha", color: "#fde047" },
      { id: "eltanin", name: "Eltanin", x: 84, y: 24, size: 4.5, magnitude: "supergiant", color: "#fb923c", hasRays: true },
      { id: "kuma", name: "Kuma", x: 78, y: 14, size: 2.8, magnitude: "minor" },
      { id: "grumium", name: "Grumium", x: 68, y: 15, size: 3.0, magnitude: "minor" },
      { id: "altais", name: "Altais", x: 58, y: 28, size: 3.4, magnitude: "major" },
      { id: "aldhibah", name: "Aldhibah", x: 44, y: 34, size: 3.2, magnitude: "major" },
      { id: "edasich", name: "Edasich", x: 36, y: 48, size: 3.4, magnitude: "major", color: "#fbbf24" },
      { id: "thuban", name: "Thuban", x: 42, y: 65, size: 3.8, magnitude: "supergiant", color: "#38bdf8", hasRays: true },
      { id: "giausar", name: "Giausar", x: 20, y: 76, size: 3.0, magnitude: "minor" },
    ],
    lines: [
      [2, 0], [0, 1], [1, 3], [3, 2], [0, 4], [4, 5], [5, 6], [6, 7], [7, 8],
    ],
    deepSky: { type: "nebula", x: 50, y: 52, label: "Cat's Eye Nebula (NGC 6543)" },
  },

  // 15. CANIS MAJOR - The Greater Dog
  {
    id: "canis-major",
    name: "Canis Major",
    latinName: "The Greater Dog",
    alphaStar: "Sirius (α CMa)",
    spectralColor: "#60a5fa",
    nebulaColor: "rgba(96, 165, 250, 0.22)",
    coordinates: "RA 06h 45m · Dec -16°42'",
    stars: [
      { id: "sirius", name: "Sirius", x: 44, y: 30, size: 5.6, magnitude: "supergiant", color: "#ffffff", hasRays: true },
      { id: "murzim", name: "Murzim", x: 24, y: 34, size: 3.8, magnitude: "alpha", color: "#38bdf8" },
      { id: "muliphein", name: "Muliphein", x: 60, y: 20, size: 2.8, magnitude: "minor" },
      { id: "wezen", name: "Wezen", x: 60, y: 64, size: 4.2, magnitude: "supergiant", color: "#fde047", hasRays: true },
      { id: "adhara", name: "Adhara", x: 48, y: 78, size: 4.4, magnitude: "supergiant", color: "#93c5fd", hasRays: true },
      { id: "aludra", name: "Aludra", x: 74, y: 74, size: 3.6, magnitude: "major", color: "#38bdf8" },
      { id: "furud", name: "Furud", x: 34, y: 82, size: 3.0, magnitude: "minor" },
    ],
    lines: [
      [1, 0], [0, 2], [0, 3], [3, 4], [4, 6], [3, 5],
    ],
    deepSky: { type: "cluster", x: 44, y: 52, label: "M41 Open Cluster" },
  },

  // 16. SAGITTARIUS - The Celestial Archer
  {
    id: "sagittarius",
    name: "Sagittarius",
    latinName: "The Archer / Teapot",
    alphaStar: "Kaus Australis (ε Sgr)",
    spectralColor: "#38bdf8",
    nebulaColor: "rgba(168, 85, 247, 0.25)",
    coordinates: "RA 19h 02m · Dec -29°52'",
    stars: [
      { id: "kaus_aus", name: "Kaus Australis", x: 50, y: 76, size: 4.6, magnitude: "supergiant", color: "#38bdf8", hasRays: true },
      { id: "kaus_med", name: "Kaus Media", x: 42, y: 55, size: 3.6, magnitude: "alpha", color: "#fde047" },
      { id: "kaus_bor", name: "Kaus Borealis", x: 52, y: 36, size: 4.0, magnitude: "supergiant", color: "#fb923c", hasRays: true },
      { id: "nunki", name: "Nunki", x: 76, y: 40, size: 4.2, magnitude: "alpha", color: "#93c5fd", hasRays: true },
      { id: "ascella", name: "Ascella", x: 70, y: 68, size: 3.8, magnitude: "major", color: "#e0e7ff" },
      { id: "alnasl", name: "Alnasl", x: 22, y: 58, size: 3.6, magnitude: "major", color: "#fbbf24" },
      { id: "phi_sgr", name: "Phi Sgr", x: 64, y: 46, size: 3.2, magnitude: "minor" },
      { id: "tau_sgr", name: "Tau Sgr", x: 64, y: 58, size: 3.0, magnitude: "minor" },
    ],
    lines: [
      [0, 1], [1, 2], [2, 6], [6, 3], [3, 4], [4, 7], [7, 0], [1, 5], [2, 5], [6, 7],
    ],
    deepSky: { type: "milkyway", x: 18, y: 38, label: "Galactic Center Core" },
  },
];

/**
 * Deterministically picks a constellation for a project based on ID, Name, or index.
 */
export function getConstellationForProject(
  projectId?: number | string | null,
  projectName?: string | null,
  index?: number
): Constellation {
  if (projectId != null && projectId !== "") {
    const num = Number(projectId);
    if (!isNaN(num) && num > 0) {
      return CONSTELLATIONS[(num - 1) % CONSTELLATIONS.length];
    }
  }

  if (index != null && !isNaN(index) && index >= 0) {
    return CONSTELLATIONS[index % CONSTELLATIONS.length];
  }

  const seed = `${projectId ?? ""}-${projectName ?? "orbit"}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (seed.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  }
  const pos = Math.abs(hash) % CONSTELLATIONS.length;
  return CONSTELLATIONS[pos] || CONSTELLATIONS[0];
}
