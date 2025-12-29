# 🍭 Guide des Requêtes & Réponses API - PlanÉtude Girly

Ce document détaille les structures JSON (Body et Response) pour TOUS les endpoints. ✨

---

## 🔐 1. Authentification (`/auth`)

### Inscription / Connexion (`POST /register` & `POST /login`)
**Request Body :**
```json
{
  "name": "Sakura", // Uniquement pour /register
  "email": "sakura@love.com",
  "password": "monSecretRose123",
  "gender": "F" // Optionnel: M, F ou O
}
```
**Statut :** `201 Created` ou `200 OK`
```json
{
  "_id": "658dc...",
  "name": "Sakura",
  "email": "sakura@love.com",
  "token": "eyJhbG...", 
  "refreshToken": "7f8a9b..."
}
```

### Connexion Google (`POST /google`)
**Request Body :**
```json
{
  "idToken": "google_oauth_id_token_here"
}
```
**Statut :** `200 OK`
```json
{
  "_id": "658dc...",
  "name": "Sakura Bloom",
  "email": "sakura@gmail.com",
  "avatar": "https://lh3.googleusercontent.com/...",
  "token": "eyJhbG...",
  "refreshToken": "7f8a9b..."
}
```

### Refresh Token (`POST /refresh`)
**Request Body :**
```json
{
  "token": "votre_refresh_token_actuel"
}
```
**Statut :** `200 OK`
```json
{
  "token": "newAccess.eyJhbG...",
  "refreshToken": "newRefresh.7f8a9b..."
}
```

---

## 💬 2. PixelCoach IA (`/chat`)

### Envoyer un message (`POST /`)
**Request Body :**
```json
{
  "message": "Coucou PixelCoach ! Peux-tu m'aider à organiser mes révisions de Maths ?"
}
```
**Statut :** `200 OK`
```json
{
  "response": "Coucou ! Voici ton nouveau planning ! 🌸",
  "planningCreated": true,
  "planning": {
    "_id": "658dd...",
    "periode": "jour",
    "sessions": [
      {
        "matiere": "Maths",
        "debut": "2025-12-30T09:00Z",
        "fin": "2025-12-30T10:30Z",
        "statut": "en_attente"
      }
    ]
  }
}
```

---

## 📅 3. Plannings (`/planning`)

### Créer un Planning (`POST /`)
**Request Body :**
```json
{
  "periode": "jour", // 'jour', 'semaine' ou 'mois'
  "dateDebut": "2025-12-30T00:00:00.000Z",
  "sessions": [
    {
      "matiere": "Maths",
      "debut": "2025-12-30T09:00:00.000Z",
      "fin": "2025-12-30T10:30:00.000Z",
      "notes": "Chapitre sur les intégrales"
    }
  ]
}
```
**Statut :** `201 Created`

### Liste des plannings (`GET /`)
**Statut :** `200 OK`
```json
{
  "plannings": [
    {
      "_id": "658dd...",
      "periode": "semaine",
      "dateDebut": "2025-12-29T00:00Z",
      "sessions": [
        { "matiere": "Français", "debut": "...", "fin": "...", "statut": "termine" }
      ]
    }
  ],
  "pagination": { "total": 12, "page": 1, "pages": 2 }
}
```

---

## 🏆 4. Statistiques & Progrès (`/stats`, `/progress`, `/badges`)

### Enregistrer un Progrès (`POST /progress`)
**Request Body :**
```json
{
  "sessionsCompletees": 2,
  "tempsEtudie": 120, // en minutes
  "date": "2025-12-29T18:00:00.000Z", // Optionnel
  "notes": "Session super productive ! ✨"
}
```
**Statut :** `201 Created`

### Dashboard Stats (`GET /stats`)
**Statut :** `200 OK`
```json
{
  "gamification": {
    "xp": 1250,
    "level": 3,
    "streak": 5,
    "totalStudyTime": 480
  },
  "completionRate": 85,
  "timeBySubject": [
    { "_id": "Maths", "totalMinutes": 120 }
  ]
}
```

---

## 🔔 5. Rappels (`/reminders`)

### Créer un Rappel (`POST /`)
**Request Body :**
```json
{
  "title": "Révision Histoire",
  "date": "2025-12-30T14:30:00.000Z",
  "planningId": "658dd..." // Optionnel
}
```
**Statut :** `201 Created`

---

## 👤 6. Profil Utilisateur (`/user/profile`)

### Mettre à jour le profil (`PUT /profile`)
**Request Body :** (Partial possible)
```json
{
  "name": "Sakura Bloom",
  "gender": "F",
  "preferences": {
    "themes": ["pink", "pastel"],
    "matieres": ["Maths", "Art"]
  }
}
```
**Statut :** `200 OK`

---

## 🚨 7. Gestion des Erreurs

### Erreur de Validation (Zod)
**Statut :** `400 Bad Request`
```json
{
  "status": "error",
  "message": "Données invalides 🎀",
  "errors": [
    { "path": ["body", "email"], "message": "Format email invalide" }
  ]
}
```

---
*Note : Pour les exports PDF et iCal, la réponse est un flux binaire (binary stream) avec le Content-Type approprié (`application/pdf` ou `text/calendar`).*
