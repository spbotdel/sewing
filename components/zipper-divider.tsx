"use client";

import { useEffect, useRef, useState } from "react";

interface ZipperDividerProps {
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

const ZIPPER_PROGRESS_BOOST = 1.15;
const ZIPPER_PROGRESS_OFFSET = 0;
const ZIPPER_PROGRESS_EASING = 1.15;
const ZIPPER_START_DELAY = 0.06;
const ZIPPER_MIN_X = 4;
const ZIPPER_MAX_X = 96;
const OPEN_START = 0.08;
const OPEN_SLOPE_MAX = 18;
const OPEN_GAP_MAX = 18;
const TEETH_HEIGHT = 10;

export function ZipperDivider({ fromTheme, toTheme }: ZipperDividerProps) {
  const [zipperProgress, setZipperProgress] = useState(0);
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
      const easedProgress = Math.pow(clampedProgress, ZIPPER_PROGRESS_EASING);
      const boostedProgress = clamp(
        easedProgress * ZIPPER_PROGRESS_BOOST + ZIPPER_PROGRESS_OFFSET,
        0,
        1
      );
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - viewportHeight
      );
      const atBottom = window.scrollY >= maxScroll - 2;
      setZipperProgress(atBottom ? 1 : boostedProgress);

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

  const zipProgress = clamp(
    (zipperProgress - ZIPPER_START_DELAY) / (1 - ZIPPER_START_DELAY),
    0,
    1
  );
  const zipX = ZIPPER_MIN_X + (ZIPPER_MAX_X - ZIPPER_MIN_X) * zipProgress;
  const openProgress = clamp((zipProgress - OPEN_START) / (1 - OPEN_START), 0, 1);
  const openSlope = openProgress * OPEN_SLOPE_MAX;
  const openGap = openProgress * OPEN_GAP_MAX;

  const topSeam = 50 - openSlope;
  const bottomSeam = 50 + openSlope;

  const textureColor = hexToRgba(fromColors.fg, 0.18);
  const fabricTexture = `repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    ${textureColor} 2px,
    ${textureColor} 4px
  )`;

  const teethColor = hexToRgba(fromColors.fg, 0.78);
  const teethShadow = hexToRgba(fromColors.fg, 0.35);
  const tapeColor = hexToRgba(fromColors.fg, 0.18);
  const sliderBody = fromColors.fg;
  const sliderEdge = hexToRgba(fromColors.fg, 0.7);
  const sliderSlot = hexToRgba(fromColors.bg, 0.92);
  const sliderHighlight = hexToRgba(fromColors.bg, 0.5);

  const teethPattern = `repeating-linear-gradient(90deg, ${teethColor} 0 7px, transparent 7px 12px)`;
  const openTopY = `calc(50% - ${openGap}px - ${TEETH_HEIGHT / 2}px)`;
  const openBottomY = `calc(50% + ${openGap}px - ${TEETH_HEIGHT / 2}px)`;
  const closedY = `calc(50% - ${TEETH_HEIGHT / 2}px)`;

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
        {/* Closed fabric on the right */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: fromColors.bg,
            backgroundImage: fabricTexture,
            backgroundPosition: "0 0",
            clipPath: `polygon(${zipX}% 0, 100% 0, 100% 100%, ${zipX}% 100%)`,
          }}
        />

        {/* Top fabric piece */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            clipPath: `polygon(0 0, ${zipX}% 0, ${zipX}% 50%, 0 ${topSeam}%)`,
            transform: `translateY(${-openGap}px)`,
            transformOrigin: `${zipX}% 50%`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: fromColors.bg,
              backgroundImage: fabricTexture,
              backgroundPosition: "0 0",
            }}
          />
        </div>

        {/* Bottom fabric piece */}
        <div
          className="absolute inset-0 transition-transform"
          style={{
            clipPath: `polygon(0 ${bottomSeam}%, ${zipX}% 50%, ${zipX}% 100%, 0 100%)`,
            transform: `translateY(${openGap}px)`,
            transformOrigin: `${zipX}% 50%`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: fromColors.bg,
              backgroundImage: fabricTexture,
              backgroundPosition: "0 0",
            }}
          />
        </div>

        {/* Zipper teeth (open rows) */}
        <div
          className="absolute z-20"
          style={{
            left: 0,
            width: `${zipX}%`,
            top: openTopY,
            height: `${TEETH_HEIGHT}px`,
            backgroundColor: tapeColor,
            backgroundImage: teethPattern,
            boxShadow: `0 1px 2px ${teethShadow}`,
            opacity: openProgress,
          }}
        />
        <div
          className="absolute z-20"
          style={{
            left: 0,
            width: `${zipX}%`,
            top: openBottomY,
            height: `${TEETH_HEIGHT}px`,
            backgroundColor: tapeColor,
            backgroundImage: teethPattern,
            boxShadow: `0 1px 2px ${teethShadow}`,
            opacity: openProgress,
          }}
        />

        {/* Zipper teeth (closed row) */}
        <div
          className="absolute z-20"
          style={{
            left: `${zipX}%`,
            right: 0,
            top: closedY,
            height: `${TEETH_HEIGHT}px`,
            backgroundColor: tapeColor,
            backgroundImage: teethPattern,
            boxShadow: `0 1px 2px ${teethShadow}`,
          }}
        />

        {/* Zipper slider */}
        <div
          className="absolute top-1/2 z-30"
          style={{
            left: `${zipX}%`,
            transform: `translate(-50%, -50%) rotate(${reverse ? 180 : 0}deg)`,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            style={{
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
              overflow: "visible",
            }}
          >
            <path
              d="M50 14
                 Q56 14 56 20
                 L56 42
                 Q56 48 50 48
                 L28 48
                 L14 34
                 Q12 32 14 30
                 L28 14
                 Z"
              fill={sliderBody}
              stroke={sliderEdge}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M26 22 L16 32 L26 42 L34 42 L34 22 Z"
              fill={sliderSlot}
            />
            <rect x="32" y="20" width="18" height="16" rx="5" fill={sliderSlot} />
            <path
              d="M30 18 L52 18"
              stroke={sliderHighlight}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect x="36" y="44" width="8" height="8" rx="2" fill={sliderEdge} />
            <rect
              x="30"
              y="52"
              width="20"
              height="10"
              rx="5"
              fill="none"
              stroke={sliderEdge}
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
