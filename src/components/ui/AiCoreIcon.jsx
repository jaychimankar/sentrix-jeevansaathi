import React from 'react'

export function AiCoreIcon({ className = "w-6 h-6" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Outer shield/processor bounds */}
      <rect x="3" y="3" width="18" height="18" rx="4" />
      {/* Neural network nodes */}
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="8" r="1.5" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="16" cy="16" r="1.5" />
      {/* Connections */}
      <line x1="8" y1="9.5" x2="8" y2="14.5" />
      <line x1="16" y1="9.5" x2="16" y2="14.5" />
      <line x1="9.5" y1="8" x2="14.5" y2="8" />
      <line x1="9.5" y1="16" x2="14.5" y2="16" />
      {/* Center AI Core text */}
      <text x="12" y="13.5" fontSize="6" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">AI</text>
    </svg>
  )
}
