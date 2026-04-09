import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", variant = 'dark' }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="assests/Taskify.svg" 
      className={className}
    >
      {/* Outer Rounded Frame */}
      <rect 
        x="10" y="10" width="80" height="80" rx="24" 
        fill={variant === 'dark' ? "white" : "black"} 
      />
      
      {/* Abstract 'T' + Checkmark Shape */}
      <path 
        d="M35 30H65M50 30V70M35 55L45 65L65 40" 
        stroke={variant === 'dark' ? "black" : "white"} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Subtle Accent Dot */}
      <circle cx="72" cy="28" r="5" fill="#10b981" />
    </svg>
  );
};

export default Logo;