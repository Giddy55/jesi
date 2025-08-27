import * as React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
}

// A circular progress component that goes from Sunday to Saturday
export function CircularProgress({
  value,
  size = 200,
  strokeWidth = 12,
  className,
  ariaLabel = "progress",
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const width = size;
  const height = size;
  const cx = width / 2;
  const cy = height / 2;
  const r = (size - strokeWidth) / 2;

  // Start from top (Sunday) and go clockwise
  const circumference = 2 * Math.PI * r;
  const dashArray = circumference;
  const dashOffset = circumference * (1 - clamped / 100);

  const id = React.useId();

  return (
    <div className={cn("w-full flex items-center justify-center", className)} aria-label={ariaLabel}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-hidden={false}
        className="transform -rotate-90" // Start from top
      >
        <defs>
          <linearGradient id={`circular-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Indicator */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#circular-grad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
    </div>
  );
}

export default CircularProgress;