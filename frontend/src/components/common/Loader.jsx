import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
      {fullPage && (
        <span className="text-sm font-medium text-muted uppercase tracking-widest animate-pulse">
          Loading GolfGives
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
