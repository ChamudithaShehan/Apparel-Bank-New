"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "light" | "dark" | "badge";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showSubtitle?: boolean;
}

export function BrandLogo({
  variant = "light",
  size = "md",
  href,
  className = "",
  showSubtitle = false,
}: BrandLogoProps) {
  const isLight = variant === "light";
  const isBadge = variant === "badge";
  const isDark = variant === "dark";

  const sizeClasses = {
    sm: {
      apparel: "text-lg sm:text-xl",
      bank: "text-[8px] sm:text-[9px] tracking-[0.3em]",
      gap: "gap-0",
      container: "py-0.5",
    },
    md: {
      apparel: "text-2xl sm:text-[26px]",
      bank: "text-[10px] sm:text-[11px] tracking-[0.32em]",
      gap: "gap-0.5",
      container: "py-1",
    },
    lg: {
      apparel: "text-3xl sm:text-4xl",
      bank: "text-xs sm:text-sm tracking-[0.35em]",
      gap: "gap-1",
      container: "py-1.5",
    },
  }[size];

  const content = (
    <div
      className={`inline-flex flex-col select-none leading-none transition-all ${sizeClasses.container} ${
        isBadge
          ? "bg-[#020333] px-3.5 py-2 rounded-xl text-white shadow-xs border border-[#0A1852]"
          : ""
      } ${className}`}
    >
      <div className={`flex flex-col items-start ${sizeClasses.gap}`}>
        {/* "Apparel" in high-contrast elegant serif */}
        <span
          style={{ fontFamily: "'Playfair Display', 'Bodoni MT', 'Didot', 'Georgia', serif" }}
          className={`font-normal italic tracking-tight ${sizeClasses.apparel} ${
            isLight
              ? "text-[#020333] font-semibold not-italic"
              : "text-white"
          }`}
        >
          Apparel
        </span>

        {/* "BANK" in bold tracked geometric sans-serif */}
        <span
          className={`font-black uppercase pl-0.5 ${sizeClasses.bank} ${
            isLight ? "text-[#020333]" : "text-white"
          }`}
        >
          BANK
        </span>
      </div>

      {showSubtitle && (
        <span
          className={`text-[10px] font-bold mt-1 tracking-wider uppercase ${
            isLight ? "text-slate-400" : "text-slate-300"
          }`}
        >
          Sri Lanka Garment Network
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
