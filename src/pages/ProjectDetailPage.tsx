
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the project based on the ID
  const project = projects.find(p => p.id === parseInt(id || '0'));
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Preload the background image
    const img = new Image();
    img.src = "/lovable-uploads/ecc4cd20-90cc-4af6-8781-13a25c8c2314.png";
    img.onload = () => setIsLoading(false);
    
    // Fallback in case image loading takes too long
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
          <p className="mb-6">Le projet que vous recherchez n'existe pas.</p>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      <div 
        className="fixed inset-0 -z-10 bg-white"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/ecc4cd20-90cc-4af6-8781-13a25c8c2314.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/projects" className="inline-flex items-center text-skal-orange hover:text-skal-orange/80 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
          </Link>
          
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="h-64 md:h-80 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <span className="text-xs font-medium text-skal-orange mb-2 block">{project.category}</span>
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-skal-black">{project.title}</h1>
                {project.subtitle && <h2 className="text-lg md:text-xl font-medium mb-4 text-gray-600">{project.subtitle}</h2>}
              </div>
              
              <div className="prose max-w-none text-gray-600">
                <p className="text-base leading-relaxed mb-6">{project.description}</p>
                
                {/* Ici vous pouvez ajouter plus de contenu spécifique au projet */}
                <p className="text-base leading-relaxed mb-6">
                  Notre équipe a travaillé avec passion et expertise pour mener ce projet à bien. 
                  Nous avons utilisé des technologies de pointe et des méthodologies innovantes pour garantir 
                  des résultats exceptionnels.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-skal-black">Objectifs du projet</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Analyse complète des besoins du client</li>
                      <li>Conception d'une solution adaptée et innovante</li>
                      <li>Mise en œuvre précise et efficace</li>
                      <li>Suivi et optimisation des résultats</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-skal-black">Technologies utilisées</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Cartographie avancée</li>
                      <li>Analyse de données spatiales</li>
                      <li>Modélisation 3D</li>
                      <li>Systèmes d'information géographique</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-lg font-medium mb-4 text-skal-black">Vous avez un projet similaire ?</h3>
                <Link to="/contact">
                  <Button className="bg-skal-orange hover:bg-skal-orange/90 text-white">
                    Contactez-nous
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
