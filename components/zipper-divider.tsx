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

  const teethColor = hexToRgba(fromColors.fg, 1);
  const teethShadow = hexToRgba(fromColors.fg, 0.35);
  const tapeColor = "transparent";
  const tapeEdge = "transparent";
  const sliderBody = fromColors.fg;
  const sliderEdge = hexToRgba(fromColors.fg, 0.7);
  const sliderSlot = hexToRgba(fromColors.bg, 0.92);
  const sliderHighlight = hexToRgba(fromColors.bg, 0.5);

  const patternBaseId = useId().replace(/:/g, "");
  const openTopY = `calc(50% - ${openGap}px)`;
  const openBottomY = `calc(50% + ${openGap}px)`;
  const closedY = `calc(50% - ${TEETH_HEIGHT / 2}px)`;
  const closedTeethShadow = "none";
  const openTeethShadow = "none";
  const openAngle = openProgress * 12;

  const TeethRow = ({
    left,
    right,
    top,
    width,
    opacity = 1,
    variant,
    idSuffix,
    rotateDeg = 0,
    centered = false,
  }: {
    left?: string;
    right?: string;
    top: string;
    width?: string;
    opacity?: number;
    variant: "open" | "closed";
    idSuffix: string;
    rotateDeg?: number;
    centered?: boolean;
  }) => {
    const patternId = `${patternBaseId}-teeth-${variant}-${idSuffix}`;
    const patternWidth =
      variant === "closed" ? TEETH_PATTERN_WIDTH_CLOSED : TEETH_PATTERN_WIDTH_OPEN;
    const transforms: string[] = [];
    if (centered) {
      transforms.push("translateY(-50%)");
    }
    if (Math.abs(rotateDeg) > 0.1) {
      transforms.push(`rotate(${rotateDeg}deg)`);
    }

    return (
      <div
        className="absolute z-20"
        style={{
          left,
          right,
          top,
          width,
          height: `${TEETH_HEIGHT}px`,
          backgroundColor: tapeColor,
          borderTop: "none",
          borderBottom: "none",
          boxShadow: variant === "closed" ? closedTeethShadow : openTeethShadow,
          opacity,
          transform: transforms.length ? transforms.join(" ") : undefined,
          transformOrigin: centered ? "100% 50%" : undefined,
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
                  fill={teethColor}
                  stroke={teethShadow}
                  strokeWidth="0.6"
                />
                <rect
                  x="12"
                  y="2"
                  width="9"
                  height="12"
                  rx="4"
                  fill={teethColor}
                  stroke={teethShadow}
                  strokeWidth="0.6"
                />
                <rect x="9" y="6" width="4" height="4" rx="2" fill={teethColor} />
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
                  fill={teethColor}
                  stroke={teethShadow}
                  strokeWidth="0.6"
                />
                <rect
                  x="14"
                  y="5"
                  width="3"
                  height="6"
                  rx="1.5"
                  fill={teethColor}
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
          opacity={openProgress}
          variant="open"
          idSuffix="open-top"
          rotateDeg={-openAngle}
          centered
        />
        <TeethRow
          left="0"
          width={`${zipX}%`}
          top={openBottomY}
          opacity={openProgress}
          variant="open"
          idSuffix="open-bottom"
          rotateDeg={openAngle}
          centered
        />

        {/* Zipper teeth (closed row) */}
        <TeethRow
          left={`${zipX}%`}
          right="0"
          top={closedY}
          variant="closed"
          idSuffix="closed"
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
            width="110"
            height="70"
            viewBox="0 0 110 70"
            fill="none"
            style={{
              overflow: "visible",
            }}
          >
            <rect
              x="10"
              y="20"
              width="48"
              height="30"
              rx="2"
              fill={sliderBody}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <rect
              x="54"
              y="16"
              width="42"
              height="38"
              rx="19"
              fill={sliderBody}
              stroke={sliderEdge}
              strokeWidth="2"
            />
            <rect x="22" y="26" width="12" height="12" rx="2" fill={sliderSlot} />
            <rect
              x="66"
              y="24"
              width="22"
              height="22"
              rx="4"
              fill={sliderSlot}
            />
            <path
              d="M12 22 L52 22"
              stroke={sliderHighlight}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M26 28 L30 32 L26 36 L30 40"
              stroke={sliderEdge}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
