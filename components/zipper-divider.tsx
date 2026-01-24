"use client";

import { useEffect, useId, useRef, useState } from "react";

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
const OPEN_START = 0.05;
const OPEN_SLOPE_MAX = 24;
const OPEN_GAP_MAX = 20;
const TEETH_HEIGHT = 16;
const TEETH_PATTERN_WIDTH_CLOSED = 22;
const TEETH_PATTERN_WIDTH_OPEN = 18;

export function ZipperDivider({ fromTheme, toTheme }: ZipperDividerProps) {
  const [zipperProgress, setZipperProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 });
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);
  const sizeRef = useRef({ width: 1, height: 1 });

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (
        Math.abs(sizeRef.current.width - rect.width) > 0.5 ||
        Math.abs(sizeRef.current.height - rect.height) > 0.5
      ) {
        sizeRef.current = { width: rect.width, height: rect.height };
        setContainerSize(sizeRef.current);
      }
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

  const closedTeethColor = fromColors.fg;
  const openTeethColor = "#9A9A9A";
  const closedTeethShadow = hexToRgba(fromColors.fg, 0.25);
  const openTeethShadow = hexToRgba(openTeethColor, 0.25);
  const tapeColor = "transparent";
  const tapeEdge = "transparent";
  const sliderBody = "#1B1B1B";
  const sliderEdge = "#4B4B4B";
  const sliderSlot = "#E6E6E6";
  const sliderHighlight = "rgba(255,255,255,0.5)";

  const patternBaseId = useId().replace(/:/g, "");
  const sliderGradientId = `${patternBaseId}-slider-metal`;
  const sliderHighlightId = `${patternBaseId}-slider-highlight`;
  const openTopY = `calc(50% - ${openGap}px - ${TEETH_HEIGHT / 2}px)`;
  const openBottomY = `calc(50% + ${openGap}px - ${TEETH_HEIGHT / 2}px)`;
  const closedY = `calc(50% - ${TEETH_HEIGHT / 2}px)`;
  const openAngle =
    zipX <= 1 || containerSize.width <= 1
      ? 0
      : (Math.atan((openSlope * containerSize.height) / (zipX * containerSize.width)) *
          180) /
        Math.PI;

  const TeethRow = ({
    left,
    right,
    top,
    width,
    opacity = 1,
    variant,
    idSuffix,
    rotateDeg = 0,
    zIndex = 20,
  }: {
    left?: string;
    right?: string;
    top: string;
    width?: string;
    opacity?: number;
    variant: "open" | "closed";
    idSuffix: string;
    rotateDeg?: number;
    zIndex?: number;
  }) => {
    const patternId = `${patternBaseId}-teeth-${variant}-${idSuffix}`;
    const patternWidth =
      variant === "closed" ? TEETH_PATTERN_WIDTH_CLOSED : TEETH_PATTERN_WIDTH_OPEN;
    const toothColor = variant === "closed" ? closedTeethColor : openTeethColor;
    const toothShadow = variant === "closed" ? closedTeethShadow : openTeethShadow;
    const transforms: string[] = [];
    if (Math.abs(rotateDeg) > 0.1) {
      transforms.push(`rotate(${rotateDeg}deg)`);
    }

    return (
      <div
        className="absolute"
        style={{
          zIndex,
          left,
          right,
          top,
          width,
          height: `${TEETH_HEIGHT}px`,
          backgroundColor: tapeColor,
          borderTop: "none",
          borderBottom: "none",
          boxShadow: "none",
          opacity,
          transform: transforms.length ? transforms.join(" ") : undefined,
          transformOrigin: Math.abs(rotateDeg) > 0.1 ? "100% 50%" : undefined,
        }}
      >
        <svg width="100%" height="100%" aria-hidden="true" focusable="false">
          <defs>
            {variant === "closed" ? (
              <pattern
                id={patternId}
                width={patternWidth}
                height={TEETH_HEIGHT}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="1"
                  y="2"
                  width="9"
                  height="12"
                  rx="4"
                  fill={toothColor}
                  stroke={toothShadow}
                  strokeWidth="0.6"
                />
                <rect
                  x="12"
                  y="2"
                  width="9"
                  height="12"
                  rx="4"
                  fill={toothColor}
                  stroke={toothShadow}
                  strokeWidth="0.6"
                />
                <rect x="9" y="6" width="4" height="4" rx="2" fill={toothColor} />
              </pattern>
            ) : (
              <pattern
                id={patternId}
                width={patternWidth}
                height={TEETH_HEIGHT}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="12"
                  rx="4"
                  fill={toothColor}
                  stroke={toothShadow}
                  strokeWidth="0.6"
                />
                <rect
                  x="14"
                  y="5"
                  width="3"
                  height="6"
                  rx="1.5"
                  fill={toothColor}
                />
              </pattern>
            )}
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  };

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
        <TeethRow
          left="0"
          width={`${zipX}%`}
          top={openTopY}
          opacity={1}
          variant="open"
          idSuffix="open-top"
          rotateDeg={openAngle}
          zIndex={30}
        />
        <TeethRow
          left="0"
          width={`${zipX}%`}
          top={openBottomY}
          opacity={1}
          variant="open"
          idSuffix="open-bottom"
          rotateDeg={-openAngle}
          zIndex={30}
        />

        {/* Zipper teeth (closed row) */}
        <TeethRow
          left={`${zipX}%`}
          right="0"
          top={closedY}
          variant="closed"
          idSuffix="closed"
          zIndex={25}
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
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            style={{
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id={sliderGradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B3B3B" />
                <stop offset="45%" stopColor="#1B1B1B" />
                <stop offset="75%" stopColor="#2A2A2A" />
                <stop offset="100%" stopColor="#4A4A4A" />
              </linearGradient>
              <linearGradient id={sliderHighlightId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <rect
              x="20"
              y="30"
              width="52"
              height="40"
              rx="12"
              fill={`url(#${sliderGradientId})`}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <rect
              x="68"
              y="26"
              width="30"
              height="48"
              rx="15"
              fill={`url(#${sliderGradientId})`}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <rect
              x="42"
              y="68"
              width="16"
              height="16"
              rx="8"
              fill={`url(#${sliderGradientId})`}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <rect
              x="32"
              y="84"
              width="36"
              height="26"
              rx="13"
              fill={`url(#${sliderGradientId})`}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <circle cx="50" cy="97" r="6" fill={sliderSlot} />
            <rect x="34" y="38" width="20" height="24" rx="5" fill={sliderSlot} />
            <rect x="78" y="40" width="10" height="18" rx="5" fill={sliderSlot} />
            <path
              d="M24 34 L90 34"
              stroke={`url(#${sliderHighlightId})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
