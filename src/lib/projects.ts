export const DOMAIN_LABELS: Record<string, string> = {
  architecture_btp: 'Architecture & BTP',
  geomatique_sig: 'Géomatique & SIG',
  graphisme_ia: 'Graphisme & IA',
  web_digital: 'Web & Digital',
  autre: 'Autre',
};

export const DOMAIN_COLORS: Record<string, string> = {
  architecture_btp: 'from-orange-500 to-orange-600',
  geomatique_sig: 'from-emerald-500 to-emerald-600',
  graphisme_ia: 'from-fuchsia-500 to-fuchsia-600',
  web_digital: 'from-blue-500 to-blue-600',
  autre: 'from-zinc-500 to-zinc-600',
};

export const STATUS_LABELS: Record<string, string> = {
  prospect: 'Prospect',
  en_cours: 'En cours',
  en_pause: 'En pause',
  livre: 'Livré',
  annule: 'Annulé',
};

export const STATUS_COLORS: Record<string, string> = {
  prospect: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  en_cours: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  en_pause: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  livre: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  annule: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const PRIORITY_LABELS: Record<string, string> = {
  basse: 'Basse',
  normale: 'Normale',
  haute: 'Haute',
  urgente: 'Urgente',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  en_revue: 'En revue',
  termine: 'Terminé',
};

export const TASK_STATUSES = ['a_faire', 'en_cours', 'en_revue', 'termine'] as const;

export function formatXOF(amount: number | null | undefined) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatHours(h: number | null | undefined) {
  if (h == null || isNaN(Number(h))) return '0h';
  const n = Number(h);
  if (n === 0) return '0h';
  const hours = Math.floor(n);
  const mins = Math.round((n - hours) * 60);
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${String(mins).padStart(2, '0')}`;
}

export const DEPENDENCY_LABELS: Record<string, string> = {
  finish_to_start: 'Fin → Début',
  start_to_start: 'Début → Début',
  finish_to_finish: 'Fin → Fin',
  start_to_finish: 'Début → Fin',
};