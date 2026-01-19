# 🌸 PlanÉtude - Frontend

Application frontend React/TypeScript/Vite pour la gestion d'études avec gamification.

## 🚀 Démarrage Rapide

### Configuration Environnement

1. **Copiez le fichier exemple :**
   ```bash
   cp .env.example .env
   ```

2. **Modifiez les variables selon votre environnement :**
   ```env
   # Pour développement local
   VITE_API_URL=http://localhost:3001/api

   # Pour production
   # VITE_API_URL=https://plan-etude.koyeb.app/api
   ```

### Installation & Lancement

```bash
# Installation des dépendances
pnpm install

# Démarrage en développement
pnpm dev

# Build de production
pnpm build

# Aperçu production
pnpm preview
```

## 🔧 Configuration Environnement

### Variables d'Environnement

| Variable | Description | Défaut | Obligatoire |
|----------|-------------|---------|-------------|
| `VITE_API_URL` | URL complète de l'API | `http://localhost:3001/api` | ✅ |
| `VITE_DEV_MODE` | Active les logs détaillés | `false` | ❌ |
| `VITE_APP_NAME` | Nom de l'application | `PlanÉtude` | ❌ |

### Environnements

- **`.env`** : Configuration locale (ignoré par git)
- **`.env.example`** : Modèle de configuration
- **`.env.production`** : Configuration production (optionnel)

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages de l'application
├── services/           # Services API
├── contexts/           # Contextes React (Auth, Theme, Music)
├── types/              # Types TypeScript
├── utils/              # Utilitaires
├── constants/          # Constantes
└── assets/             # Assets statiques
```

### Fonctionnalités Principales

- ✅ Authentification JWT
- ✅ Gestion des plannings d'étude
- ✅ Suivi des progrès avec gamification
- ✅ Gestion des matières
- ✅ Thèmes personnalisables
- ✅ Musique LoFi intégrée
- ✅ Interface responsive
- ✅ Animations Framer Motion

## 🛠️ Technologies

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React Query** - Gestion état serveur
- **Socket.io** - Temps réel
- **Recharts** - Graphiques

## 📝 Scripts Disponibles

```bash
pnpm dev          # Serveur développement
pnpm build        # Build production
pnpm preview      # Aperçu production
pnpm lint         # Linting ESLint
```

## 🔐 Authentification

L'application utilise un système JWT avec :

- **Login/Register** : Authentification classique
- **Google OAuth** : Connexion Google (optionnel)
- **Refresh Tokens** : Gestion automatique des sessions
- **Middleware Admin** : Protection des routes admin

## 🎨 Thèmes & UI

- **Design Kawaii** : Style mignon et coloré
- **Thèmes dynamiques** : Changement en temps réel
- **Animations fluides** : Framer Motion
- **Responsive** : Adapté mobile/desktop
- **Dark/Light mode** : Support natif

## 🔌 API Integration

L'application communique avec l'API backend via :

- **Services typés** : Un service par domaine métier
- **React Query** : Cache et synchronisation
- **Error handling** : Gestion d'erreurs centralisée
- **Auth automatique** : Injection du token JWT

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Configuration production
vercel env add VITE_API_URL
```

### Configuration Build

- **SPA routing** : Configuré pour React Router
- **Asset optimization** : Images, CSS, JS optimisés
- **PWA ready** : Structure prête pour PWA

---

*Voir aussi : [Backend API](../PlanEtudeBackend/README.md)*
