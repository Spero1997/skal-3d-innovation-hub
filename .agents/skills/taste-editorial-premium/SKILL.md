---
name: taste-editorial-premium
description: Filtre qualité anti-slop (racine Taste Skill) + thème visuel exclusif Editorial Premium pour Skal Services. À appliquer sur tout travail UI/visuel (typographie forte, contrastes soignés, asymétrie maîtrisée, minimalisme haut de gamme).
---

# Taste — Editorial Premium (Skal Services)

Deux couches indissociables :

1. **Moteur global anti-slop** — `references/anti-slop-engine.md` (issu du `SKILL.md` racine du pack Taste). Filtre qualité permanent : asymétrie, micro-interactions retenues, espacements, refus du look « IA générique ».
2. **Thème visuel exclusif** — `references/editorial-premium.md`. Dicte identité, atmosphère, grilles, typographie, hiérarchie. **Ignorer tous les autres thèmes** du pack (brutalism, dark-luxe, soft, etc.).

## Quand l'utiliser

À chaque demande touchant l'UI publique de Skal Services : hero, services, projets, CTA, footer, navigation, pages discipline/domaine, refontes et polish visuel. Ne pas appliquer aux écrans `/admin/*` sauf demande explicite.

## Procédure

1. Avant d'écrire du code visuel, lire `references/anti-slop-engine.md` puis `references/editorial-premium.md`.
2. Respecter les contraintes mémoire projet (palette cream / ink / tangerine `#F97316`, Fraunces + IBM Plex Mono, glassmorphism léger, fonds fixes).
3. En cas de conflit règle/mémoire, **la mémoire projet gagne**.
4. Tokens via `index.css` / `tailwind.config.ts` — jamais de couleurs en dur.

## Garde-fous Skal

- Aucune donnée confidentielle (capital, parts, prestataires nommés).
- Spero Mahussi Tometin n'est pas architecte — titres autorisés uniquement.
- Conserver le marquee header et le positionnement « guichet unique multidisciplinaire ».