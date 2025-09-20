"use client";

import { useEffect, useRef, useState } from "react";

const FluidSimulationGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Check if we're in fullscreen mode
    const checkFullscreen = () => {
      const isFS = !!(document.fullscreenElement || 
                     (document as any).webkitFullscreenElement || 
                     (document as any).msFullscreenElement);
      setIsFullscreen(isFS);
    };

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);

    // Initial check
    checkFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
    };
  }, []);

  useEffect(() => {
    // Dynamically import the fluid sim script (so it runs client-side only)
    import("./fluid-sim").then((module) => {
      if (canvasRef.current) {
        // Set canvas size based on fullscreen state
        if (isFullscreen) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        } else {
          canvasRef.current.width = 800;
          canvasRef.current.height = 600;
        }
        
        module.startFluidSimulation(canvasRef.current);
      }
    });
  }, [isFullscreen]);

  return (
    <div className={`flex items-center justify-center ${
      isFullscreen 
        ? 'fixed inset-0 bg-black' 
        : 'w-full h-full bg-black'
    }`}>
      <canvas 
        ref={canvasRef} 
        className={`${
          isFullscreen 
            ? 'w-screen h-screen' 
            : 'w-[800px] h-[600px]'
        } rounded-lg`}
        style={{
          filter: 'brightness(1.3) contrast(1.1)'
        }}
      />
    </div>
  );
};

export default FluidSimulationGame;