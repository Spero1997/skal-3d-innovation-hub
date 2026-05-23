import designGraphique from './design-graphique.jpg';
import strategieMarque from './strategie-de-marque.jpg';
import webApplication from './web-application.jpg';
import cartographieSig from './cartographie-sig.jpg';
import arpentage from './arpentage.jpg';
import conseilIa from './conseil-ia.jpg';
import architectureBtp from './architecture-btp.jpg';
import geomatiqueSig from './geomatique-sig.jpg';
import graphismeIa from './graphisme-ia.jpg';
import webDigital from './web-digital.jpg';

// Per-discipline (6) — keyed by data/disciplines slug
export const disciplineImages: Record<string, string> = {
  'design-graphique': designGraphique,
  'strategie-de-marque': strategieMarque,
  'web-application': webApplication,
  'cartographie-sig': cartographieSig,
  arpentage,
  'conseil-ia': conseilIa,
};

// Per-domain (4) — keyed by data/domains slug
export const domainImages: Record<string, string> = {
  'architecture-btp': architectureBtp,
  'geomatique-sig': geomatiqueSig,
  'graphisme-ia': graphismeIa,
  'web-digital': webDigital,
};

// Hero / Footer marquee (4 short labels)
export const shortDisciplineImages: Record<string, string> = {
  'Architecture & BTP': architectureBtp,
  'Géomatique & SIG': geomatiqueSig,
  'Graphisme & IA': graphismeIa,
  'Web & Digital': webDigital,
  'Conseil stratégique': conseilIa,
};