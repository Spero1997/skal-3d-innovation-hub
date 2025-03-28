
import React from 'react';

interface MarqueeBannerProps {
  text: string;
}

const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ text }) => {
  return (
    <div className="w-full overflow-hidden bg-skal-orange text-white py-2 font-medium">
      <div className="whitespace-nowrap inline-block animate-marquee">
        {text} {text} {/* Duplication pour une boucle fluide */}
      </div>
    </div>
  );
};

export default MarqueeBanner;
