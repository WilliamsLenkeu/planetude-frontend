# Audit API Frontend ↔ Backend

## Résumé

| Service | Statut | Problèmes |
|---------|--------|-----------|
| auth.service | ✅ OK | - |
| user.service | ❌ Erreurs | Mauvais préfixe `/users` au lieu de `/auth` |
| planning.service | ⚠️ Partiel | Export ICal : mauvais path ; Export PDF : absent backend |
| subject.service | ✅ OK | - |
| theme.service | ⚠️ Partiel | unlock/set : endpoints absents du module themes |
| lofi.service | ⚠️ Partiel | getByCategory : mauvais path (query param attendu) |
| stats.service | ❌ Erreurs | `/stats` non monté dans l'app |
| progress.service | ✅ OK | - |
| reminder.service | ❌ Erreurs | `/reminders` inexistant (module non implémenté) |

---

## Détail des corrections

### 1. user.service
- **Actuel** : `/users/profile`, `/users/change-password`
- **Backend** : Profil sous `/api/auth` → `/auth/profile` (GET, PUT)
- **change-password** : Non disponible dans les modules (legacy uniquement)

### 2. planning.service
- **Export ICal** : `/planning/:id/export/ical` → `/planning/:id/export.ical` (point, pas slash)
- **Export PDF** : Backend n'expose pas d'export PDF (planning module)

### 3. theme.service
- **unlock** : `/themes/unlock/:key` → Backend : `POST /auth/unlock-theme` avec body `{ themeKey }`
- **set** : `/themes/set/:key` → Non disponible dans le module themes actuel

### 4. lofi.service
- **getByCategory** : `/lofi/category/:category` → Backend : `GET /lofi?category=xxx` (query param)

### 5. stats.service
- **getGlobalStats** : utilise `/stats/subjects` et `/stats/heatmap`
- **Backend** : `/api/stats` n'est pas monté (module stats absent)
- **Alternative** : Utiliser `/progress/summary` et `/progress/stats` uniquement

### 6. reminder.service
- **Backend** : Aucun module `/api/reminders` (prévu mais non implémenté)
- `getAll` : retourne `[]` en cas d'erreur (404)
- `create`, `update`, `delete` : lèvent une erreur explicite

### 7. auth.service (refresh)
- **Backend** attend `{ token: string }` (le refresh token), pas `{ refreshToken }`
- **Correction** : body `{ token: refreshToken }`

### 8. Inscription
- **Backend** exige `gender: 'M' | 'F'` (RegisterUserDto)
- **Correction** : envoi par défaut `gender: 'M'` si absent

---

## Format des réponses Backend

Les modules renvoient généralement :
```json
{ "success": true, "data": {...}, "message": "..." }
```

Les services frontend gèrent déjà `response?.data || response` pour la plupart.
