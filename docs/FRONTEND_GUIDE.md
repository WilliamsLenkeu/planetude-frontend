**PRD Frontend — PlanÉtude**

Version: 1.0
Dernière mise à jour: 27 décembre 2025

But du document
- Décrire l'expérience utilisateur, l'interface, l'architecture technique et l'intégration avec l'API backend afin que l'équipe frontend puisse implémenter une application cohérente, testable et livrable.

Contexte produit
- PlanÉtude est une application d'aide aux révisions (planning, IA conversationnelle, rappels, suivi de progrès). L'UI doit être axée utilisateur jeune et féminine (esthétique "kawaii / girly") sans utiliser d'éléments sous licence (Hello Kitty). Le frontend consommera l'API exposée par le backend (voir `docs/API_GUIDE.md`).

1. Objectifs
- UX principale: permettre à l'utilisateur de créer un planning, interagir avec la chat-IA, suivre ses progrès et recevoir des rappels.
- KPI: temps de chargement initial < 1s (mobile), TTFB < 300ms pour pages critiques, disponibilité UI 99.5%.

2. Utilisateurs cibles
- Étudiantes 12–25 ans, recherche d'un design mignon, navigation simple, interactions guidées.

3. Fonctions clés (High level)
- Authentification: inscription / login / refresh token.
- Dashboard: résumé planning, prochains rappels, badges.
- Planning: CRUD planning, export iCal / PDF.
- Chat IA: conversation avec anonymisation côté backend.
- Progrès: enregistrement sessions, affichage graphique, obtention de badges.
- Rappels: création et gestion.

4. Parcours utilisateur principaux
- Onboarding -> Inscription -> Création d'un planning -> Recevoir suggestions IA -> Suivre progrès -> Gagner badge

5. Contraintes non-fonctionnelles
- Accessibilité: WCAG AA (contraste, taille cible tappable)
- Internationalisation: français par défaut, préparation i18n (react-intl ou i18next)
- Sécurité: JWT over HTTPS, XSS/CSRF protections, ne pas stocker token long en localStorage sans précautions

6. Architecture technique recommandée
- Stack: `React` + `Vite` + `TypeScript` (starter). Si SSR requis: `Next.js`.
- Styling: `Tailwind CSS` + variables de thème. Composants UI: `Radix UI` ou `DaisyUI` pour accélérer.
- State: React Context/Zustand pour auth + planning store.
- HTTP client: `fetch` wrapper ou `axios` avec interceptor pour refresh token.
- Package manager: `pnpm` (cohérence projet).

7. Page map & composants
- Pages:
  - `/` Landing
  - `/auth/login`, `/auth/register`
  - `/dashboard`
  - `/planning` (list)
  - `/planning/[id]` (détail + export)
  - `/chat`
  - `/progress`
  - `/reminders`
  - `/profile`

- Composants réutilisables:
  - `Header`, `BottomNav` (mobile), `Card`, `Button` (variants), `FormInput`, `Modal`, `Avatar`, `Badge`, `Toast`, `KawaiiIcon` (SVG custom)

8. UI / Design system (spécifications)
- Palette (tokens):
  - `--color-primary`: #FF77A9 (rose)
  - `--color-primary-100`: #FFC0CB
  - `--color-accent`: #FFF3B0
  - `--color-bg`: #FFF0E6
  - `--text`: #333333
- Typographies: `Poppins` (UI), `Baloo 2` (décoratif)
- Radiuses: `--radius-sm: 8px`, `--radius-lg: 16px`
- Ombrages doux: `--shadow-soft: 0 6px 18px rgba(0,0,0,0.06)`

9. Maquette / layout
- Mobile-first. Header simplifié + bottom navigation. Dashboard: cards empilées (Prochains rappels, Progression, Badges). Éléments décoratifs: petits coeurs/pois SVG en filigrane.

10. UX details (girly / kawaii)
- Formes rondes, micro-animations douces (duration 160ms), confettis légers lors d'un badge, transitions easing cubic-bezier.
- Accessibilité: option thème sombre, labels explicites.

11. Intégration API (contrats essentiels)
- Base URL: configurable via `VITE_API_URL`.
- En-têtes communs:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (pour routes protégées)

11.1 Auth
- POST `/api/auth/register` — body `{ name, email, password, gender }` → 201 { token, refreshToken }
- POST `/api/auth/login` — body `{ email, password }` → 200 { token, refreshToken }
- POST `/api/auth/refresh` — body `{ token }` → 200 { token }

11.2 Planning
- GET `/api/planning` — liste
- POST `/api/planning` — créer planning
- PUT `/api/planning/:id` — update
- GET `/api/planning/:id/export.ical` — export iCal (binary)
- GET `/api/planning/:id/export.pdf` — export PDF (binary)

11.3 Chat IA
- POST `/api/chat` — body `{ message }` (backend anonymise) → 200 { response, planningCreated? }
- GET `/api/chat/metrics` — métriques IA

11.4 Progrès / Rappels / Badges
- POST/GET `/api/progress`, `/api/reminders`, `/api/badges` — standard CRUD

12. Exemples d'implémentation (fetch wrapper)
```ts
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL as string;

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw { status: res.status, data };
  return data;
}
export default request;
```

Exemple: register
```ts
await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, gender }) });
```

13. Gestion des tokens (flow recommandé)
- Stocker `access token` en mémoire. Utiliser un cookie HttpOnly pour `refresh token` si backend le permet.
- Interceptor: si 401 -> appeler `/api/auth/refresh` -> retry requête originale.

14. Tests & acceptance criteria
- Critères d'acceptation par page (ex. register: 201 et redirection; planning: CRUD OK et export téléchargeable)
- E2E: Cypress scripts pour scénarios clés (register/login/create planning/chat)

15. Livraison & checklist
- Repo starter (`Vite+React+TS`) + Tailwind config
- Composants atoms + templates pages
- Tests E2E et docs d'intégration API (`docs/API_GUIDE.md`)

16. Assets & licence
- Ne pas utiliser Hello Kitty officiel (licence). Préférer mascotte originale ou packs commerciaux.

ANNEXE — Checklist rapide pour dev
- `VITE_API_URL` configuré
- Auth flow implémenté
- Tests E2E basiques

Contact: équipe backend — voir `README.md` pour endpoints détaillés.

---

Fin du PRD frontend.
- Rendu et bundling : `pnpm` (convention du projet), config `vite` + TypeScript.
- Tests frontend : Jest + React Testing Library, Cypress pour tests end-to-end.
- Design / prototypes : Figma (composants, variantes responsive).

Remarque légale : "Hello Kitty" est une marque déposée. Ne pas utiliser d'images/mascotte officielles sans licence. Préférer une esthétique "kawaii" inspirée (pastels, rubans, motifs, yeux ronds) ou créer une mascotte originale.

2) Palette, typographie et tokens (suggestion)
- Couleurs principales :
  - Rose pastel : #FFC0CB
  - Rose fort : #FF77A9
  - Pêche / crème : #FFF0E6
  - Lilas : #CDA4FF
  - Accent or / jaune doux : #FFF3B0
- Couleurs UI (textes, surfaces) :
  - Texte sombre : #333333
  - Surface claire : #FFFFFF
- Typographie : Google Fonts `Poppins` (sans serif) pour textes, `Baloo 2` ou `Satisfy` pour éléments décoratifs / logo.
- Tokens : créer variables `--color-primary`, `--color-accent`, `--bg`, `--radius-lg`, `--shadow-soft`.

3) Structure d'application (pages & composants)
- Pages principales :
  - `/` : Landing / features
  - `/auth/login` & `/auth/register` : Formulaires (validation client)
  - `/dashboard` : Vue principale (planning synthèse, badges, prochains rappels)
  - `/planning` : CRUD planning, vue calendrier / liste
  - `/planning/[id]` : Détails session, export (.ics / PDF)
  - `/chat` : Chat IA (composer message, suggestions), historique
  - `/progress` : Tracking, graphiques, badges
  - `/reminders` : Liste rappels, création
  - `/profile` : Compte, préférences, intégrations
- Composants réutilisables : `Header`, `Footer`, `Card`, `Button` (variants), `Modal`, `FormInput`, `Avatar`, `Badge`, `KawaiiIcon` (custom), `Toast`.
- Layouts : `AuthLayout`, `AppLayout` (sidebar / mobile bottom nav), responsive breakpoints.

4) UX / UI guidelines (style girly, kawaii)
- Utiliser formes douces (bords arrondis 12–24px), ombres douces, icons arrondies.
- Décors : petits motifs (pois, coeurs), ruban en tête de page, badges décoratifs pour récompenses.
- Micro-interactions : animation douce (scale 1.03) sur hover, confettis légers à l'obtention d'un badge.
- Contraste & accessibilité : conserver ratio contrast > 4.5 pour textes importants, fournir option thème clair/sombre.
- Assets : privilégier SVG vectoriels et icônes personnalisées. Éviter images bitmap lourdes.

5) Intégration API — principes
- Base URL : config via variable d'environnement `VITE_API_URL`.
- Auth : JWT Bearer. Après login/register stocker `access token` en mémoire (React state) et `refresh token` en cookie HttpOnly via backend (si backend supporte). Si impossible, stocker refresh en secure storage et penser rotation.
- En-têtes : `Authorization: Bearer <token>`.
- Erreurs : standardiser les erreurs, vérifier `status` et corps JSON `{ message, errors }`.
- Timeout & retry : utiliser fetch wrapper avec timeout (5–10s) et 1 retry pour endpoints idempotents.

6) Exemples d'appels (fetch + axios)
- Exemple générique fetch wrapper (TypeScript) :

```ts
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw { status: res.status, data };
  return data;
}
export default request;
```

- Auth register/login
```ts
await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, gender }) });
const login = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
const token = login.token;
```

- Exemple obtenir planning
```ts
await request('/api/planning', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
```

- Export iCal / PDF (download)
```ts
const res = await fetch(`${API_URL}/api/planning/${id}/export.pdf`, { headers: { Authorization: `Bearer ${token}` } });
const blob = await res.blob();
const url = URL.createObjectURL(blob);
// link click pour télécharger
```

- Chat IA
```ts
const chat = await request('/api/chat', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) });
```

Consulte `docs/API_GUIDE.md` pour la liste complète des endpoints et payloads.

7) Auth flow et refresh tokens
- Stocker `access token` en mémoire (pour sécurité) et utiliser endpoint `/api/auth/refresh` pour obtenir un nouveau token en cas d'expiration.
- Implémenter un interceptor (axios) ou wrapper fetch qui détecte 401 et déclenche refresh automatiquement.

8) Tests et CI
- Ajouter tests d'intégration end-to-end via Cypress (scripts `pnpm cypress:open` / `pnpm cypress:run`).
- En pipeline CI (GitHub Actions), définir `VITE_API_URL` vers staging et nettoyer BD avant tests (si possible) via endpoint admin protégé ou script remote.

9) Assets & licence
- Ne pas utiliser assets Hello Kitty officiels sans licence. Achetez des packs d'icônes kawaii ou créez mascotte originale.
- Polices Google proposées : `Poppins`, `Baloo 2`.

10) Checklist de livraison frontend
- [x] Starter repo (Vite + TS) initialisé
- [x] Theme tokens et Tailwind config créés
- [ ] Auth + protected routes implémentés
- [ ] Pages principales UI complètes (dashboard, planning, chat)
- [ ] Tests E2E basiques (register, login, create planning)
- [ ] Documentation d'intégration API (référencer `docs/API_GUIDE.md`)

## Installation

Suivez ces étapes pour configurer et exécuter le projet frontend :

1.  **Cloner le dépôt** (si ce n'est pas déjà fait) :
    ```bash
    git clone <URL_DU_DEPOT>
    cd planetude-frontend
    ```

2.  **Installer les dépendances** en utilisant pnpm :
    ```bash
    pnpm install
    ```

3.  **Configurer Tailwind CSS** (si `tailwind.config.cjs` et `postcss.config.cjs` n'existent pas encore ou doivent être régénérés) :
    ```bash
    pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/postcss
    pnpm exec tailwindcss init -p
    ```
    Assurez-vous que `postcss.config.cjs` contient :
    ```javascript
    module.exports = {
      plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
      },
    };
    ```
    Et que `src/index.css` inclut les directives Tailwind :
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

4.  **Lancer l'application en mode développement** :
    ```bash
    pnpm dev
    ```
    L'application sera accessible à `http://localhost:5173` (ou un port similaire).

5.  **Exécuter la build de production** (pour vérification) :
    ```bash
    pnpm build
    ```

---

Annexe — Ressources utiles
- Design : Figma, Google Fonts
- UI Kit : Tailwind UI, DaisyUI
- Icônes : Heroicons, Phosphor Icons, ou pack kawaii premium

---

Fichier créé pour l'équipe frontend. Dis-moi si tu veux que je :
- Génère un repo starter `Vite + React + TS` avec le thème prêt à l'emploi
- Fournisse un kit Figma de base (maquette)
- Ajoute des snippets React pour composants clés (Header, Card, PlannerList)
