# Décisions techniques — PlanÉtude Frontend

## 2025-02-26 — Refonte UI complète

### Contexte
Refonte totale de l'interface utilisateur pour un design system cohérent et une identité visuelle distinctive.

### Changements principaux

**Design system**
- Variables CSS sémantiques unifiées (`--color-primary`, `--color-background`, `--color-text`, etc.)
- Harmonisation ThemeContext et index.css avec fallbacks
- Typographie : DM Sans (remplace Quicksand/Fredoka/Inter)
- Composants : `.btn`, `.card`, `.input`, `.badge` avec variantes

**Composants**
- `PageHeader` : en-tête réutilisable (titre, description, action)
- `Card` : support `onClick`, `padding` configurable
- `Button` : variantes primary/secondary/ghost, tailles sm/md/lg
- `Modal` : animations Framer Motion
- `LoadingSpinner` : prop `label` optionnelle

**Navigation**
- Header avec nav desktop (Accueil, Planning, Matières, Stats, Lo-Fi, Thèmes)
- Avatar cliquable → Profil
- Mobile : barre fixe (Accueil, Planning, Profil)
- Bouton déconnexion fixe (desktop uniquement)

**Pages**
- Home : CTA Connexion / Inscription
- Auth : formulaires épurés, animations
- Dashboard : cartes raccourcis cliquables
- Themes : sélecteur de thèmes fonctionnel (intégration THEMES)
- Toutes les pages : `PageHeader` + variables sémantiques

**Layout**
- Fond subtil avec dégradés (opacity 6–8 %)
- MiniPlayer : desktop uniquement, masqué sur mobile
- Padding bottom pour éviter chevauchement avec nav mobile
