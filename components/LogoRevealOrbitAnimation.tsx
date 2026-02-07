"use client";

import { useEffect, useRef, useState } from "react";

// SVG path for Palette Planet logo (simplified for animation)
const logoPath = "M50 10 C70 10, 90 30, 90 50 C90 70, 70 90, 50 90 C30 90, 10 70, 10 50 C10 30, 30 10, 50 10 Z M50 25 C60 25, 70 35, 70 50 C70 65, 60 75, 50 75 C40 75, 30 65, 30 50 C30 35, 40 25, 50 25 Z";

const colorSwatches = [
  { color: "#667eea", delay: 0 },
  { color: "#764ba2", delay: 0.2 },
  { color: "#f093fb", delay: 0.4 },
  { color: "#f5576c", delay: 0.6 },
  { color: "#4facfe", delay: 0.8 },
];

interface OrbitingBrand {
  src: string;
  size: number;
  orbitRadius: number;
  duration: number;
  delay: number;
  direction: "clockwise" | "counterclockwise";
}

const orbitingBrands: OrbitingBrand[] = [
  { src: "/logos/rolex.png", size: 36, orbitRadius: 120, duration: 18, delay: 0, direction: "clockwise" },
  { src: "/logos/gucci.png", size: 32, orbitRadius: 160, duration: 22, delay: 3, direction: "counterclockwise" },
  { src: "/logos/chanel.png", size: 34, orbitRadius: 200, duration: 26, delay: 6, direction: "clockwise" },
  { src: "/logos/dior.png", size: 30, orbitRadius: 240, duration: 30, delay: 9, direction: "counterclockwise" },
  { src: "/logos/versace.png", size: 33, orbitRadius: 280, duration: 34, delay: 12, direction: "clockwise" },
  { src: "/logos/hermes.png", size: 31, orbitRadius: 320, duration: 38, delay: 15, direction: "counterclockwise" },
];

export default function LogoRevealOrbitAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0);
  const [showSwatches, setShowSwatches] = useState(false);

  useEffect(() => {
    // Animate SVG path drawing
    const duration = 2000;
    const startTime = Date.now();
    
    const animateDraw = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDrawProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animateDraw);
      } else {
        setIsLoaded(true);
        setTimeout(() => setShowSwatches(true), 300);
      }
    };
    
    requestAnimationFrame(animateDraw);
  }, []);

  useEffect(() => {
    // Mouse parallax effect
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 30;
      const y = (e.clientY - rect.top - rect.height / 2) / 30;
      
      container.style.setProperty("--parallax-x", `${x}px`);
      container.style.setProperty("--parallax-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[700px] flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f2a 40%, #000000 100%)",
      }}
    >
      {/* Animated starfield */}
      <div className="absolute inset-0">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: Math.random() > 0.8 ? "#a78bfa" : "white",
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Central Planet with SVG Draw Animation */}
      <div 
        className="relative z-10"
        style={{
          transform: "translate(var(--parallax-x, 0), var(--parallax-y, 0))",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%)",
            width: "500px",
            height: "500px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* SVG Logo with draw animation */}
        <div className="relative w-40 h-40">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ transform: "rotate(-90deg)" }}
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="50%" stopColor="#764ba2" />
                <stop offset="100%" stopColor="#f093fb" />
              </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="url(#logoGradient)"
              opacity={drawProgress}
              style={{
                filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.8))",
              }}
            />
            
            {/* Animated path drawing */}
            <path
              d={logoPath}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: 500 * (1 - drawProgress),
                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
              }}
            />
            
            {/* Inner fill that fades in */}
            <path
              d={logoPath}
              fill="white"
              opacity={isLoaded ? 0.9 : 0}
              style={{
                transition: "opacity 0.5s ease-out",
              }}
            />
          </svg>

          {/* Color swatches that appear after draw */}
          {showSwatches && colorSwatches.map((swatch, index) => {
            const angle = (index / colorSwatches.length) * 360;
            const radius = 70;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: swatch.color,
                  left: `calc(50% + ${x}px - 8px)`,
                  top: `calc(50% + ${y}px - 8px)`,
                  boxShadow: `0 0 20px ${swatch.color}`,
                  animation: `swatchAppear 0.5s ease-out forwards`,
                  animationDelay: `${swatch.delay}s`,
                  opacity: 0,
                  transform: "scale(0)",
                }}
              />
            );
          })}

          {/* Rotating ring around logo */}
          <div 
            className="absolute inset-[-20px] rounded-full border-2 border-white/20"
            style={{
              animation: "spin 15s linear infinite",
              borderStyle: "dashed",
            }}
          />
          
          {/* Second counter-rotating ring */}
          <div 
            className="absolute inset-[-35px] rounded-full border border-purple-500/30"
            style={{
              animation: "spinReverse 20s linear infinite",
            }}
          />
        </div>

        {/* Text that appears after animation */}
        <div 
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
            transition: "all 0.8s ease-out 0.5s",
          }}
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">Palette Planet</h2>
          <p className="text-sm text-purple-300">559+ Brand Logos</p>
        </div>
      </div>

      {/* Orbiting luxury brands */}
      {isLoaded && orbitingBrands.map((brand, index) => (
        <div
          key={index}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: brand.orbitRadius * 2,
            height: brand.orbitRadius * 2,
            marginLeft: -brand.orbitRadius,
            marginTop: -brand.orbitRadius,
            animation: brand.direction === "clockwise" 
              ? `orbit ${brand.duration}s linear infinite`
              : `orbitReverse ${brand.duration}s linear infinite`,
            animationDelay: `${brand.delay}s`,
            opacity: 0,
            animationName: brand.direction === "clockwise" ? "orbit, fadeIn" : "orbitReverse, fadeIn",
            animationDuration: `${brand.duration}s, 1s`,
            animationTimingFunction: "linear, ease-out",
            animationIterationCount: "infinite, 1",
            animationFillMode: "forwards",
          }}
        >
          {/* Orbit trail */}
          <div 
            className="absolute inset-0 rounded-full border border-white/5"
            style={{
              boxShadow: "inset 0 0 20px rgba(139, 92, 246, 0.05)",
            }}
          />
          
          {/* Brand logo on orbit */}
          <div
            className="absolute flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 pointer-events-auto cursor-pointer transition-all hover:scale-125 hover:bg-white/20"
            style={{
              width: brand.size + 12,
              height: brand.size + 12,
              right: -(brand.size + 12) / 2,
              top: `calc(50% - ${(brand.size + 12) / 2}px)`,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)",
              animation: "counterRotate 20s linear infinite",
            }}
          >
            <img
              src={brand.src}
              alt="Brand"
              className="w-full h-full object-contain p-2"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
          </div>
        </div>
      ))}

      {/* Shooting star effect */}
      <div 
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          animation: "shootingStar 3s linear infinite",
          animationDelay: "2s",
          opacity: 0,
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbitReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes swatchAppear {
          0% { 
            opacity: 0; 
            transform: scale(0) rotate(-180deg); 
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(0deg);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shootingStar {
          0% {
            transform: translateX(-100px) translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
