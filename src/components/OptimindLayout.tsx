import React from 'react';

interface OptimindLayoutProps { children: React.ReactNode; }

const OptimindLayout: React.FC<OptimindLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground grain relative">
      {children}
    </div>
  );
};

export default OptimindLayout;
