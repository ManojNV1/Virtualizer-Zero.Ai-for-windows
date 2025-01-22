import React, { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 900;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Wave configuration
    const waves = 5;
    const lines = 1000;
    const step = canvas.width / lines;

    const waveColors = [
      'hsl(190, 95%, 60%)', // Cyan
      'hsl(250, 90%, 55%)', // Blue-Purple
      'hsl(280, 90%, 55%)', // Purple
      'hsl(310, 85%, 50%)', // Magenta
      'hsl(330, 85%, 50%)'  // Pink
    ];

    const waveData = Array(waves).fill(null).map((_, index) => ({
      heights: Array(lines).fill(40),
      targetHeights: Array(lines).fill(40),
      color: waveColors[index],
      phase: (index * Math.PI * 2) / waves,
      speed: 0.002 + (index * 0.0004),
      amplitude: 25 - (index * 2),
      wavelength: 0.015 - (index * 0.001),
      lineWidth: 8 - (index * 0.5)
    }));

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      waveData.forEach((wave, waveIndex) => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;
        ctx.globalAlpha = 0.3;

        wave.targetHeights.forEach((_, i) => {
          const x = i * step;
          const baseHeight = wave.amplitude + 
            Math.sin(time * wave.speed + x * wave.wavelength + wave.phase) * wave.amplitude * 1.2;
          wave.targetHeights[i] = baseHeight;
        });

        wave.heights.forEach((height, i) => {
          wave.heights[i] += (wave.targetHeights[i] - height) * 0.1;
        });

        ctx.beginPath();
        const baseY = canvas.height - 200; // All waves now share the same base Y position

        wave.heights.forEach((height, i) => {
          const x = i * step;
          const waveOffset = Math.sin(time * wave.speed + i * wave.wavelength + wave.phase) * 20;
          const y = baseY + waveOffset - height;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            const prevX = (i - 1) * step;
            const prevWaveOffset = Math.sin(time * wave.speed + (i - 1) * wave.wavelength + wave.phase) * 20;
            const prevY = baseY + prevWaveOffset - wave.heights[i - 1];
            
            const cp1x = prevX + (x - prevX) / 2;
            const cp1y = prevY;
            const cp2x = prevX + (x - prevX) / 2;
            const cp2y = y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
          }
        });

        ctx.stroke();
      });

      // Subtle particles
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * canvas.width;
        const baseY = canvas.height - 200;
        const waveOffset = Math.sin(time * 0.5 + x * 0.01) * 20;
        const y = baseY + waveOffset - Math.random() * 80;
        const size = 1.5 + Math.sin(time + i) * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(280, 95%, 70%, ${0.15 + Math.sin(time + i) * 0.05})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-end overflow-hidden">
      <div className="relative w-full h-[900px]">
        <canvas
          ref={canvasRef}
          className="w-full"
        />
        <div className="absolute bottom-60 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-cyan-500/20 to-pink-600/20 backdrop-blur-sm rounded-full p-6 shadow-lg shadow-pink-500/10 animate-bounce">
            <Mic className="w-10 h-10 text-white/70" />
          </div>
        </div>
        <h1 className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 z-10">
          Zero.AI
        </h1>
      </div>
    </div>
  );
}

export default App;