import React from 'react';
import { cn } from "@/lib/utils";

const GRADIENT_ID = "nav-active-grad";

export const IconDiscover = ({ isActive, className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M14 4A8.5 8.5 0 0 1 20 10M20 14A8.5 8.5 0 0 1 14 20M10 20A8.5 8.5 0 0 1 4 14M4 10A8.5 8.5 0 0 1 10 4" 
      stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M17.5 6.5 L14 14 L6.5 17.5 L10 10 Z M 12 10.5 C 12.828 10.5 13.5 11.172 13.5 12 C 13.5 12.828 12.828 13.5 12 13.5 C 11.172 13.5 10.5 12.828 10.5 12 C 10.5 11.172 11.172 10.5 12 10.5 Z" 
      fill={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} 
    />
  </svg>
);

export const IconSearch = ({ isActive, className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10.5" r="7.5" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" />
    <path d="M 16.5 16.5 L 21 21" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconRooms = ({ isActive, className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="3.5" fill={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} />
    <path d="M 7.5 7.5 A 6.36 6.36 0 0 0 7.5 16.5 M 16.5 7.5 A 6.36 6.36 0 0 1 16.5 16.5" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 4 4 A 11.31 11.31 0 0 0 4 20 M 20 4 A 11.31 11.31 0 0 1 20 20" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconPopular = ({ isActive, className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 3 20 L 10 13 L 14 17 L 21 8" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 14 8 L 21 8 L 21 15" stroke={isActive ? `url(#${GRADIENT_ID})` : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NavGradient = () => (
  <svg width="0" height="0" className="absolute" style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <linearGradient id={GRADIENT_ID} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#3B82F6" /> {/* Blue 500 */}
        <stop offset="50%" stopColor="#8B5CF6" /> {/* Violet 500 */}
        <stop offset="100%" stopColor="#C084FC" /> {/* Purple 400 */}
      </linearGradient>
    </defs>
  </svg>
);
