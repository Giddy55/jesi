import * as React from "react";
import { cn } from "@/lib/utils";

interface SemiCircleProgressProps {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
}

// A simple, theme-aware semi-circle progress using SVG
export function SemiCircleProgress({
  value,
  size = 240,
  strokeWidth = 14,
  className,
  ariaLabel = "progress",
}: SemiCircleProgressProps) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const width = size;
  const height = size / 2 + strokeWidth / 2; // allow stroke to show fully
  const cx = width / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  // Path for upper semicircle from left to right
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Length of semicircle = PI * r
  const length = Math.PI * r;
  const dashArray = length;
  const dashOffset = length * (1 - clamped / 100);

  const id = React.useId();

  return (
    <div className={cn("w-full flex items-end justify-center", className)} aria-label={ariaLabel}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-hidden={false}
      >
        <defs>
          <linearGradient id={`semi-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={d}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Indicator */}
        <path
          d={d}
          fill="none"
          stroke={`url(#semi-grad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
    </div>
  );
}

export default SemiCircleProgress;
