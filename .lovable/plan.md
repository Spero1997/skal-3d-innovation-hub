# Plan d'exécution (1 → 2 → 3)

Le périmètre est large. Je le découpe en 3 phases livrables séquentiellement. **Tu approuves le plan, puis j'exécute Phase 1 d'abord et je te rends la main pour valider avant la 2, etc.** Sinon je risque de tout casser en un seul gros commit.

---

## Phase 1 — Bug "Ajouter un rôle" + diagnostic global des boutons

**Diagnostic à faire d'abord** (je n'ai pas l'erreur exacte) :
- Ouvrir `/admin/equipe`, tenter d'ajouter un rôle, lire la console et le réseau via outils de debug
- Vérifier que le `Select` du dropdown se réinitialise après sélection (bug courant : valeur reste collée)
- Vérifier RLS `user_roles` (déjà : seul `super_admin` peut INSERT — OK si tu es super_admin)
- Vérifier trigger `on_user_role_change` (SECURITY DEFINER — devrait passer)

**Corrections probables** :
- Réinitialiser le `Select` après `grantRole` (bug UI le plus probable)
- Ajouter logs d'erreur détaillés (`toast.error(error.message)`) sur tous les boutons critiques
- Audit rapide des boutons de validation principaux : `NewInvoiceDialog`, `NewProjectDialog`, `NewTransactionDialog`, `ShareDocumentDialog`, `SignDocumentDialog`, marquer facture payée, créer client. Ajouter feedback erreur clair partout.

**Livrable Phase 1** : ajout rôle fonctionne + erreurs lisibles sur tous les CTA admin.

---

## Phase 2 — Import des projets déjà réalisés en admin

**Projets visibles sur le site** (`src/data/projects.ts`) : je vais lire ce fichier pour récupérer la liste exhaustive (nom, client, domaine, budget si présent, dates…).

**Pour chaque projet historique** :
1. Créer le **client** si absent (table `clients`)
2. Créer le **projet** avec statut `livre` ou `termine`, dates passées, budget, `amount_collected = budget` (déjà encaissé), `progress = 100`
3. Créer un **devis** (table `devis_requests` ou via documents — à confirmer, probablement document kind=`devis`)
4. Créer une **facture** finale : statut `payee`, `amount_paid = amount_ttc`, ligne d'articles plausible
5. **Pas de répartition** (`distribution_case = NULL`, pas de `revenue_distributions`) — comme demandé
6. Ajouter quelques documents factices (livrables) si pertinent

**Méthode** : script SQL via outil `insert` (insertion en masse), pas de migration de schéma.

**Livrable Phase 2** : tous les projets historiques visibles dans `/admin/projets`, `/admin/factures`, `/admin/clients`.

---

## Phase 3 — Guide Admin HTML + Glossaire + Parcours Secrétaire + IA répartition

### 3a. Refonte `SKAL-Guide-Admin.html`
- Mettre à jour : **Secrétaire = Comptable + Chef de projet** (cumul des deux rôles), avec ses responsabilités explicites
- **Glossaire enrichi** : passer de ~10 à ~80 termes. Catégories :
  - Métier (devis, facture pro-forma, facture définitive, acompte, solde, BL, PV de réception, OS, avenant, retenue de garantie)
  - Comptable (créance, dette, encaissement, décaissement, trésorerie, marge, EBE, BFR, TVA, HT, TTC)
  - Projet (jalon, livrable, sprint, kanban, Gantt, dépendance, criticité, charge)
  - SKAL spécifique (Caisse 15%, Cas 1/2/3, Apporteur d'affaires, Prestataire interne/externe, Associé, Direction)
  - Technique (RLS, rôle, permission, audit log, notification, edge function)
- **Parcours Secrétaire A → Z** : section dédiée pas-à-pas après recrutement :
  1. Première connexion (réinitialisation mot de passe, profil)
  2. Découverte de l'interface (sidebar, recherche globale, notifications)
  3. Saisir un nouveau client + projet
  4. Émettre un devis → suivi → conversion en facture
  5. Marquer une facture payée + déclencher répartition IA
  6. Gérer les documents (upload, partage, signature, versions)
  7. Suivi quotidien (caisse, rapports hebdo, alertes)
  8. Cas particuliers (avoir, annulation, retard de paiement, relance)

### 3b. Répartition IA (caisse 15% obligatoire, règles + IA fallback)
- Compléter les `finance_rules` existantes pour couvrir tous les cas connus (Cas 1 interne, Cas 2 forfait, Cas 3 au coût, par domaine)
- Modifier la fonction `handle_revenue_distribution` : si aucune règle ne matche, au lieu d'exiger `distribution_case`, appeler une nouvelle edge function `ai-suggest-distribution` qui propose une répartition (caisse=15% toujours, reste selon contexte projet) et la stocke en `en_attente_validation`
- Edge function `ai-suggest-distribution/index.ts` : Lovable AI (Gemini 2.5 flash), prompt strict garantissant caisse 15%, sortie JSON structurée
- UI : sur `/admin/finances/validations`, afficher la suggestion IA avec bouton accepter/modifier/rejeter

---

## Découpage technique

```text
Phase 1  → ~3-5 fichiers édités, 0 migration   (rapide, <10 min)
Phase 2  → 1 gros INSERT SQL via outil insert   (rapide, dépend du nb de projets)
Phase 3a → SKAL-Guide-Admin.html (rewrite total ~1500 lignes)
Phase 3b → 1 migration + 1 edge function + 1 UI update
```

---

## Question d'arbitrage avant de démarrer

**Confirme juste** : tu veux que je fasse les 3 phases d'affilée dans une seule longue réponse (risque : énorme, je peux rater des choses) — OU phase par phase avec ta validation entre chaque (recommandé) ?

Si tu ne réponds pas sur ce point, je pars sur **phase par phase**.