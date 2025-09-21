// fluid-sim.ts
// @ts-ignore
import WebGLFluidEnhanced from "webgl-fluid";

export function startFluidSimulation(canvas: HTMLCanvasElement) {
  // Make sure it’s actually a function
  const fluidFunc = typeof WebGLFluidEnhanced === "function" 
    ? WebGLFluidEnhanced 
    : (WebGLFluidEnhanced as any).default;

  fluidFunc(canvas, {
    TRIGGER: "click",
    DENSITY_DISSIPATION: 0.96, // Lowered from 0.98 for more persistent color trails
    VELOCITY_DISSIPATION: 0.97, // Lowered from 0.99 for less friction and longer-lasting motion
    PRESSURE_DISSIPATION: 0.8, // Increased from 0.9 for faster pressure diffusion, which can lead to a more dynamic "splat"
    CURL: 40, // Increased from 30 for more chaotic, turbulent flow
    SPLAT_RADIUS: 0.4, // Increased from 0.3 for a larger initial splash
    SHADING: true,
    COLORFUL: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_INTENSITY: 0.9, // Increased from 0.8 for a more pronounced glow effect
  });
}