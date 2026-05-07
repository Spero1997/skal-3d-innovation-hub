import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

const services = [
  {
    title: "Design Graphique",
    description: "Nous créons vos identités visuelles en connectant vos valeurs à un design moderne, renforçant votre image et votre productivité.",
    iconShape: 'circle' as const,
  },
  {
    title: "Cartographie & Arpentage",
    description: "Nous développons des cartes et relevés de précision, capables de répondre aux besoins les plus complexes de vos projets.",
    iconShape: 'triangle' as const,
  },
  {
    title: "Conseil en IA",
    description: "Grâce à notre expertise, nous analysons votre organisation et vous conseillons sur l'adoption d'automatisations intelligentes.",
    iconShape: 'diamond' as const,
  },
];

const ServiceIcon: React.FC<{ shape: 'circle' | 'triangle' | 'diamond' }> = ({ shape }) => {
  const size = 80;
  return (
    <div className="w-full aspect-square flex items-center justify-center relative">
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className="drop-shadow-[0_0_20px_rgba(245,166,35,0.4)]">
        {shape === 'circle' && (
          <>
            <circle cx="40" cy="40" r="28" stroke="url(#goldGrad)" strokeWidth="3" fill="none" opacity="0.9" />
            <circle cx="40" cy="40" r="20" stroke="url(#goldGrad)" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="6 4" />
          </>
        )}
        {shape === 'triangle' && (
          <>
            <polygon points="40,10 70,65 10,65" stroke="url(#goldGrad)" strokeWidth="3" fill="none" opacity="0.9" />
            <polygon points="40,22 60,58 20,58" stroke="url(#goldGrad)" strokeWidth="2" fill="none" opacity="0.5" />
          </>
        )}
        {shape === 'diamond' && (
          <>
            <rect x="16" y="16" width="48" height="48" rx="4" stroke="url(#goldGrad)" strokeWidth="3" fill="none" opacity="0.9" transform="rotate(45 40 40)" />
            <rect x="24" y="24" width="32" height="32" rx="2" stroke="url(#goldGrad)" strokeWidth="2" fill="none" opacity="0.5" transform="rotate(45 40 40)" />
          </>
        )}
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="50%" stopColor="#FFF5E6" />
            <stop offset="100%" stopColor="#D4941A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={sectionRef} className="py-16 md:py-24 px-6 relative z-10">
      {/* Page counter */}
      <div className="text-[11px] text-muted-foreground tracking-wider mb-8">
        003 / 005
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h2 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-wide text-foreground leading-tight">
            DÉCOUVREZ<br />NOS SERVICES
          </h2>
        </div>
        <div className="flex items-start gap-4">
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed hidden md:block">
            Nous offrons des services complets de design, cartographie et IA sous un même toit.
          </p>
          <button className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-black/[0.06] bg-black/[0.02] p-6 flex flex-col hover:shadow-[0_0_30px_rgba(245,166,35,0.1)] hover:border-black/10 transition-all duration-500"
          >
            <div className="flex-1 flex items-center justify-center py-6">
              <ServiceIcon shape={service.iconShape} />
            </div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">
              {service.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
