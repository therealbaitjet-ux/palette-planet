"use client";

import { useEffect, useRef } from "react";

interface OrbitingLogo {
  src: string;
  size: number;
  orbitRadius: number;
  duration: number;
  delay: number;
  direction: "clockwise" | "counterclockwise";
}

const orbitingLogos: OrbitingLogo[] = [
  { src: "/logos/rolex.png", size: 40, orbitRadius: 140, duration: 20, delay: 0, direction: "clockwise" },
  { src: "/logos/gucci.png", size: 35, orbitRadius: 180, duration: 25, delay: 2, direction: "counterclockwise" },
  { src: "/logos/chanel.png", size: 38, orbitRadius: 220, duration: 30, delay: 4, direction: "clockwise" },
  { src: "/logos/dior.png", size: 32, orbitRadius: 260, duration: 35, delay: 6, direction: "counterclockwise" },
  { src: "/logos/versace.png", size: 36, orbitRadius: 300, duration: 40, delay: 8, direction: "clockwise" },
  { src: "/logos/hermes.png", size: 34, orbitRadius: 340, duration: 45, delay: 10, direction: "counterclockwise" },
];

export default function OrbitingHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add glow effect on mouse move
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 50%, #000000 100%)",
      }}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Central Palette Planet Logo */}
      <div className="relative z-10">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
            width: "400px",
            height: "400px",
          }}
        />
        
        {/* Main logo container with rotation */}
        <div 
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            boxShadow: "0 0 60px rgba(139, 92, 246, 0.5), inset 0 0 60px rgba(255,255,255,0.1)",
            animation: "planetPulse 4s ease-in-out infinite",
          }}
        >
          <img
            src="/logos/palette-planet-icon.svg"
            alt="Palette Planet"
            className="w-20 h-20 object-contain drop-shadow-2xl"
          />
          
          {/* Inner rotating ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-white/20"
            style={{
              animation: "spin 10s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Orbiting logos */}
      {orbitingLogos.map((logo, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: logo.orbitRadius * 2,
            height: logo.orbitRadius * 2,
            animation: `orbit${logo.direction === "clockwise" ? "" : "Reverse"} ${logo.duration}s linear infinite`,
            animationDelay: `${logo.delay}s`,
          }}
        >
          {/* Orbit trail */}
          <div 
            className="absolute inset-0 rounded-full border border-white/5"
            style={{
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.1)",
            }}
          />
          
          {/* Orbiting logo */}
          <div
            className="absolute flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-transform hover:scale-125 cursor-pointer"
            style={{
              width: logo.size + 16,
              height: logo.size + 16,
              right: - (logo.size + 16) / 2,
              top: `calc(50% - ${(logo.size + 16) / 2}px)`,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <img
              src={logo.src}
              alt="Brand"
              className="w-full h-full object-contain p-2"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
          </div>
        </div>
      ))}

      {/* Mouse-following glow */}
      <div 
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          transform: "translate(calc(var(--mouse-x, 0px) - 50%), calc(var(--mouse-y, 0px) - 50%))",
          left: "50%",
          top: "50%",
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes orbitclockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbitcounterclockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes planetPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 60px rgba(139, 92, 246, 0.5), inset 0 0 60px rgba(255,255,255,0.1);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 80px rgba(139, 92, 246, 0.7), inset 0 0 80px rgba(255,255,255,0.15);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
