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

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const parsed = parseInt(normalized, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SCISSORS_PROGRESS_BOOST = 1.3;
const SCISSORS_PROGRESS_OFFSET = 0.02;

export function ScissorsDivider({ fromTheme, toTheme }: ScissorsDividerProps) {
  const [scissorsProgress, setScissorsProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const total = viewportHeight + rect.height;
      const rawProgress = (viewportHeight - rect.top) / total;
      const clampedProgress = clamp(rawProgress, 0, 1);
      const easedProgress = 1 - Math.pow(1 - clampedProgress, 2);
      const boostedProgress = clamp(
        easedProgress * SCISSORS_PROGRESS_BOOST + SCISSORS_PROGRESS_OFFSET,
        0,
        1
      );
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - viewportHeight
      );
      const atBottom = window.scrollY >= maxScroll - 2;
      setScissorsProgress(atBottom ? 1 : boostedProgress);

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (Math.abs(delta) > 2) {
        setScrollDirection(delta > 0 ? "down" : "up");
      }
      lastScrollY.current = currentY;
    };

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const fromColors = themeColors[fromTheme];
  const toColors = themeColors[toTheme];
  
  const bladesOpen = scissorsProgress > 0.02;
  const reverse = scrollDirection === "up";

  const cutProgress = scissorsProgress;
  const cutX = cutProgress * 100;
  const lineYLeft = 44;
  const lineYRight = 56;
  const lineYAtCut =
    lineYLeft + (lineYRight - lineYLeft) * cutProgress;
  const splitProgress = Math.max(0, cutProgress - 0.08);
  const splitDistance = splitProgress * 150;
  const splitRotate = splitProgress * 6;
  const textureColor = hexToRgba(fromColors.fg, 0.18);
  const fabricTexture = `repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    ${textureColor} 2px,
    ${textureColor} 4px
  )`;
  const lineThickness = 0.8;
  const lineClip = `polygon(
    0 ${lineYLeft - lineThickness}%,
    ${cutX}% ${lineYAtCut - lineThickness}%,
    ${cutX}% ${lineYAtCut + lineThickness}%,
    0 ${lineYLeft + lineThickness}%
  )`;

  // Scissors position based on progress
  const scissorsLeft = -5 + scissorsProgress * 110; // from -5% to 105%

  return (
    <div
      ref={ref}
      className="relative h-[250px] md:h-[350px] -my-[125px] md:-my-[175px] pointer-events-none z-20"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: toColors.bg }}
      >
        {/* Uncut fabric on the right */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(${cutX}% 0, 100% 0, 100% 100%, ${cutX}% 100%)`,
          }}
        />

        {/* Top fabric piece moving away */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(0 0, ${cutX}% 0, ${cutX}% ${lineYAtCut}%, 0 ${lineYLeft}%)`,
            transform: `translateY(${-splitDistance}px) rotate(${-splitRotate}deg)`,
            transformOrigin: "right center",
            transition: "transform 0.25s ease-out",
          }}
        />

        {/* Bottom fabric piece moving away */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(0 ${lineYLeft}%, ${cutX}% ${lineYAtCut}%, ${cutX}% 100%, 0 100%)`,
            transform: `translateY(${splitDistance}px) rotate(${splitRotate}deg)`,
            transformOrigin: "right center",
            transition: "transform 0.25s ease-out",
          }}
        />

        {/* Cut glow */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(204,0,0,0.9), rgba(204,0,0,0.05))",
            clipPath: lineClip,
            filter: "drop-shadow(0 0 14px rgba(204,0,0,0.4))",
          }}
        />

        {/* Large Scissors SVG */}
        <div
          className="absolute top-1/2 z-20"
          style={{
            left: `${scissorsLeft}%`,
            transform: `translate(-50%, -50%) rotate(${reverse ? 180 : 0}deg)`,
          }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 100 100"
            fill="none"
            className="drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
            }}
          >
            {/* Top blade */}
            <path
              d="M90 43 L58 48 L40 46 L22 32 L28 28 L46 38 L60 41 L90 39 Z"
              fill={toColors.fg}
              stroke={toColors.fg}
              strokeWidth="1"
              strokeLinejoin="round"
              style={{
                transform: bladesOpen ? "rotate(-5deg)" : "rotate(-15deg)",
                transformOrigin: "40px 50px",
                transition: "transform 0.3s ease-in-out",
              }}
            />
            {/* Bottom blade */}
            <path
              d="M90 57 L60 52 L46 54 L22 68 L28 72 L40 62 L58 59 L90 61 Z"
              fill={toColors.fg}
              stroke={toColors.fg}
              strokeWidth="1"
              strokeLinejoin="round"
              style={{
                transform: bladesOpen ? "rotate(5deg)" : "rotate(15deg)",
                transformOrigin: "40px 50px",
                transition: "transform 0.3s ease-in-out",
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

      </div>
    </div>
  );
}
