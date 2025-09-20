"use client";

import React, { useState, useEffect, useRef } from "react";

interface GameProps {
  isFullscreen?: boolean;
}

// Drawing Game - Simple mandala creator with fullscreen support
export default function DrawingGame({ isFullscreen = false }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4F46E5');
  const [brushSize, setBrushSize] = useState(3);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });

  const colors = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Calculate optimal canvas size based on container and screen
  const calculateCanvasSize = () => {
    if (!containerRef.current) return { width: 800, height: 800 };

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    if (isFullscreen) {
      // In fullscreen, use most of the screen but leave space for controls
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 120; // Space for controls
      
      // Make it square, using the smaller dimension
      const size = Math.min(maxWidth, maxHeight);
      return { 
        width: Math.max(400, Math.min(size, 1600)), // Minimum 400px, maximum 800px
        height: Math.max(400, Math.min(size, 1600))
      };
    } else {
      // Normal mode - responsive but smaller
      const maxWidth = Math.min(rect.width - 40, 500);
      const maxHeight = Math.min(rect.height - 120, 500);
      const size = Math.min(maxWidth, maxHeight);
      return { 
        width: Math.max(300, size),
        height: Math.max(300, size)
      };
    }
  };

  // Update canvas size when fullscreen changes or window resizes
  useEffect(() => {
    const updateSize = () => {
      const newSize = calculateCanvasSize();
      setCanvasSize(newSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas with new size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center point
    ctx.fillStyle = '#E5E7EB';
    ctx.beginPath();
    ctx.arc(canvasSize.width / 2, canvasSize.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();
  }, [canvasSize]);

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setLastPoint(coords);
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);

    // Set drawing properties
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPoint) {
      // Draw a line from last point to current point
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // Draw a dot at the current point
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    setLastPoint(coords);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#E5E7EB';
    ctx.beginPath();
    ctx.arc(canvasSize.width / 2, canvasSize.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'zen-pattern.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full flex flex-col items-center justify-center space-y-4 p-4 ${
        isFullscreen ? 'min-h-screen' : ''
      }`}
    >
      <div className="text-center">
        <div className={`font-bold text-gray-700 mb-1 ${isFullscreen ? 'text-3xl mb-3' : 'text-xl sm:text-2xl sm:mb-2'}`}>
          Zen Patterns
        </div>
        <div className={`text-gray-600 ${isFullscreen ? 'text-lg' : 'text-xs sm:text-sm'}`}>
          Create beautiful patterns to find inner peace
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          style={{ 
            width: `${canvasSize.width}px`, 
            height: `${canvasSize.height}px`,
            maxWidth: '95vw',
            maxHeight: '70vh'
          }}
          className="border-2 border-gray-300 rounded-lg shadow-lg cursor-crosshair bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          // Touch support for mobile
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            startDrawing(mouseEvent as any);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            draw(mouseEvent as any);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing();
          }}
        />

        <div className={`flex flex-col items-center space-y-3 ${
          isFullscreen ? 'sm:flex-row sm:space-y-0 sm:space-x-6' : 'sm:flex-row sm:space-y-0 sm:space-x-4'
        }`}>
          <div className="flex space-x-2">
            {colors.map(c => (
              <button
                key={c}
                className={`rounded-full border-2 transition-all hover:scale-110 ${
                  color === c ? 'border-gray-700 scale-110' : 'border-gray-300'
                } ${isFullscreen ? 'w-10 h-10' : 'w-6 h-6 sm:w-8 sm:h-8'}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <label className={`text-gray-600 font-medium ${isFullscreen ? 'text-base' : 'text-xs sm:text-sm'}`}>
              Size:
            </label>
            <input
              type="range"
              min="1"
              max="15"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className={`accent-blue-500 ${isFullscreen ? 'w-24' : 'w-16'}`}
            />
            <span className={`text-gray-500 w-6 text-center ${isFullscreen ? 'text-base' : 'text-xs'}`}>
              {brushSize}
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={clearCanvas}
              className={`bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:scale-95 transition-all font-medium ${
                isFullscreen ? 'px-6 py-3 text-base' : 'px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm'
              }`}
            >
              Clear
            </button>
            
            <button
              onClick={downloadDrawing}
              className={`bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:scale-95 transition-all font-medium ${
                isFullscreen ? 'px-6 py-3 text-base' : 'px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="text-center text-gray-500 text-sm mt-4">
          💡 Use your mouse or touch to draw • Pinch to zoom on mobile
        </div>
      )}
    </div>
  );
}