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

const SCISSORS_PROGRESS_BOOST = 1.45;
const SCISSORS_PROGRESS_OFFSET = 0.03;
const SCISSORS_START_DELAY = 0.38;
const SCISSORS_PIVOT_PERCENT = 25;
const CUT_LINE_Y_LEFT = 20;
const CUT_LINE_Y_RIGHT = 80;
const CUT_PIVOT_Y = 50;
const CUT_OVERLAP = 2;
const SPLIT_START = 0.12;
const SPLIT_SHIFT_Y = 90;
const SNIP_COUNT = 6;
const BLADE_BASE_ANGLE = 4;
const BLADE_SWING = 10;

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

  const reverse = scrollDirection === "up";

  const cutProgress = clamp(
    (scissorsProgress - SCISSORS_START_DELAY) / (1 - SCISSORS_START_DELAY),
    0,
    1
  );
  const cutX = cutProgress * 100;
  const splitProgress = clamp(
    (cutProgress - SPLIT_START) / (1 - SPLIT_START),
    0,
    1
  );
  const splitShiftY = splitProgress * SPLIT_SHIFT_Y;
  const cutXOverlapMin = clamp(cutX - CUT_OVERLAP, 0, 100);
  const cutXOverlapMax = clamp(cutX + CUT_OVERLAP, 0, 100);
  const snip = (Math.sin(cutProgress * Math.PI * SNIP_COUNT) + 1) / 2;
  const bladeAngle = BLADE_BASE_ANGLE + BLADE_SWING * snip;
  const textureColor = hexToRgba(fromColors.fg, 0.18);
  const fabricTexture = `repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    ${textureColor} 2px,
    ${textureColor} 4px
  )`;

  // Scissors position based on progress
  const scissorsLeft = cutX;

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
            clipPath: `polygon(${cutXOverlapMin}% 0, 100% 0, 100% 100%, ${cutXOverlapMin}% 100%)`,
          }}
        />

        {/* Top fabric piece */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(0 0, ${cutXOverlapMax}% 0, ${cutXOverlapMax}% ${CUT_PIVOT_Y}%, 0 ${CUT_LINE_Y_LEFT}%)`,
            transform: `translateY(${-splitShiftY}px)`,
            transition: "transform 0.2s ease-out",
          }}
        />

        {/* Bottom fabric piece */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(0 ${CUT_LINE_Y_RIGHT}%, ${cutXOverlapMax}% ${CUT_PIVOT_Y}%, ${cutXOverlapMax}% 100%, 0 100%)`,
            transform: `translateY(${splitShiftY}px)`,
            transition: "transform 0.2s ease-out",
          }}
        />

        {/* Large Scissors SVG */}
        <div
          className="absolute top-1/2 z-20"
          style={{
            left: `${scissorsLeft}%`,
            transform: `translate(-${SCISSORS_PIVOT_PERCENT}%, -50%) rotate(${reverse ? 180 : 0}deg)`,
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
              d="M94 44 L60 48 L44 46 L26 34 L30 30 L46 37 L62 40 L94 39 Z"
              fill={toColors.fg}
              stroke={toColors.fg}
              strokeWidth="0.8"
              strokeLinejoin="round"
              style={{
                transform: `rotate(${-bladeAngle}deg)`,
                transformOrigin: "40px 50px",
                transition: "transform 0.2s ease-out",
              }}
            />
            {/* Bottom blade */}
            <path
              d="M94 56 L62 52 L46 54 L26 66 L30 70 L44 63 L60 60 L94 61 Z"
              fill={toColors.fg}
              stroke={toColors.fg}
              strokeWidth="0.8"
              strokeLinejoin="round"
              style={{
                transform: `rotate(${bladeAngle}deg)`,
                transformOrigin: "40px 50px",
                transition: "transform 0.2s ease-out",
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
