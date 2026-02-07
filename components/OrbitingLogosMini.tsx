"use client";

import { useEffect, useRef, useState } from "react";

export default function OrbitingLogosMini() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const logos = [
    { src: "/logos/rolex.png", delay: 0, duration: 15 },
    { src: "/logos/gucci.png", delay: 2.5, duration: 18 },
    { src: "/logos/chanel.png", delay: 5, duration: 21 },
    { src: "/logos/dior.png", delay: 7.5, duration: 24 },
    { src: "/logos/versace.png", delay: 10, duration: 27 },
    { src: "/logos/hermes.png", delay: 12.5, duration: 30 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-80 h-80 mx-auto"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-out",
      }}
    >
      {/* Central Planet Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)",
            animation: "planetFloat 3s ease-in-out infinite",
          }}
        >
          <img
            src="/logos/palette-planet-icon.svg"
            alt="Palette Planet"
            className="w-14 h-14 object-contain"
          />
          
          {/* Pulse rings */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-purple-400/30"
            style={{ animation: "pulseRing 2s ease-out infinite" }}
          />
          <div 
            className="absolute inset-0 rounded-full border-2 border-purple-400/20"
            style={{ animation: "pulseRing 2s ease-out infinite 0.5s" }}
          />
        </div>
      </div>

      {/* Orbiting logos */}
      {logos.map((logo, index) => {
        const angle = (index / logos.length) * 360;
        const radius = 130;
        
        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2"
            style={{
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
              animation: `orbit ${logo.duration}s linear infinite`,
              animationDelay: `${logo.delay}s`,
            }}
          >
            {/* Logo on orbit */}
            <div
              className="absolute w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20 cursor-pointer"
              style={{
                right: -24,
                top: `calc(50% - 24px)`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={logo.src}
                alt="Brand"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        );
      })}

      {/* Orbit trails */}
      <div 
        className="absolute left-1/2 top-1/2 rounded-full border border-purple-500/10"
        style={{
          width: 260,
          height: 260,
          marginLeft: -130,
          marginTop: -130,
        }}
      />

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes planetFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
