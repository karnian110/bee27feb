"use client";

// ScholarBeeLogo.jsx
// Place in: /components/ScholarBeeLogo.jsx
//
// Required fonts in layout.jsx or globals.css:
// <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500&display=swap" rel="stylesheet"/>
//
// Usage:
//   import ScholarBeeLogo from "@/components/ScholarBeeLogo";
//   <ScholarBeeLogo size="md" theme="light" />
//
// Props:
//   size  — "sm" | "md" | "lg"   (default: "md")
//   theme — "light" | "dark"     (default: "light")

import React from "react";

// ── Animated Atom SVG Icon ─────────────────────────────────────────────────
function AtomIcon({ size = 56 }) {
  const c = size / 2;
  const rx = size * 0.44;
  const ry = size * 0.155;
  const sw = size * 0.03;
  const nr = size * 0.065;
  const nucR = size * 0.11;

  return (
    <>
      <style>{`
        @keyframes sbOrbit1 { from { transform: rotate(0deg)  } to { transform: rotate(360deg)  } }
        @keyframes sbOrbit2 { from { transform: rotate(0deg)  } to { transform: rotate(-360deg) } }
        @keyframes sbOrbit3 { from { transform: rotate(60deg) } to { transform: rotate(420deg)  } }
        .sb-orbit-1 { animation: sbOrbit1 7s  linear infinite; }
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
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="sbG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#8b5cf6" />
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
          <circle  cx={c + rx} cy={c} r={nr} fill="#6366f1" filter="url(#sbGlow)" />
        </g>

        {/* Orbit 2 — 60° reversed */}
        <g className="sb-orbit-2" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={rx} ry={ry} stroke="url(#sbG1)" strokeWidth={sw} opacity="0.9"
            transform={`rotate(60 ${c} ${c})`} filter="url(#sbGlow)" />
          <circle  cx={c + rx} cy={c} r={nr} fill="#8b5cf6"
            transform={`rotate(60 ${c} ${c})`} filter="url(#sbGlow)" />
        </g>

        {/* Orbit 3 — 120° */}
        <g className="sb-orbit-3" style={{ transformOrigin: `${c}px ${c}px` }}>
          <ellipse cx={c} cy={c} rx={rx} ry={ry} stroke="url(#sbG1)" strokeWidth={sw} opacity="0.9"
            transform={`rotate(120 ${c} ${c})`} filter="url(#sbGlow)" />
          <circle  cx={c + rx} cy={c} r={nr} fill="#06b6d4"
            transform={`rotate(120 ${c} ${c})`} filter="url(#sbGlow)" />
        </g>

        {/* Nucleus */}
        <circle cx={c} cy={c} r={nucR * 1.4} fill="url(#sbG2)" opacity="0.12" />
        <circle cx={c} cy={c} r={nucR}        fill="url(#sbG2)" filter="url(#sbGlow)" />
      </svg>
    </>
  );
}

// ── Size Configuration ─────────────────────────────────────────────────────
const SIZES = {
  sm: { icon: 30, scholar: "19px", bee: "19px", tag: "7.5px", gap: "10px" },
  md: { icon: 48, scholar: "31px", bee: "31px", tag: "10px",  gap: "14px" },
  lg: { icon: 70, scholar: "46px", bee: "46px", tag: "12px",  gap: "20px" },
};

// ── ScholarBee Logo ────────────────────────────────────────────────────────
export default function Logo({ size = "md", theme = "light", className = "" }) {
  const cfg  = SIZES[size] ?? SIZES.md;
  const dark = theme === "dark";

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: cfg.gap }}
      role="img"
      aria-label="ScholarBee"
    >
      <AtomIcon size={cfg.icon} />

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>

          {/* "Scholar" — cool slate, Cormorant Garamond */}
          <span
            style={{
            //   fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: cfg.scholar,
              letterSpacing: "0.01em",
              background: dark
                ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
                : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Scholar
          </span>

          {/* "Bee" — rich gold gradient */}
          <span
            style={{
            //   fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontSize: cfg.bee,
              letterSpacing: "0.01em",
              background:
                "linear-gradient(135deg, #b45309 0%, #d97706 30%, #f59e0b 60%, #fbbf24 85%, #fde68a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Bee
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            // fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            fontSize: cfg.tag,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: dark ? "#475569" : "#94a3b8",
          }}
        >
          Knowledge in Motion
        </span>
      </div>
    </div>
  );
}
