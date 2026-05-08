import React, { useEffect, useRef } from 'react';

interface AutoVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

/** Muted, looping, autoplay video that pauses when off-screen. No frame, no chrome. */
const AutoVideo: React.FC<AutoVideoProps> = ({ src, className, poster }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
};

export default AutoVideo;