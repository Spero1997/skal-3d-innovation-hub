# ERP/CRM Interne SKAL SERVICES SARL

Système de gestion d'entreprise premium accessible uniquement aux dirigeants, associés, comptables, chefs de projet et prestataires.

## Stratégie de livraison

L'ampleur du projet (auth + 5 rôles + 10 modules + finance automatisée + CRM + RH + documents + notifications) dépasse largement ce qu'on peut livrer dans une seule itération de qualité. Je propose de livrer en **6 phases**, chacune indépendante et fonctionnelle. Vous validez chaque phase avant la suivante.

Note technique : le stack reste **React + Vite + Tailwind + Lovable Cloud (Supabase/Postgres) + Recharts**. Next.js n'est pas supporté sur Lovable et n'apporte rien ici (l'app est en SPA authentifiée).

---

## Phase 1 — Fondations & Authentification (cette itération)

**Base de données**
- Table `profiles` (id, user_id, full_name, phone, avatar_url, status)
- Enum `app_role` : `super_admin`, `associe`, `comptable`, `chef_projet`, `prestataire`
- Table `user_roles` (user_id, role) + fonction `has_role()` SECURITY DEFINER
- Trigger auto-création profil au signup
- RLS strictes partout

**Authentification**
- Page `/admin/login` (email + mot de passe, design premium dark)
- Page `/admin/forgot-password` + `/admin/reset-password`
- Protection 2FA (TOTP Supabase MFA)
- Session persistante + auto-refresh
- Redirection selon rôle après login
- HIBP password check activé

**Layout admin**
- `/admin/*` — layout dédié avec sidebar moderne (collapsible icon mode)
- Dark mode forcé dans la zone admin
- Header avec recherche, notifications, profil
- Navigation conditionnelle selon rôle
- Page d'accueil `/admin` = dashboard placeholder

**Sécurité**
- Pas de rôle sur la table profiles (seulement sur `user_roles`)
- Toutes les futures tables auront RLS basée sur `has_role()`
- **Données financières confidentielles** : règles d'accès strictes (caisse, dividendes, répartitions = super_admin + associe + comptable uniquement)

---

## Phase 2 — Module Projets + Domaines

- Table `projects` (nom, client_id, domaine, budget, statut, échéance, responsable_id, description)
- Table `project_files`, `project_comments`, `project_activity`
- Table `tasks` (project_id, assigne_id, statut, échéance)
- Storage bucket `project-files` privé
- UI : liste filtrée, fiche projet complète, kanban tâches, timeline activité
- Statistiques par domaine (Architecture, Géomatique, Graphisme, Web)

---

## Phase 3 — Module Financier + Caisse + Répartitions automatiques

- Table `clients` (CRM léger : nom, email, tel, société, pipeline_status)
- Table `transactions` (project_id, type, montant, date, description)
- Table `revenue_distributions` calculée automatiquement selon les 3 cas :
  - Cas 1 : 15% caisse / 70% Spero / 15% associé
  - Cas 2 : 15% caisse / 35% Spero / 35% prestataire / 15% associé
  - Cas 3 : 15% caisse / coût prestataire / 50-50 bénéfice net
- Trigger Postgres qui calcule la répartition à chaque revenu encaissé
- Vue `caisse_balance` temps réel
- Exports PDF/Excel
- **Visibilité réservée** : super_admin, associé, comptable

---

## Phase 4 — Dashboard interactif + Graphiques

- Cartes statistiques temps réel (CA, bénéfices, caisse, dépenses, projets)
- Graphiques Recharts (évolution revenus, dépenses, répartition par domaine, croissance)
- Filtres période (mois, trimestre, année)
- Realtime Supabase pour mise à jour live

---

## Phase 5 — CRM + RH/Prestataires + Documents + Dividendes

- CRM complet avec pipeline drag&drop
- Fiches prestataires + missions + rémunérations
- Espace documents (contrats, factures, plans, juridiques) avec recherche
- Module dividendes : calcul, historique, simulations, rapports annuels

---

## Phase 6 — Notifications temps réel + Journal activité + Polish

- Notifications in-app (Supabase Realtime)
- Rappels échéances, alertes retard, alertes financières
- Audit log toutes actions sensibles
- Historique connexions
- Animations finales (framer-motion), polish visuel

---

## Confidentialité

Conformément à la mémoire projet : les données financières sensibles (capital, parts %, répartitions Spero/associé, simulations, noms prestataires) restent **strictement internes à `/admin/*`**, jamais exposées sur le site public, jamais dans des metadata SEO, jamais accessibles sans rôle vérifié côté serveur (RLS).

---

## Cette itération = Phase 1 uniquement

Je livre maintenant : tables auth/rôles + RLS + page login premium + layout admin + sidebar + dashboard placeholder. Vous testez la connexion, créez les premiers comptes, puis on enchaîne Phase 2.

Une fois le plan approuvé, je commence par la migration base de données.
