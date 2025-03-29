import React from "react";

export const FireIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

export const ExtinguisherIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8 12h8"></path>
    <path d="M11 6C9.4 4.4 8 4 8 2"></path>
    <path d="M13 6c1.6-1.6 3-2 3-4"></path>
    <path d="M10 2h4"></path>
    <path d="M14 18a4 4 0 0 1-8 0V6h8v12z"></path>
  </svg>
);

export const MaskIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6.09 13.28a3 3 0 1 1 4.24-4.24"></path>
    <path d="M6.09 9.04a3 3 0 0 0 0 4.24"></path>
    <path d="m14.31 16.9 7.07-7.07-1.41-1.41-7.07 7.07"></path>
    <path d="m13.13 15.72 1.41-1.41"></path>
    <path d="M9.5 9.5 11 11"></path>
    <path d="m16.95 16.95 3.54 3.54"></path>
    <path d="m3.13 3.13 17.8 17.8"></path>
  </svg>
);

export const ExitIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export const TipIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    <path d="m9.09 9 .5.5"></path>
    <path d="m15.41 9 -.5.5"></path>
    <path d="M12 13a2 2 0 0 0 1.815-1.175"></path>
    <path d="M10 14.5V16c0 .667.4 2 2 2s2-1.333 2-2v-1.5"></path>
  </svg>
);

export const HeartIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

export const OxygenIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
    <path d="M9.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
    <line x1="9.5" y1="3" x2="9.5" y2="9"></line>
    <line x1="14.5" y1="3" x2="14.5" y2="9"></line>
  </svg>
);

export const TimerIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const ScoreIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2"></path>
    <path d="m12 17.8 6.2 3.2-1.2-6.9 5-4.8-7-1L12 2"></path>
  </svg>
);
