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

const SCISSORS_PROGRESS_BOOST = 1;
const SCISSORS_PROGRESS_OFFSET = 0;
const SCISSORS_PROGRESS_EASING = 1.2;
const SCISSORS_START_DELAY = 0.2;
const SCISSORS_PIVOT_PERCENT = 40;
const CUT_LINE_Y_LEFT = -70;
const CUT_LINE_Y_RIGHT = 170;
const CUT_PIVOT_Y = 50;
const CUT_OVERLAP = 0;
const SPLIT_START = 0.12;
const SPLIT_ROTATE_MAX = 0;
const SNIP_COUNT = 3;
const BLADE_MIN_ANGLE = 1;
const BLADE_MAX_ANGLE = 30;
const HANDLE_COLOR = "#121212";
const HANDLE_HIGHLIGHT = "#2C2C2C";
const BLADE_LIGHT = "#E6E6E6";
const BLADE_MID = "#BDBDBD";
const BLADE_DARK = "#8A8A8A";
const BLADE_EDGE = "#5A5A5A";
const PIVOT_OUTER = "#B00000";
const PIVOT_INNER = "#E6E6E6";

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
      const easedProgress = Math.pow(clampedProgress, SCISSORS_PROGRESS_EASING);
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
  const splitRotate = splitProgress * SPLIT_ROTATE_MAX;
  const cutXOverlapMin = clamp(cutX - CUT_OVERLAP, 0, 100);
  const snipPhase = Math.sin(scissorsProgress * Math.PI * SNIP_COUNT);
  const snip = (snipPhase + 1) / 2;
  const bladeAngle =
    BLADE_MIN_ANGLE + (BLADE_MAX_ANGLE - BLADE_MIN_ANGLE) * (1 - snip);
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
            clipPath: `polygon(0 0, ${cutX}% 0, ${cutX}% ${CUT_PIVOT_Y}%, 0 ${CUT_LINE_Y_LEFT}%)`,
            transform: `rotate(${-splitRotate}deg)`,
            transformOrigin: `${cutX}% ${CUT_PIVOT_Y}%`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: fromColors.bg,
              backgroundImage: fabricTexture,
              backgroundPosition: "0 0",
              transform: `rotate(${splitRotate}deg)`,
              transformOrigin: `${cutX}% ${CUT_PIVOT_Y}%`,
            }}
          />
        </div>

        {/* Bottom fabric piece */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            clipPath: `polygon(0 ${CUT_LINE_Y_RIGHT}%, ${cutX}% ${CUT_PIVOT_Y}%, ${cutX}% 100%, 0 100%)`,
            transform: `rotate(${splitRotate}deg)`,
            transformOrigin: `${cutX}% ${CUT_PIVOT_Y}%`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: fromColors.bg,
              backgroundImage: fabricTexture,
              backgroundPosition: "0 0",
              transform: `rotate(${-splitRotate}deg)`,
              transformOrigin: `${cutX}% ${CUT_PIVOT_Y}%`,
            }}
          />
        </div>

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
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient
                id="scissorsBladeGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={BLADE_LIGHT} />
                <stop offset="55%" stopColor={BLADE_MID} />
                <stop offset="100%" stopColor={BLADE_DARK} />
              </linearGradient>
            </defs>

            <g
              style={{
                transform: `rotate(${-bladeAngle}deg)`,
                transformOrigin: "40px 50px",
                transition: "transform 0.18s ease-out",
              }}
            >
              {/* Top blade */}
              <path
                d="M26 32 L44 44 L96 40 L94 44 L46 52 L28 36 Z"
                fill="url(#scissorsBladeGradient)"
                stroke={BLADE_EDGE}
                strokeWidth="0.9"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Top handle ring */}
              <circle
                cx="20"
                cy="22"
                r="10"
                fill="none"
                stroke={HANDLE_COLOR}
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="22"
                r="6.5"
                fill="none"
                stroke={HANDLE_HIGHLIGHT}
                strokeWidth="1.2"
                opacity="0.7"
              />
            </g>

            <g
              style={{
                transform: `rotate(${bladeAngle}deg)`,
                transformOrigin: "40px 50px",
                transition: "transform 0.18s ease-out",
              }}
            >
              {/* Bottom blade */}
              <path
                d="M26 68 L44 56 L96 60 L94 56 L46 48 L28 64 Z"
                fill="url(#scissorsBladeGradient)"
                stroke={BLADE_EDGE}
                strokeWidth="0.9"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Bottom handle ring */}
              <circle
                cx="20"
                cy="78"
                r="10"
                fill="none"
                stroke={HANDLE_COLOR}
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="78"
                r="6.5"
                fill="none"
                stroke={HANDLE_HIGHLIGHT}
                strokeWidth="1.2"
                opacity="0.7"
              />
            </g>
            {/* Pivot screw */}
            <circle cx="40" cy="50" r="6" fill={PIVOT_OUTER} />
            <circle cx="40" cy="50" r="3" fill={PIVOT_INNER} />
          </svg>
        </div>

      </div>
    </div>
  );
}
