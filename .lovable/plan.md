# Phase 7 — Moteur financier dynamique & sécurité IA

Objectif : transformer la logique de répartition aujourd'hui codée en dur (cas1/cas2/cas3 dans `handle_revenue_distribution`) en un **moteur de règles administrable**, et poser les fondations de confidentialité pour les futurs agents IA.

Travail conséquent → je découpe en 4 lots livrables successivement. Je commence par valider le périmètre avec toi avant d'écrire la première migration.

---

## Lot 1 — Schéma "Finance Engine" (base de données)

Nouvelles tables (toutes RLS `super_admin` only en écriture, `is_direction` en lecture) :

- `finance_rule_sets` — un jeu de règles nommé (ex. "Modèle Skal v2", "Modèle BTP forfait"). Champs : `name`, `description`, `is_active`, `version`, `effective_from`, `effective_to`.
- `finance_rules` — règles ordonnées dans un set. Champs : `rule_set_id`, `priority`, `condition` (JSONB : `{ project_domain, project_type, has_apporteur, has_prestataire_externe, amount_min, amount_max, involvement_level, ... }`), `allocations` (JSONB : tableau `[{ beneficiary_type, beneficiary_role, basis: 'gross'|'net_after_caisse'|'net_after_costs', percent, fixed_amount }]`), `requires_validation` (bool), `notes`.
- `beneficiary_types` — catalogue : `caisse`, `spero`, `associe`, `apporteur_affaires`, `prestataire_interne`, `prestataire_externe`, `commission_commercial`, `dividende_pool`, `custom`.
- `apporteurs_affaires` — annuaire (nom, type, taux par défaut, statut).
- `prestataires` — annuaire (nom, interne/externe, taux ou coût, projets liés).
- `commissions` — calculées par règle, liées à `transaction_id` + `beneficiary_id` + montant + statut (`a_valider|valide|paye`).
- `financial_validations` — workflow : `entity_type` (transaction|distribution|payout|commission), `entity_id`, `requested_by`, `validator_id`, `status`, `comment`, `validated_at`.
- `financial_scenarios` — simulations sauvegardées (snapshot d'un rule_set + paramètres) pour tester avant activation.
- `ai_confidentiality_levels` — enum stockée (`public`, `internal`, `restricted`, `secret`) + table de mapping `ai_data_access` (`role`, `entity`, `max_level`).

Refonte de `handle_revenue_distribution` :
- Devient un orchestrateur qui charge le `finance_rule_set` actif, évalue les règles par priorité, applique la première qui matche, écrit dans `revenue_distributions` + `cash_movements` + `commissions`.
- Si `requires_validation = true` → la distribution passe en statut `en_attente_validation` au lieu d'être finalisée.
- Fallback : si aucune règle ne matche → garde les 3 cas historiques pour rétro-compatibilité.

Nouveau type enum `distribution_status` : `appliquee | en_attente_validation | rejetee | annulee`.

## Lot 2 — Panneau Super Admin "Règles financières"

Nouvelles pages (toutes gated par `hasRole('super_admin')`) :

- `/admin/finances/regles` — liste des `rule_sets`, activer/désactiver, dupliquer, versionner.
- `/admin/finances/regles/:id` — éditeur visuel : drag-and-drop des règles, conditions, allocations en % ou montant fixe, aperçu live "si revenu = X, voici la répartition".
- `/admin/finances/scenarios` — simulateur : choisir un rule_set + saisir des revenus fictifs → graphique de répartition (Recharts).
- `/admin/finances/validations` — file d'attente des distributions/commissions à valider.
- `/admin/finances/apporteurs` & `/admin/finances/prestataires` — annuaires CRUD.
- `/admin/finances/commissions` — suivi des commissions générées, statuts, paiements.
- `/admin/finances/dividendes` — déjà existant, étendu : pool calculé depuis le moteur.

Composants : `RuleBuilder`, `AllocationEditor`, `ConditionEditor`, `ScenarioSimulator`, `ValidationQueue`.

## Lot 3 — Sécurité IA & cloisonnement

- Table `ai_agents` (nom, modèle, niveau max accessible, system_prompt).
- Table `ai_data_access` (role × entity × max_confidentiality_level).
- Edge function `ai-query` : **toute** requête IA passe par là. Elle :
  1. Authentifie l'utilisateur (JWT).
  2. Récupère son rôle + le niveau de confidentialité de l'agent appelé.
  3. Filtre/masque les données avant envoi au modèle (jamais de % de répartition, jamais de capital, jamais de noms prestataires sauf rôle direction).
  4. Logge dans `ai_access_log` (qui, quoi, niveau, hash de la requête).
- Les calculs financiers sensibles (répartitions, commissions) sont **uniquement** exécutés dans des fonctions SQL `SECURITY DEFINER` ou edge functions — jamais recalculés côté client.
- Le frontend ne reçoit que les **résultats agrégés** auxquels le rôle a droit. Ex. un `chef_projet` voit "montant projet" mais jamais "part associé".
- Mémoire de sécurité mise à jour : règles financières = `secret`, agents IA ne peuvent jamais les exposer.

## Lot 4 — Moteur IA d'auto-classification

Edge function `ai-classify-project` (Lovable AI Gateway, `google/gemini-3-flash-preview`) :
- Input : description projet + métadonnées.
- Output structuré (AI SDK `Output.object`) : `{ project_type, suggested_domain, involvement_level, suggested_rule_set_id, confidence }`.
- Appelée à la création d'un projet ou d'une transaction → propose la règle à appliquer, le super_admin valide.
- Edge function `ai-generate-financial-report` : rapport mensuel/trimestriel à partir de `finance_summary` + distributions, en respectant le niveau de confidentialité du demandeur.

---

## Détails techniques

- Stack : conserve React/Vite/Tailwind + Lovable Cloud. Pas de nouveau framework.
- Toutes les nouvelles tables ont RLS strict. Les fonctions de calcul sont `SECURITY DEFINER` avec `EXECUTE` révoqué de `PUBLIC`/`anon`/`authenticated`.
- Migration backwards-compatible : un rule_set "Skal Historique v1" est seedé avec les 3 cas existants pour que rien ne casse.
- Recharts pour les graphes de simulation.
- AI SDK + Lovable AI Gateway pour les edge functions IA (jamais d'appel direct OpenAI/Google).

---

## Question avant de démarrer

C'est ~4 livraisons. Tu veux que :

**A.** Je livre **tout en une fois** (gros message, ~15-20 fichiers, plusieurs migrations) ?
**B.** Je livre **lot par lot** en attendant ton feu vert entre chaque ? (recommandé : tu peux tester le moteur avant qu'on branche l'IA dessus).
**C.** Tu veux d'abord juste le **Lot 1 + Lot 2** (moteur + panneau admin) et on verra l'IA plus tard ?

Dis-moi A / B / C et je lance.
