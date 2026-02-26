"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Target,
  Trophy,
  Globe,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const tabs = [
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "publications", label: "Publications", icon: BookOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "expertise", label: "Expertise", icon: Target },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "profiles", label: "Profiles", icon: Globe },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollRef.current;
    if (!el) return;
    
    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);
    
    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Touch/Mouse drag handlers for mobile swipe
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative w-full">
      {/* Left Fade & Button */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 flex items-center justify-start transition-opacity duration-300 pointer-events-none ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scroll("left")}
          className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#950E1D] hover:border-[#950E1D]/30 transition-all pointer-events-auto ml-1"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Right Fade & Button */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 flex items-center justify-end transition-opacity duration-300 pointer-events-none ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scroll("right")}
          className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#950E1D] hover:border-[#950E1D]/30 transition-all pointer-events-auto mr-1"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-[#950E1D] hover:bg-[#950E1D]/5"
              }`}
            >
              {/* Active Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-[#950E1D] rounded-xl"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
              </span>

              {/* Label */}
              <span className="relative z-10">{tab.label}</span>

              {/* Active Indicator Dot (mobile only) */}
              {isActive && (
                <motion.span
                  layoutId="activeTabDot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#950E1D] rounded-full lg:hidden"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Scrollbar Hide Style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Simple hook for using the tabs
export function useProfileTabs() {
  const [activeTab, setActiveTab] = useState("education");
  return { activeTab, setActiveTab };
}
