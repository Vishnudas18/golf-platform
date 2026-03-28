import React from 'react';

const Badge = ({ variant = 'info', children, className = '' }) => {
  const variants = {
    success: 'bg-primary/20 text-primary border-primary/30',
    warning: 'bg-secondary/20 text-secondary border-secondary/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    info: 'bg-muted/20 text-muted border-muted/30',
    gold: 'bg-gold/20 text-gold border-gold/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
