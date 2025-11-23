export interface TemplateRegion {
  name: string;
  // Destination on the 585x559 canvas
  x: number;
  y: number;
  w: number;
  h: number;
  // Source offset relative to the center of the uploaded image
  // e.g., offsetX: 0, offsetY: 0 means take from the center
  offsetX: number;
  offsetY: number;
  rotation?: number; // In degrees
  color?: string; // For debug overlay
}

// Based on standard Roblox R15 Shirt Template (585x559)
// The logic assumes the user uploads a design where the CENTER is the FRONT of the shirt.
// We then map adjacent areas of the source image to the sides/back/arms.

const TORSO_W = 128;
const TORSO_H = 128;
const LIMB_W = 64;
const LIMB_H = 128;

// Assume input image is approx 1024x1024 (Gemini 2.5 default)
// We want to sample:
// - Front: Center
// - Back: Center (Repeated)
// - Shoulders: Top Center
// - Hem: Bottom Center
// - Sleeves: Far Left/Right

export const SHIRT_REGIONS: TemplateRegion[] = [
  // --- TORSO ---
  // Front: Center of image
  { name: 'Torso Front', x: 231, y: 74, w: TORSO_W, h: TORSO_H, offsetX: 0, offsetY: 0, color: 'rgba(255, 0, 0, 0.3)' },
  // Back: Repeat Front (Center) or slightly offset if you want a back view.
  { name: 'Torso Back', x: 427, y: 74, w: TORSO_W, h: TORSO_H, offsetX: 0, offsetY: 0, color: 'rgba(0, 0, 255, 0.3)' },
  // Right: Sample from slightly left of center
  { name: 'Torso Right', x: 162, y: 74, w: LIMB_W, h: TORSO_H, offsetX: -200, offsetY: 0, color: 'rgba(0, 255, 0, 0.3)' },
  // Left: Sample from slightly right of center
  { name: 'Torso Left', x: 363, y: 74, w: LIMB_W, h: TORSO_H, offsetX: 200, offsetY: 0, color: 'rgba(255, 255, 0, 0.3)' },
  // Up: Sample from Top Center (Neck/Shoulder)
  { name: 'Torso Up', x: 231, y: 0, w: TORSO_W, h: 64, offsetX: 0, offsetY: -350, color: 'rgba(0, 255, 255, 0.3)' },
  // Down: Sample from Bottom Center (Hem)
  { name: 'Torso Down', x: 231, y: 202, w: TORSO_W, h: 64, offsetX: 0, offsetY: 350, color: 'rgba(255, 165, 0, 0.3)' },

  // --- RIGHT ARM (Bottom Left Quadrant) ---
  // Mapping logic: Take from Far Left of source image
  { name: 'R.Arm Front', x: 198, y: 329, w: LIMB_W, h: LIMB_H, offsetX: -350, offsetY: 0, color: 'rgba(255, 0, 0, 0.3)' },
  { name: 'R.Arm Back', x: 66, y: 329, w: LIMB_W, h: LIMB_H, offsetX: -350, offsetY: 0, color: 'rgba(0, 0, 255, 0.3)' },
  { name: 'R.Arm Right', x: 132, y: 329, w: LIMB_W, h: LIMB_H, offsetX: -400, offsetY: 0, color: 'rgba(0, 255, 0, 0.3)' },
  { name: 'R.Arm Left', x: 0, y: 329, w: LIMB_W, h: LIMB_H, offsetX: -300, offsetY: 0, color: 'rgba(255, 255, 0, 0.3)' },
  { name: 'R.Arm Up', x: 198, y: 265, w: LIMB_W, h: 64, offsetX: -350, offsetY: -350, color: 'rgba(0, 255, 255, 0.3)' },
  { name: 'R.Arm Down', x: 198, y: 457, w: LIMB_W, h: 64, offsetX: -350, offsetY: 350, color: 'rgba(255, 165, 0, 0.3)' },

  // --- LEFT ARM (Bottom Right Quadrant) ---
  // Mapping logic: Take from Far Right of source image
  { name: 'L.Arm Front', x: 335, y: 329, w: LIMB_W, h: LIMB_H, offsetX: 350, offsetY: 0, color: 'rgba(255, 0, 0, 0.3)' },
  { name: 'L.Arm Back', x: 467, y: 329, w: LIMB_W, h: LIMB_H, offsetX: 350, offsetY: 0, color: 'rgba(0, 0, 255, 0.3)' },
  { name: 'L.Arm Right', x: 533, y: 329, w: LIMB_W, h: LIMB_H, offsetX: 400, offsetY: 0, color: 'rgba(0, 255, 0, 0.3)' },
  { name: 'L.Arm Left', x: 401, y: 329, w: LIMB_W, h: LIMB_H, offsetX: 300, offsetY: 0, color: 'rgba(255, 255, 0, 0.3)' },
  { name: 'L.Arm Up', x: 335, y: 265, w: LIMB_W, h: 64, offsetX: 350, offsetY: -350, color: 'rgba(0, 255, 255, 0.3)' },
  { name: 'L.Arm Down', x: 335, y: 457, w: LIMB_W, h: 64, offsetX: 350, offsetY: 350, color: 'rgba(255, 165, 0, 0.3)' },
];