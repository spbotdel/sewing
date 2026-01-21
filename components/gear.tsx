"use client";

import { useEffect, useState } from "react";

interface GearProps {
  size?: number;
  className?: string;
  reverse?: boolean;
  color?: string;
  speed?: number;
}

export function Gear({
  size = 100,
  className = "",
  reverse = false,
  color = "#1A1A1A",
  speed = 0.3,
}: GearProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      setRotation((prev) => prev + delta * speed * (reverse ? -1 : 1));
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reverse, speed]);

  const teeth = 12;
  const innerRadius = size * 0.3;
  const outerRadius = size * 0.45;
  const toothHeight = size * 0.1;

  const generateTeeth = () => {
    const path: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * 2 * Math.PI;
      const nextAngle = ((i + 0.5) / teeth) * 2 * Math.PI;
      const midAngle = ((i + 0.25) / teeth) * 2 * Math.PI;
      const endMidAngle = ((i + 0.75) / teeth) * 2 * Math.PI;

      const x1 = size / 2 + Math.cos(angle) * outerRadius;
      const y1 = size / 2 + Math.sin(angle) * outerRadius;
      const x2 = size / 2 + Math.cos(midAngle) * (outerRadius + toothHeight);
      const y2 = size / 2 + Math.sin(midAngle) * (outerRadius + toothHeight);
      const x3 = size / 2 + Math.cos(endMidAngle) * (outerRadius + toothHeight);
      const y3 = size / 2 + Math.sin(endMidAngle) * (outerRadius + toothHeight);
      const x4 = size / 2 + Math.cos(nextAngle) * outerRadius;
      const y4 = size / 2 + Math.sin(nextAngle) * outerRadius;

      if (i === 0) {
        path.push(`M ${x1} ${y1}`);
      }
      path.push(`L ${x2} ${y2}`);
      path.push(`L ${x3} ${y3}`);
      path.push(`L ${x4} ${y4}`);
    }
    path.push("Z");
    return path.join(" ");
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center",
        transition: "transform 0.1s linear",
      }}
    >
      <path d={generateTeeth()} fill={color} />
      <circle cx={size / 2} cy={size / 2} r={innerRadius} fill={color} />
      <circle cx={size / 2} cy={size / 2} r={innerRadius * 0.5} fill="#F5F0E6" />
    </svg>
  );
}
