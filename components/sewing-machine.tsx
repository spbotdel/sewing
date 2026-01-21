"use client";

import { useEffect, useRef, useState } from "react";

interface SewingMachineProps {
  className?: string;
  color?: string;
}

export function SewingMachine({ className = "", color = "#1A1A1A" }: SewingMachineProps) {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate needle based on scroll
  const needleY = Math.sin(scrollY * 0.05) * 8;

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 200 150"
        fill="none"
        className="w-full h-full"
      >
        {/* Machine base */}
        <rect x="20" y="100" width="160" height="30" fill={color} />
        
        {/* Machine body */}
        <path
          d="M30 100 L30 50 L80 30 L80 50 L150 50 L170 70 L170 100 Z"
          fill={color}
        />
        
        {/* Wheel */}
        <g style={{ transform: `rotate(${scrollY * 0.5}deg)`, transformOrigin: "155px 70px" }}>
          <circle cx="155" cy="70" r="20" fill="none" stroke={color} strokeWidth="6" />
          <line x1="155" y1="50" x2="155" y2="90" stroke={color} strokeWidth="3" />
          <line x1="135" y1="70" x2="175" y2="70" stroke={color} strokeWidth="3" />
        </g>
        
        {/* Spool holder */}
        <rect x="45" y="25" width="8" height="25" fill={color} />
        <ellipse cx="49" cy="20" rx="12" ry="8" fill={color} />
        
        {/* Needle arm */}
        <rect x="75" y="45" width="40" height="8" fill={color} />
        
        {/* Needle */}
        <g style={{ transform: `translateY(${needleY}px)` }}>
          <rect x="110" y="53" width="4" height="35" fill={color} />
          <path d="M112 88 L108 95 L116 95 Z" fill={color} />
        </g>
        
        {/* Thread from spool to needle */}
        <path
          d={`M49 28 Q60 40 85 48 Q100 52 112 ${53 + needleY}`}
          stroke="#CC0000"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Presser foot */}
        <rect x="100" y="90" width="30" height="5" fill={color} />
        
        {/* Fabric being sewn */}
        <g>
          <rect x="60" y="95" width="100" height="5" fill="#E8E0D0" />
          {/* Stitch marks */}
          {[...Array(10)].map((_, i) => (
            <line
              key={i}
              x1={70 + i * 8}
              y1="95"
              x2={74 + i * 8}
              y2="100"
              stroke="#CC0000"
              strokeWidth="1.5"
            />
          ))}
        </g>
        
        {/* Control panel */}
        <rect x="130" y="60" width="15" height="20" fill="#CC0000" />
        
        {/* Decorative line */}
        <line x1="35" y1="80" x2="90" y2="80" stroke="#CC0000" strokeWidth="3" />
      </svg>
    </div>
  );
}
