# 🍭 Guide des Réponses API (JSON Examples) - PlanÉtude Girly

Ce document détaille les structures JSON renvoyées par l'API pour TOUS les endpoints. ✨

---

## 🔐 1. Authentification (`/auth`)

### Inscription / Connexion (`POST /register` & `POST /login`)
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

---

## 💬 2. PixelCoach IA (`/chat`)

### Envoyer un message (`POST /`)
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

### Metrics Mistral (`GET /metrics`)
**Statut :** `200 OK`
```json
{
  "calls": 42,
  "failures": 1,
  "circuitOpen": false
}
```

---

## 📅 3. Plannings (`/plannings`)

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
      ],
      "createdAt": "2025-12-29T..."
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "pages": 2
  }
}
```

---

## 🏆 4. Statistiques & Progrès (`/stats`, `/progress`, `/badges`)

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
  ],
  "progressHistory": [
    { "date": "2025-12-28T...", "sessionsCompletees": 3, "tempsEtudie": 120 }
  ]
}
```

### Liste des Badges (`GET /badges`)
**Statut :** `200 OK`
```json
[
  {
    "_id": "658de...",
    "key": "first_step",
    "name": "Premier Pas",
    "description": "Tu as terminé ta première session !",
    "awardedAt": "2025-12-28T..."
  }
]
```

---

## 🔔 5. Rappels (`/reminders`)

### Liste des Rappels (`GET /`)
**Statut :** `200 OK`
```json
[
  {
    "_id": "658df...",
    "title": "Réviser l'Histoire",
    "date": "2025-12-30T15:00:00.000Z",
    "planningId": "658dd..."
  }
]
```

---

## � 6. Profil Utilisateur (`/user/profile`)

### Récupérer le profil (`GET /`)
**Statut :** `200 OK`
```json
{
  "_id": "658dc...",
  "name": "Sakura",
  "email": "sakura@love.com",
  "gender": "F",
  "avatar": "https://...",
  "preferences": {
    "themes": ["pastel", "pink"],
    "matieres": ["Maths", "Art"]
  },
  "gamification": {
    "xp": 1250,
    "level": 3,
    "streak": 5
  }
}
```

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

### Erreur 404 (Non trouvé)
**Statut :** `404 Not Found`
```json
{
  "status": "error",
  "message": "Oups ! Cette ressource a disparu. ✨"
}
```

---
*Note : Pour les exports PDF et iCal, la réponse est un flux binaire (binary stream) avec le Content-Type approprié (`application/pdf` ou `text/calendar`).*
