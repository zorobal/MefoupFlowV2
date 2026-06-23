/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showText?: boolean;
}

/**
 * Premium SVG monogram for Mefoup-Flow representing an "M" styled 
 * with structural leaves in compliance with the brand identity.
 */
export function MefoupLogo({ 
  className = '', 
  size = 'md', 
  variant = 'color', 
  showText = true 
}: LogoProps) {
  const sizeMap = {
    sm: { svg: 'h-8 w-8', text: 'text-sm' },
    md: { svg: 'h-11 w-11', text: 'text-lg' },
    lg: { svg: 'h-16 w-16', text: 'text-2xl' },
    xl: { svg: 'h-24 w-24', text: 'text-4xl' },
  };

  const selectedSize = sizeMap[size];

  // Colors based on brand guide
  const primaryColor = variant === 'light' ? '#ffffff' : '#0F3D2E'; // deep
  const secondaryColor = variant === 'light' ? '#e2e8f0' : '#1E7A44'; // emerald
  const limeAccent = '#8CC63F'; // lime
  const amberAccent = '#F5A623'; // amber

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex-shrink-0 ${selectedSize.svg}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Defined gradients for shiny organic design */}
          <defs>
            <linearGradient id="mefoup-grad-deep-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F3D2E" />
              <stop offset="100%" stopColor="#1E7A44" />
            </linearGradient>
            <linearGradient id="mefoup-grad-lime" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E7A44" />
              <stop offset="100%" stopColor="#8CC63F" />
            </linearGradient>
            <linearGradient id="mefoup-grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#E08B14" />
            </linearGradient>
          </defs>

          {/* Left vertical pillar representing stability and growth */}
          <path
            d="M20 85 V25 C20 20, 28 15, 34 22 L50 45"
            stroke="url(#mefoup-grad-deep-emerald)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right vertical pillar that bends */}
          <path
            d="M50 45 L66 22 C72 15, 80 20, 80 25 V85"
            stroke="url(#mefoup-grad-deep-emerald)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Golden fertile soil horizon line at the base */}
          <path
            d="M10 88 H90"
            stroke={amberAccent}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Leaf 1 branching from the right stem (Mefoup Leaf Motif) */}
          <path
            d="M74 42 C74 42, 92 35, 92 20 C92 20, 80 20, 74 34 Z"
            fill="url(#mefoup-grad-lime)"
            stroke="#1E7A44"
            strokeWidth="1.5"
          />

          {/* Leaf 2 sprouting slightly lower looking towards the future */}
          <path
            d="M74 60 C74 60, 94 58, 90 42 C90 42, 78 45, 74 52 Z"
            fill="url(#mefoup-grad-lime)"
            stroke="#1E7A44"
            strokeWidth="1.5"
          />

          {/* Center core: A shining sun/seed/energy representing growth */}
          <circle cx="50" cy="65" r="8" fill="url(#mefoup-grad-amber)" />
          
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span 
              className={`font-black tracking-wider leading-none ${selectedSize.text} ${
                variant === 'light' ? 'text-white' : 'text-[#0F3D2E]'
              }`}
            >
              MEFOUP-FLOW
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-[#8CC63F] font-bold leading-none mt-1">
            Système Intégré de Gestion
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Inspiring Cameroon / Africa mascot badge with the "Cultivateur Camerounais" design representation.
 */
export function MefoupMascotBadge({ 
  className = '', 
  variant = 'light' 
}: { 
  className?: string; 
  variant?: 'light' | 'dark'; 
}) {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-slate-200/80 p-0.5 flex flex-col items-center justify-center w-[110px] h-[152px] bg-white shadow-sm ${className}`}
      id="mefoup-mascot-badge"
    >
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-grid-[#1E7A44]/5 opacity-10 pointer-events-none" />
      
      {/* Complete standing full-body Master Mascot Illustrating the exact image uploaded by the user */}
      <div className="w-full h-full relative z-10 flex items-center justify-center">
        <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            {/* Straw Hat Gradients */}
            <linearGradient id="mefoup-straw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="40%" stopColor="#E5B23C" />
              <stop offset="100%" stopColor="#B37F1B" />
            </linearGradient>
            {/* Skin Gradients */}
            <linearGradient id="mefoup-skin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#82513B" />
              <stop offset="100%" stopColor="#543122" />
            </linearGradient>
            {/* Overalls Gradient */}
            <linearGradient id="mefoup-overalls-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E7A44" />
              <stop offset="100%" stopColor="#0B4222" />
            </linearGradient>
            {/* Bright lime polo shirt gradient */}
            <linearGradient id="mefoup-shirt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9F257" />
              <stop offset="100%" stopColor="#9BC820" />
            </linearGradient>
            {/* Boots Gradient */}
            <linearGradient id="mefoup-boots-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
            {/* Soil Ground Gradient */}
            <linearGradient id="mefoup-soil-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8D5B31" />
              <stop offset="100%" stopColor="#5D3A1B" />
            </linearGradient>
          </defs>

          {/* Background Ambient Spotlight Glow */}
          <circle cx="512" cy="512" r="420" fill="#8CC63F" opacity="0.06" />

          {/* 1. Ground and Growing Sprouts */}
          <g id="ground">
            {/* Fertile soil mound */}
            <path d="M 120 880 Q 512 800 904 880 L 850 980 Q 512 1010 174 980 Z" fill="url(#mefoup-soil-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            {/* Soil texture details */}
            <path d="M 280 880 Q 512 840 744 880" stroke="#4A2E15" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 350 910 Q 512 880 674 910" stroke="#4A2E15" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>

          <g id="plants">
            {/* Growing agricultural sprouts left and right */}
            {/* Left Sprout */}
            <path d="M 220 860 Q 180 810 150 840 Q 180 870 220 860 Z" fill="#8CC63F" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 220 860 Q 230 790 260 810 Q 240 865 220 860 Z" fill="#1E7A44" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            {/* Right Sprout */}
            <path d="M 800 860 Q 840 810 870 840 Q 840 870 800 860 Z" fill="#1E7A44" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 800 860 Q 790 790 760 810 Q 780 865 800 860 Z" fill="#8CC63F" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
          </g>

          {/* 2. Flag of Cameroon on pole at left-rear */}
          <g id="flag">
            {/* Pole */}
            <line x1="180" y1="580" x2="180" y2="880" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" />
            <line x1="180" y1="580" x2="180" y2="880" stroke="#B3B3B3" strokeWidth="8" strokeLinecap="round" />
            {/* Top decorative sphere */}
            <circle cx="180" cy="570" r="14" fill="#FFC107" stroke="#1A1A1A" strokeWidth="8" />
            {/* Flag waving canvas columns with black outline */}
            <path d="M 180 590 L 246 590 L 246 690 L 180 690 Z" fill="#1E7A44" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 246 590 L 312 590 L 312 690 L 246 690 Z" fill="#D32F2F" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 312 590 L 378 590 L 378 690 L 312 690 Z" fill="#FFC107" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            {/* Cameroon Yellow Star on red middle */}
            <polygon points="279,628 283,637 292,637 285,643 288,652 279,646 270,652 273,643 266,637 275,637" fill="#FFEB3B" stroke="#1A1A1A" strokeWidth="2" />
          </g>

          {/* 3. Shovel/Spade standing on the ground at right-rear, held by farmer */}
          <g id="shovel">
            {/* Shaft/Pole */}
            <rect x="800" y="300" width="28" height="580" rx="14" fill="#C59B6D" stroke="#1A1A1A" strokeWidth="10" />
            {/* Grip Handle at top */}
            <path d="M 770 300 H 858" stroke="#1A1A1A" strokeWidth="16" strokeLinecap="round" />
            <path d="M 780 300 H 848" stroke="#C59B6D" stroke-width="8" stroke-linecap="round" />
            {/* Shovel metal blade at bottom, standing on soil */}
            <path d="M 760 800 H 868 L 848 890 C 840 910 828 920 814 920 C 800 920 788 910 780 890 Z" fill="#90A4AE" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
            <path d="M 772 812 H 856 L 842 880 Q 814 900 786 880 Z" fill="#B0BEC5" />
          </g>

          {/* 4. Complete standing Cultivateur character */}

          {/* Farmer - Boots (Green) */}
          <g id="boots">
            {/* Left Boot */}
            <path d="M 380 740 L 385 720 Q 425 710 465 720 L 470 740 L 480 840 Q 480 870 435 870 Q 370 870 370 840 Z" fill="url(#mefoup-boots-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 370 840 Q 425 830 480 840" stroke="#1D5321" strokeWidth="8" fill="none" />
            <path d="M 368 845 L 368 855 Q 425 865 482 855 L 482 845 Z" fill="#1B4D22" stroke="#1A1A1A" strokeWidth="8" />
            
            {/* Right Boot */}
            <path d="M 554 740 L 559 720 Q 599 710 639 720 L 644 740 L 654 840 Q 654 870 609 870 Q 544 870 544 840 Z" fill="url(#mefoup-boots-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 544 840 Q 599 830 654 840" stroke="#1D5321" strokeWidth="8" fill="none" />
            <path d="M 542 845 L 542 855 Q 599 865 656 855 L 656 845 Z" fill="#1B4D22" stroke="#1A1A1A" strokeWidth="8" />
          </g>

          {/* Farmer - Legs (Deep green pants part of overalls) */}
          <g id="overalls">
            {/* Legs section */}
            <path d="M 380 580 H 644 L 634 740 H 554 L 544 630 H 480 L 470 740 H 390 Z" fill="url(#mefoup-overalls-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            {/* Overalls Stitching & middle seam */}
            <path d="M 512 550 V 630" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" />
            {/* Side Pockets */}
            <path d="M 390 590 Q 430 580 435 620 L 400 660 Z" fill="#16512E" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 634 590 Q 594 580 589 620 L 624 660 Z" fill="#16512E" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            
            {/* Overalls upper chest bib */}
            <path d="M 420 450 H 604 L 614 580 H 410 Z" fill="url(#mefoup-overalls-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            
            {/* Overalls Straps with outlines */}
            {/* Left Strap */}
            <path d="M 430 380 L 434 450" stroke="#104E27" strokeWidth="26" strokeLinecap="round" />
            <path d="M 430 380 L 434 450" stroke="#1A1A1A" strokeWidth="12" strokeLinecap="round" />
            {/* Right Strap */}
            <path d="M 594 380 L 590 450" stroke="#104E27" strokeWidth="26" strokeLinecap="round" />
            <path d="M 594 380 L 590 450" stroke="#1A1A1A" strokeWidth="12" stroke-linecap="round" />
            
            {/* Yellow Buckles */}
            <circle cx="432" cy="450" r="12" fill="#FFC107" stroke="#1A1A1A" strokeWidth="8" />
            <circle cx="592" cy="450" r="12" fill="#FFC107" stroke="#1A1A1A" strokeWidth="8" />
          </g>

          {/* Farmer - Torso (Lime Green Shirt & Sleeves) */}
          <g id="shirt">
            {/* Main torso base collar backing */}
            <path d="M 334 460 Q 344 380 512 370 Q 680 380 690 460 L 604 460 L 420 460 Z" fill="url(#mefoup-shirt-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            
            {/* Left Sleeve */}
            <path d="M 344 390 L 280 430 L 305 480 L 360 440 Z" fill="url(#mefoup-shirt-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 280 430 L 305 480" stroke="#1A1A1A" strokeWidth="12" strokeLinecap="round" />
            {/* Folded sleeve cuff */}
            <rect x="274" y="440" width="34" height="46" rx="10" transform="rotate(-30 274 440)" fill="#C5EA4E" stroke="#1A1A1A" strokeWidth="10" />

            {/* Right Sleeve */}
            <path d="M 680 390 L 744 430 L 719 480 L 664 440 Z" fill="url(#mefoup-shirt-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 744 430 L 719 480" stroke="#1A1A1A" strokeWidth="12" strokeLinecap="round" />
            {/* Folded sleeve cuff */}
            <rect x="716" y="420" width="34" height="46" rx="10" transform="rotate(30 716 420)" fill="#C5EA4E" stroke="#1A1A1A" strokeWidth="10" />

            {/* Collars */}
            <path d="M 464 368 L 512 420 L 464 450 Z" fill="#C5EA4E" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
            <path d="M 560 368 L 512 420 L 560 450 Z" fill="#C5EA4E" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
          </g>

          {/* "MF" Logo Badge centered on Overall pocket */}
          <g id="logo">
            <circle cx="512" cy="515" r="32" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="10" />
            <path d="M 494 532 L 494 502 L 504 518 L 514 502 L 514 532" stroke="#1E7A44" strokeWidth="8" strokeLinecap="round" stroke-linejoin="round" fill="none" />
            <path d="M 518 512 H 530 M 518 522 H 526" stroke="#1E7A44" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 518 532 V 502" stroke="#1E7A44" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 524 496 Q 538 496 534 510 Q 520 514 524 496 Z" fill="#8CC63F" />
          </g>

          {/* Hands and arms */}
          <g id="left_hand">
            {/* Raised Thumbs Up Gesture arm skin */}
            <path d="M 285 450 Q 230 460 230 495" stroke="url(#mefoup-skin-grad)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 285 450 Q 230 460 230 495" stroke="#1A1A1A" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 285 450 Q 230 460 230 495" stroke="url(#mefoup-skin-grad)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Hand fist fingers */}
            <circle cx="215" cy="495" r="16" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="10" />
            <circle cx="225" cy="510" r="14" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="8" />
            <circle cx="235" cy="522" r="12" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="8" />
            {/* Thumb pointing straightforward */}
            <path d="M 205 490 Q 200 440 215 440 Q 225 440 220 480 Z" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
          </g>

          <g id="right_hand">
            {/* Arm skin holding Shovel */}
            <path d="M 725 450 Q 780 460 802 480" stroke="url(#mefoup-skin-grad)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 725 450 Q 780 460 802 480" stroke="#1A1A1A" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M 725 450 Q 780 460 802 480" stroke="url(#mefoup-skin-grad)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hand clasping vertical handle bar */}
            <circle cx="802" cy="480" r="22" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="10" />
            <path d="M 788 465 Q 814 472 814 482" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 788 477 Q 814 484 814 494" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 788 489 Q 814 496 814 506" stroke="#1A1A1A" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>

          {/* Neck and Head */}
          <g id="head">
            <path d="M 470 320 L 475 380 H 549 L 554 320 Z" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <circle cx="512" cy="255" r="75" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="12" />
            {/* Ears */}
            <circle cx="432" cy="255" r="16" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="10" />
            <path d="M 432 245 Q 424 255 432 265" stroke="#1A1A1A" strokeWidth="6" fill="none" />
            <circle cx="592" cy="255" r="16" fill="url(#mefoup-skin-grad)" stroke="#1A1A1A" strokeWidth="10" />
            <path d="M 592 245 Q 600 255 592 265" stroke="#1A1A1A" stroke-width="6" fill="none" />
          </g>

          {/* beard and grin */}
          <g id="beard">
            <path d="M 432 220 C 432 310 472 345 512 345 C 552 345 592 310 592 220" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 444 215 C 448 290 480 326 512 326 C 544 326 576 290 580 215 C 570 230 550 240 512 240 C 474 240 454 230 444 215 Z" fill="url(#mefoup-skin-grad)" />
            <path d="M 466 265 Q 512 290 558 265 Q 512 250 466 265" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
            <path d="M 474 278 Q 512 320 550 278 Z" fill="#1E0E08" stroke="#1A1A1A" strokeWidth="10" strokeLinejoin="round" />
            <path d="M 480 281 Q 512 295 544 281" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
          </g>

          {/* Eyes and Eyebrows */}
          <g id="eyes">
            <ellipse cx="482" cy="235" rx="14" ry="18" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="8" />
            <circle cx="482" cy="235" r="8" fill="#4E342E" />
            <circle cx="485" cy="231" r="3.5" fill="#FFFFFF" />
            <ellipse cx="542" cy="235" rx="14" ry="18" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="8" />
            <circle cx="542" cy="235" r="8" fill="#4E342E" />
            <circle cx="545" cy="231" r="3.5" fill="#FFFFFF" />
          </g>

          {/* Face details & nose */}
          <g id="face">
            <path d="M 512 250 Q 522 265 512 272" stroke="#3A2116" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M 458 215 Q 482 195 502 215" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M 566 215 Q 542 195 522 215" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
          </g>

          {/* Cameroon Country Woven Straw Hat */}
          <g id="hat">
            <ellipse cx="512" cy="180" rx="165" ry="46" fill="url(#mefoup-straw-grad)" stroke="#1A1A1A" strokeWidth="12" />
            <ellipse cx="512" cy="180" rx="130" ry="32" stroke="#DCA835" strokeWidth="6" fill="none" opacity="0.6" />
            <ellipse cx="512" cy="180" rx="90" ry="20" stroke="#B5811C" strokeWidth="4" fill="none" opacity="0.6" />
            <path d="M 402 165 C 402 50 622 50 622 165 Z" fill="url(#mefoup-straw-grad)" stroke="#1A1A1A" strokeWidth="12" strokeLinejoin="round" />
            <path d="M 432 140 Q 512 110 592 140" stroke="#DCA835" stroke-width="6" fill="none" opacity="0.6" />
            <path d="M 462 110 Q 512 85 562 110" stroke="#B5811C" stroke-width="4" fill="none" opacity="0.6" />
            <path d="M 404 162 Q 512 178 620 162 C 620 170 610 176 600 175 Q 512 190 424 175 C 414 176 404 170 404 162" fill="#1B5E20" stroke="#1A1A1A" strokeWidth="8" strokeLinejoin="round" />
            <path d="M 512 60 V 35" stroke="#FFC107" strokeWidth="12" strokeLinecap="round" />
            <path d="M 512 60 V 35" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
            <circle cx="512" cy="30" r="10" fill="#D32F2F" stroke="#1A1A1A" strokeWidth="6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * Beautiful running ribbon showing agricultural core values.
 */
export function MefoupRibbon({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`bg-gradient-to-r from-[#0F3D2E] via-[#1E7A44] to-[#2B2D30] text-white py-2 px-4 rounded-xl text-[10px] sm:text-xs font-bold tracking-widest text-center uppercase flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 shadow-sm border border-[#8CC63F]/20 ${className}`}
      id="mefoup-ribbon"
    >
      <span className="text-[#8CC63F] font-black">★ CHARTE D'ENGAGEMENT ★</span>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 font-mono font-bold text-slate-100">
        <span>AGRICULTURE</span>
        <span className="text-[#8CC63F]">•</span>
        <span>ÉLEVAGE</span>
        <span className="text-[#8CC63F]">•</span>
        <span>PERFORMANCE</span>
        <span className="text-[#8CC63F]">•</span>
        <span>DURABILITÉ</span>
      </div>
    </div>
  );
}
