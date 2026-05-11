import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot,
  BarChart3,
  MessagesSquare,
  Megaphone,
  Truck,
  ShieldCheck,
  Users,
  FlaskConical,
  ArrowUpRight,
} from 'lucide-react';

const benefits = [
  {
    icon: Bot,
    title: 'Automatisation des tâches répétitives',
    desc: "Saisie de données, factures, emails standards : l'IA libère vos équipes pour des missions plus stratégiques.",
  },
  {
    icon: BarChart3,
    title: 'Analyse de données et aide à la décision',
    desc: "Détectez les tendances, anticipez les risques et orientez vos choix grâce à des analyses massives en quelques secondes.",
  },
  {
    icon: MessagesSquare,
    title: 'Expérience client améliorée',
    desc: "Chatbots, assistants virtuels et recommandations personnalisées : un service disponible 24h/24, réactif et sur-mesure.",
  },
  {
    icon: Megaphone,
    title: 'Ventes & marketing optimisés',
    desc: "Segmentation fine, prédiction des comportements d'achat et campagnes personnalisées pour maximiser le ROI.",
  },
  {
    icon: Truck,
    title: 'Chaîne logistique optimisée',
    desc: "Anticipation des ruptures de stock, optimisation des itinéraires et réduction des coûts opérationnels.",
  },
  {
    icon: ShieldCheck,
    title: 'Cybersécurité renforcée',
    desc: "Détection en temps réel des comportements suspects pour protéger vos données sensibles.",
  },
  {
    icon: Users,
    title: 'Ressources humaines accélérées',
    desc: "Tri automatique des CV, analyse des profils, détection du turnover : un recrutement plus efficace.",
  },
  {
    icon: FlaskConical,
    title: 'Innovation & R&D',
    desc: "Pharmacie, industrie, tech : l'IA accélère la recherche et réduit le temps de mise sur le marché.",
  },
];

const impacts = [
  { label: 'Productivité', value: '↑ Forte hausse' },
  { label: 'Coûts opérationnels', value: '↓ Baisse marquée' },
  { label: 'Satisfaction client', value: '↑ Amélioration' },
  { label: 'Compétitivité', value: '↑ Avantage clé' },
];

const AIValueSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="ia-value" className="section-x section-y border-t hairline">
      {/* Editorial pairing — image LEFT, text RIGHT */}
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="col-span-12 md:col-span-6"
        >
          <img
            src="/showcase/notifications.png"
            alt="Conversations clients SKAL Services — disponibilité 24/7"
            loading="lazy"
            className="w-full h-auto object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="col-span-12 md:col-span-6"
        >
          <span className="ticker-tag">§ IA · Levier</span>
          <h2 className="display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[0.95] mt-6">
            L'IA au service de <span className="italic">votre quotidien</span> —
            un <span className="text-[hsl(var(--tangerine))]">levier de compétitivité.</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-xl">
            L'IA n'est plus un luxe réservé aux grandes entreprises. C'est aujourd'hui un
            levier essentiel pour toute organisation, quelle que soit sa taille. Voici
            comment nous transformons concrètement votre quotidien.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
              className="group border hairline rounded-md p-5 sm:p-6 bg-[hsl(var(--cream))] hover:bg-foreground hover:text-[hsl(var(--cream))] transition-colors duration-500 min-h-[220px] flex flex-col"
            >
              <div className="flex items-start justify-between">
                <Icon className="w-6 h-6 stroke-[1.2] text-[hsl(var(--tangerine))]" />
                <span className="mono text-[10px] uppercase tracking-[0.25em] opacity-50">
                  0{i + 1}
                </span>
              </div>
              <h3 className="display-serif text-xl sm:text-2xl font-light mt-auto pt-6 leading-tight">
                {b.title}
              </h3>
              <p className="text-sm mt-3 leading-relaxed opacity-70 group-hover:opacity-90">
                {b.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Impact summary */}
      <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 md:col-span-4">
          <span className="ticker-tag">§ Résumé</span>
          <h3 className="display-serif text-2xl sm:text-3xl font-light mt-4 leading-tight">
            Les <span className="italic">bénéfices</span> mesurables.
          </h3>
        </div>
        <div className="col-span-12 md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {impacts.map((it) => (
            <div
              key={it.label}
              className="border hairline rounded-md p-4 sm:p-5 bg-background flex flex-col justify-between min-h-[110px]"
            >
              <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {it.label}
              </span>
              <span className="display-serif text-base sm:text-lg font-light text-[hsl(var(--tangerine))] mt-3 leading-tight">
                {it.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Link
          to="/services/conseil-ia"
          className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] px-5 py-3 rounded-full bg-foreground text-[hsl(var(--cream))] hover:opacity-90 transition-opacity"
        >
          Découvrir notre conseil IA <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default AIValueSection;
