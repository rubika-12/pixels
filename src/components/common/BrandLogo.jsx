import React from 'react';

/**
 * Brand Sprout Leaf Logo matching the reference design:
 * Two smooth organic leaves (left smaller leaf, right larger leaf) in deep forest green.
 */
export function BrandSprout({ className = 'w-7 h-7 text-[#1e5f37]' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Right / Main Leaf */}
      <path
        d="M28 4C28 4 17.5 4.5 11.5 12.5C8.5 16.5 8 21.5 8.5 27C12.5 27 18.5 26 23.5 20C29 13.5 28 4 28 4Z"
        fill="currentColor"
      />
      {/* Left / Secondary Leaf */}
      <path
        d="M5 14C5 14 11 13 14 17.5C16 20.5 15.5 24.5 13 26.5C10 26.5 6.5 23.5 5 19C4 16.5 5 14 5 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BrandLogo({ showSubtitle = false, subtitleText = 'Better Decisions. Higher Value.', className = '' }) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <BrandSprout className="w-8 h-8 text-[#1e5f37] dark:text-green-400 shrink-0" />
      <div className="flex flex-col text-left">
        <span className="font-display font-extrabold text-xl text-[#1a2d21] dark:text-forest-100 tracking-tight leading-tight">
          StoreOrSell
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-[#5e7165] dark:text-forest-300 leading-none mt-0.5 font-sans">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}
