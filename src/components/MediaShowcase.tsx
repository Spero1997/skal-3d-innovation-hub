import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Editorial media showcase — no frames, no cards.
 * Mixed videos + still images on the cream background, asymmetric grid.
 */
const MediaShowcase: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -40]);

  return (
    <section ref={ref} className="section-x py-20 md:py-32 relative overflow-hidden">
      {/* Editorial header */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-14 md:mb-20">
        <span className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          ◦ 003 / Carnet visuel
        </span>
        <h2 className="col-span-12 md:col-span-8 display-serif fluid-display-md leading-[0.95] font-light tracking-[-0.03em]">
          La matière, <span className="italic">en mouvement</span>.
        </h2>
        <p className="col-span-12 md:col-span-2 text-sm text-foreground/70 self-end">
          Captures du studio, fragments de marque, conversations.
        </p>
      </div>

      {/* Asymmetric editorial grid */}
      <div className="grid grid-cols-12 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-16">
        {/* Landscape video — large, left */}
        <motion.figure style={{ y: y1 }} className="col-span-12 md:col-span-8 group">
          <Vid src="/showcase/v1.mp4" className="w-full aspect-[16/9] object-cover" />
          <figcaption className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Fig. 01 — Atelier</span>
            <span>Skal · 2025</span>
          </figcaption>
        </motion.figure>

        {/* Portrait still — right column, offset down */}
        <motion.figure style={{ y: y2 }} className="col-span-12 md:col-span-4 md:mt-24">
          <img
            src="/showcase/notifications.png"
            alt="Conversations clients SKAL Service"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover"
          />
          <figcaption className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Fig. 02 — Voix</span>
            <span>Clients</span>
          </figcaption>
        </motion.figure>

        {/* Portrait video — middle, narrow */}
        <motion.figure style={{ y: y3 }} className="col-span-12 md:col-span-4 md:col-start-2">
          <Vid src="/showcase/v2.mp4" className="w-full aspect-[3/4] object-cover" />
          <figcaption className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Fig. 03 — Geste</span>
            <span>00:07</span>
          </figcaption>
        </motion.figure>

        {/* Still — wide, right */}
        <motion.figure style={{ y: y1 }} className="col-span-12 md:col-span-6 md:col-start-7 md:mt-16">
          <img
            src="/showcase/listening.png"
            alt="SKAL Service à votre écoute"
            loading="lazy"
            className="w-full aspect-[4/5] object-cover"
          />
          <figcaption className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Fig. 04 — Écoute</span>
            <span>Studio</span>
          </figcaption>
        </motion.figure>

        {/* Landscape video — full bleed feel */}
        <motion.figure style={{ y: y2 }} className="col-span-12 md:col-span-10 md:col-start-2 mt-4">
          <Vid src="/showcase/v3.mp4" className="w-full aspect-[16/9] object-cover" />
          <figcaption className="mt-3 flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Fig. 05 — Process</span>
            <span>Cotonou · BJ</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
};

/** Auto-playing, muted, looping video that pauses when off-screen for perf */
const Vid: React.FC<{ src: string; className?: string }> = ({ src, className }) => {
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
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
};

export default MediaShowcase;