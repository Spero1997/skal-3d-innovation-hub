import React from 'react';

interface OptimindLayoutProps {
  children: React.ReactNode;
}

const OptimindLayout: React.FC<OptimindLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[hsl(var(--optimind-bg))] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[hsl(var(--optimind-glow)/0.12)] rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-[300px] h-[300px] bg-[hsl(var(--optimind-glow)/0.06)] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-[200px] h-[200px] bg-[hsl(var(--optimind-glow)/0.04)] rounded-full blur-[80px] pointer-events-none" />
      
      {/* Floating card container */}
      <div className="optimind-container relative">
        {children}
      </div>
    </div>
  );
};

export default OptimindLayout;