# Plan global

Beaucoup de chantiers en un seul tour. Voici l'ordre d'exécution et les hypothèses.

## Hypothèses qui demandent ta validation

1. **Montants Bornage / R+1** — tu n'as pas donné les chiffres. Je propose :
   - Bornage 2 ha (Géomatique) : **600 000 FCFA** (CA brut)
   - Construction R+1 — Suivi de chantier : **CA brut 18 000 000 FCFA**, bénéfice net SKAL **900 000 FCFA** (marge ≈ 5%, comme demandé "marges plus basses sur les constructions")
2. **Marges construction** — je requalifie les projets BTP livrés pour distinguer `budget` (CA brut) et `amount_collected` (bénéfice net SKAL). Je baisse les marges :
   - Plan Maison Vue en plan : 250k = bénéfice (inchangé, c'est un plan, pas un chantier)
   - Plan Maison Élégance : 350k = bénéfice (inchangé)
   - Construction R+1 : 900k bénéfice sur 18M CA

Dis-moi si je dois ajuster avant que j'exécute.

## Ordre d'exécution

```text
1. Bugs bloquants
   1.1 invite-user (intermittent) — logs + fix
   1.2 /admin/statistiques 404 — créer la page ou rediriger
   1.3 Tri projets par date partout (created_at desc défaut, options)
   1.4 Filtre domaine: clic sur domaine → liste filtrée

2. Données projets
   2.1 Ajouter "Site web La Ruche d'Or" (domaine Web & Digital, livré)
   2.2 Bornage 2 ha + Construction R+1 (montants + marges revues)
   2.3 Codes projet auto (trigger BD: SKAL-<DOMAINE>-<YYYY>-<NNN>)

3. Dashboard admin
   3.1 KPI "Total CA livré" + "Prix moyen projet" (sur projets livrés)

4. Factures
   4.1 Régénérer les factures existantes selon nouveaux prix + dates
   4.2 Logo SKAL sur la facture (PDF/HTML)
   4.3 Numérotation non-prédictible: INV-<YYYY>-<8 hex aléatoires>
       (séquence remplacée, conserver l'unicité)

5. Règles financières
   5.1 Ajouter colonne "case_description" + l'afficher dans l'UI Règles
       (explique en clair : "Cas 1 — Service 100% interne…", etc.)

6. Rapport IA
   6.1 Prompt corrigé: doit lire les projets livrés (2023-2025) + transactions
       historiques, ne pas dire "rien fait jusqu'à présent"
   6.2 Période par défaut = depuis création (pas seulement "ce mois")
```

## Détails techniques (pour mémoire)

- **invite-user**: l'erreur "non-2xx" intermittente vient probablement d'un email déjà invité (`inviteUserByEmail` renvoie 422 si l'utilisateur existe). Je vais détecter ce cas et tomber sur `auth.admin.generateLink` + insert rôle, idempotent.
- **Codes projet**: trigger `BEFORE INSERT` qui pose `code = 'SKAL-' || left(domain,3) || '-' || YYYY || '-' || lpad(seq,3,'0')` si `code` nul.
- **N° facture**: remplacer `set_invoice_number` par `'INV-' || YYYY || '-' || upper(encode(gen_random_bytes(4),'hex'))` (32 bits = collisions improbables) + index unique pour resécuriser.
- **Logo facture**: lire `/public/skal-logo.svg`, l'inliner dans le HTML d'impression.
- **Stats 404**: il existe `Statistiques` dans la sidebar mais aucune route. Je crée `/admin/statistiques` réutilisant `AdminDashboard` enrichi (KPI + graphes simples).
- **Filtre domaine**: `AdminDomains` doit linker vers `/admin/projets?domain=<x>` et `AdminProjects` doit lire `useSearchParams`.

## Hors scope

Pas de refonte visuelle des composants, pas de nouvelle feature non listée, pas de migration destructive.
