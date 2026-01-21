"use client";

import { useEffect, useRef, useState } from "react";

interface ScissorsDividerProps {
  fromTheme: "cream" | "black" | "red";
  toTheme: "cream" | "black" | "red";
}

const themeColors = {
  cream: { bg: "#F5F0E6", fg: "#1A1A1A" },
  black: { bg: "#1A1A1A", fg: "#F5F0E6" },
  red: { bg: "#CC0000", fg: "#F5F0E6" },
};

export function ScissorsDivider({ fromTheme, toTheme }: ScissorsDividerProps) {
  const [scissorsProgress, setScissorsProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  // Animate scissors slowly across the screen
  useEffect(() => {
    if (!hasStarted) return;
    
    let animationFrame: number;
    const duration = 3000; // 3 seconds for full animation
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth movement
      const eased = 1 - Math.pow(1 - progress, 3);
      setScissorsProgress(eased);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted]);

  const fromColors = themeColors[fromTheme];
  const toColors = themeColors[toTheme];
  
  // Scissors position based on progress
  const scissorsLeft = -10 + scissorsProgress * 120; // from -10% to 110%
  const cutProgress = scissorsProgress;

  return (
    <div
      ref={ref}
      className="relative h-[250px] md:h-[350px] overflow-hidden"
      style={{ backgroundColor: toColors.bg }}
    >
      {/* Top fabric being cut - reveals from left as scissors move */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: fromColors.bg,
          clipPath: `polygon(${cutProgress * 100}% 0, 100% 0, 100% 45%, ${cutProgress * 100}% 55%)`,
        }}
      />

      {/* Bottom fabric being cut */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: fromColors.bg,
          clipPath: `polygon(${cutProgress * 100}% 55%, 100% 45%, 100% 100%, ${cutProgress * 100}% 100%)`,
        }}
      />
      
      {/* Cut fabric pieces falling away */}
      <div
        className="absolute inset-0 transition-transform"
        style={{
          backgroundColor: fromColors.bg,
          clipPath: `polygon(0 0, ${cutProgress * 100}% 0, ${cutProgress * 100}% 55%, 0 45%)`,
          transform: `translateY(${cutProgress > 0.3 ? (cutProgress - 0.3) * -150 : 0}px) rotate(${cutProgress > 0.3 ? (cutProgress - 0.3) * -5 : 0}deg)`,
          transformOrigin: 'right center',
          transition: 'transform 0.3s ease-out',
        }}
      />
      
      <div
        className="absolute inset-0 transition-transform"
        style={{
          backgroundColor: fromColors.bg,
          clipPath: `polygon(0 55%, ${cutProgress * 100}% 45%, ${cutProgress * 100}% 100%, 0 100%)`,
          transform: `translateY(${cutProgress > 0.3 ? (cutProgress - 0.3) * 150 : 0}px) rotate(${cutProgress > 0.3 ? (cutProgress - 0.3) * 5 : 0}deg)`,
          transformOrigin: 'right center',
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Red cut line trail */}
      <div
        className="absolute h-2 z-10"
        style={{
          left: 0,
          right: `${100 - cutProgress * 100}%`,
          top: '50%',
          transform: 'translateY(-50%) rotate(5deg)',
          background: '#CC0000',
          boxShadow: '0 0 20px #CC0000',
        }}
      />

      {/* Large Scissors SVG */}
      <div
        className="absolute top-1/2 z-20"
        style={{
          left: `${scissorsLeft}%`,
          transform: 'translateY(-50%) translateX(-50%)',
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          fill="none"
          className="drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
          }}
        >
          {/* Top blade */}
          <path
            d="M85 45 L40 50 L15 35 L20 30 L45 42 L85 38 Z"
            fill={toColors.fg}
            stroke={toColors.fg}
            strokeWidth="1"
            style={{
              transform: hasStarted ? 'rotate(-5deg)' : 'rotate(-15deg)',
              transformOrigin: '40px 50px',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          {/* Bottom blade */}
          <path
            d="M85 55 L40 50 L15 65 L20 70 L45 58 L85 62 Z"
            fill={toColors.fg}
            stroke={toColors.fg}
            strokeWidth="1"
            style={{
              transform: hasStarted ? 'rotate(5deg)' : 'rotate(15deg)',
              transformOrigin: '40px 50px',
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          {/* Top handle ring */}
          <ellipse
            cx="12"
            cy="28"
            rx="10"
            ry="12"
            fill="none"
            stroke={toColors.fg}
            strokeWidth="4"
          />
          {/* Bottom handle ring */}
          <ellipse
            cx="12"
            cy="72"
            rx="10"
            ry="12"
            fill="none"
            stroke={toColors.fg}
            strokeWidth="4"
          />
          {/* Pivot screw */}
          <circle cx="40" cy="50" r="6" fill="#CC0000" />
          <circle cx="40" cy="50" r="3" fill={toColors.fg} />
        </svg>
      </div>

      {/* Fabric texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${fromColors.fg} 2px,
            ${fromColors.fg} 4px
          )`,
        }}
      />
    </div>
  );
}
