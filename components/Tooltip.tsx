import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, fullWidth = false, className = '', position = 'top' }) => {
  const positionClass = position === 'top' 
    ? 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2' 
    : 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2';
    
  const arrowClass = position === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 dark:border-t-slate-700'
    : 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 dark:border-b-slate-700';

  return (
    <div className={`group relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}>
      {children}
      <div className={`pointer-events-none absolute ${positionClass} opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50`}>
        <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs py-1.5 px-3 rounded-md whitespace-nowrap shadow-lg relative">
          {content}
          {/* Arrow */}
          <div className={`absolute border-4 border-transparent ${arrowClass}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;