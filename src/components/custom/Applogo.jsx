"use client";

// AppIcon.jsx
// Place in: /components/AppIcon.jsx
//
// Usage:
//   import AppIcon from "@/components/AppIcon";
//   <AppIcon size={56} />
//
// Props:
//   size — number, defaults to 56

import React from "react";

export default function AppIcon({ size = 56 }) {
  const c = size / 2;
  const rx = size * 0.44;
  const ry = size * 0.155;
  const sw = size * 0.03;
  const nr = size * 0.065;
  const nucR = size * 0.11;

  return (
    <>
      <style>{`
        @keyframes sbOrbit1 { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes sbOrbit2 { from { transform: rotate(0deg) } to { transform: rotate(-360deg) } }
        @keyframes sbOrbit3 { from { transform: rotate(60deg) } to { transform: rotate(420deg) } }
        .sb-orbit-1 { animation: sbOrbit1 7s linear infinite; }
        .sb-orbit-2 { animation: sbOrbit2 10s linear infinite; }
        .sb-orbit-3 { animation: sbOrbit3 13s linear infinite; }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sbG1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="sbG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="sbGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="1.3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit 1 — horizontal */}
        <g className="sb-orbit-1" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={rx} ry={ry} stroke="url(#sbG1)" strokeWidth={sw} opacity="0.9" filter="url(#sbGlow)" />
          <circle cx={c + rx} cy={c} r={nr} fill="#6366f1" filter="url(#sbGlow)" />
        </g>

        {/* Orbit 2 — 60° reversed */}
        <g className="sb-orbit-2" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={rx} ry={ry} stroke="url(#sbG1)" strokeWidth={sw} opacity="0.9"
            transform={`rotate(60 ${c} ${c})`} filter="url(#sbGlow)" />
          <circle cx={c + rx} cy={c} r={nr} fill="#8b5cf6"
            transform={`rotate(60 ${c} ${c})`} filter="url(#sbGlow)" />
        </g>

        {/* Orbit 3 — 120° */}
        <g className="sb-orbit-3" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={rx} ry={ry} stroke="url(#sbG1)" strokeWidth={sw} opacity="0.9"
            transform={`rotate(120 ${c} ${c})`} filter="url(#sbGlow)" />
          <circle cx={c + rx} cy={c} r={nr} fill="#06b6d4"
            transform={`rotate(120 ${c} ${c})`} filter="url(#sbGlow)" />
        </g>

        {/* Nucleus */}
        <circle cx={c} cy={c} r={nucR * 1.4} fill="url(#sbG2)" opacity="0.12" />
        <circle cx={c} cy={c} r={nucR} fill="url(#sbG2)" filter="url(#sbGlow)" />
      </svg>
    </>
  );
}