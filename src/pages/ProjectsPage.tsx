
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import OptimindLayout from '@/components/OptimindLayout';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';

const ProjectCard: React.FC<{
  id: number;
  index: number;
  title: string;
  subtitle?: string;
  category: string;
  description: string;
  image: string;
}> = ({ id, index, title, subtitle, category, description, image }) => {
  const num = String(index + 1).padStart(2, '0');
  // Asymmetric column placement: large left, narrow right, alternating
  const layouts = [
    'md:col-span-8 md:col-start-1',
    'md:col-span-6 md:col-start-7',
    'md:col-span-7 md:col-start-2',
    'md:col-span-5 md:col-start-8',
  ];
  const colClass = layouts[index % layouts.length];
  const offset = index % 3 === 1 ? 'md:mt-20' : index % 3 === 2 ? 'md:mt-10' : '';
  return (
    <Link
      to={`/projects/${id}`}
      className={`group block col-span-12 ${colClass} ${offset}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--cream))] tabular-nums">
          {num} / {String(projects.length).padStart(2, '0')}
        </div>
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[hsl(var(--cream))] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-4 h-4 text-foreground" />
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4 border-t hairline pt-4">
        <div>
          <h3 className="display-serif text-2xl md:text-3xl font-light leading-tight">
            {title}
            {subtitle && <span className="italic text-foreground/60"> — {subtitle}</span>}
          </h3>
          <p className="mt-2 text-sm text-foreground/70 leading-relaxed max-w-md">{description}</p>
        </div>
        <span className="mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground shrink-0 whitespace-nowrap">
          {category}
        </span>
      </div>
    </Link>
  );
};

const ProjectsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <OptimindLayout>
      <SEO
        title="Projets & réalisations — Skal Services"
        description="Découvrez nos réalisations récentes : urbanisme, cartographie SIG, design et IA au Bénin et en Afrique de l'Ouest."
        path="/projects"
      />
      <Navbar />
      <PageHero
        index="03"
        kicker="Réalisations récentes"
        title={<>Des projets, <span className="italic">une matière.</span></>}
        lede="Une sélection de missions menées au Bénin et en Afrique de l'Ouest — urbanisme, cartographie SIG, identité visuelle, IA appliquée."
        meta={`${String(projects.length).padStart(2, '0')} projets`}
      />
      <section className="section-x section-y">
        <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-24">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              index={i}
              title={project.title}
              subtitle={project.subtitle}
              category={project.category}
              description={project.description}
              image={project.image}
            />
          ))}
        </div>
      </section>
      <Footer />
    </OptimindLayout>
  );
};

export default ProjectsPage;
