import React from 'react';

interface OptimindLayoutProps {
  children: React.ReactNode;
}

const OptimindLayout: React.FC<OptimindLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[hsl(var(--optimind-bg))] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(var(--optimind-glow)/0.15)] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-[200px] h-[200px] bg-[hsl(var(--optimind-glow)/0.08)] rounded-full blur-[80px] pointer-events-none" />
      
      {/* Floating card container */}
      <div className="optimind-container relative">
        {children}
      </div>
    </div>
  );
};

export default OptimindLayout;