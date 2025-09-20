// fluid-sim.ts
// @ts-ignore
import WebGLFluidEnhanced from "webgl-fluid";

export function startFluidSimulation(canvas: HTMLCanvasElement) {
  // Make sure it’s actually a function
  const fluidFunc = typeof WebGLFluidEnhanced === "function" 
    ? WebGLFluidEnhanced 
    : (WebGLFluidEnhanced as any).default;

  fluidFunc(canvas, {
    TRIGGER: "click",  // or "click"
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE_DISSIPATION: 0.9,
    CURL: 30,
    SPLAT_RADIUS: 0.3,
    SHADING: true,
    COLORFUL: true,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_INTENSITY: 0.8,
  });
}
