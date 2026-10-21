"use client";

import { forwardRef } from "react";

const ReelIcon = forwardRef<SVGSVGElement, { className?: string }>(function ReelIcon({ className = "" }, ref) {
  return (
    <svg ref={ref} viewBox="0 0 100 100" className={`text-brand ${className}`} aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={50 + 28 * Math.cos((a * Math.PI) / 180)}
          cy={50 + 28 * Math.sin((a * Math.PI) / 180)}
          r="9"
          fill="#050505"
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
});

export default ReelIcon;
