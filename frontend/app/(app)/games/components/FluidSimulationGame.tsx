"use client";

import { useEffect, useRef, useState } from "react";

const FluidSimulationGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in fullscreen mode
    const checkFullscreen = () => {
      const isFS = !!(document.fullscreenElement || 
                      (document as any).webkitFullscreenElement || 
                      (document as any).msFullscreenElement);
      setIsFullscreen(isFS);
    };

    const handleResize = () => {
      // Check for mobile screen size
      setIsMobile(window.innerWidth < 768); 
    };

    // Listen for fullscreen and resize changes
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);
    window.addEventListener('resize', handleResize);

    // Initial check
    checkFullscreen();
    handleResize();

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    import("./fluid-sim").then((module) => {
      if (canvasRef.current) {
        if (isFullscreen) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        } else if (isMobile) {
          // Mobile dimensions
          const mobileWidth = window.innerWidth * 0.9;
          canvasRef.current.width = mobileWidth;
          canvasRef.current.height = mobileWidth * (600 / 800); // Maintain aspect ratio
        } else {
          // Desktop dimensions
          canvasRef.current.width = 800;
          canvasRef.current.height = 600;
        }
        
        module.startFluidSimulation(canvasRef.current);
      }
    });
  }, [isFullscreen, isMobile]);

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
            : isMobile 
            ? 'w-[90vw] h-[67.5vw]' // w-90vw h-67.5vw
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