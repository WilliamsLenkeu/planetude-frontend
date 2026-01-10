openapi: 3.0.0
info:
  title: PlanÉtude Girly API ✨
  version: 1.0.0
  description: Documentation de l'API PlanÉtude avec une touche de rose et de magie. 🍭🎀
  contact:
    name: PixelCoach Team
servers:
  - url: https://plan-etude.koyeb.app/api
    description: Serveur de production
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []
paths:
  /auth/register:
    post:
      summary: Inscrire un nouvel utilisateur 🎀
      tags:
        - Auth
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - password
              properties:
                name:
                  type: string
                  example: Sakura
                email:
                  type: string
                  format: email
                  example: sakura@love.com
                password:
                  type: string
                  minLength: 6
                  example: secret123
                gender:
                  type: string
                  enum:
                    - M
                    - F
                    - O
                  example: F
      responses:
        '201':
          description: Utilisateur créé avec succès ✨
          content:
            application/json:
              example:
                success: true
                message: Compte créé avec succès ! Bienvenue 🌸
                token: eyJhbGciOiJIUzI1NiIsInR5...
                user:
                  id: 658af...
                  name: Sakura
                  email: sakura@love.com
        '400':
          description: Données invalides ou email déjà utilisé ❌
          content:
            application/json:
              example:
                success: false
                message: Cet email est déjà utilisé par une autre princesse. 🎀
  /auth/login:
    post:
      summary: Se connecter à l'application 🍭
      tags:
        - Auth
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  example: sakura@love.com
                password:
                  type: string
                  example: secret123
      responses:
        '200':
          description: Connexion réussie 💖
          content:
            application/json:
              example:
                success: true
                token: eyJhbGciOiJIUzI1NiIsInR5...
                user:
                  id: 658af...
                  name: Sakura
                  xp: 150
                  level: 2
        '401':
          description: Identifiants incorrects 🔑
          content:
            application/json:
              example:
                success: false
                message: Oups ! Mot de passe ou email incorrect. 🍬
  /auth/refresh:
    post:
      summary: Rafraîchir le token d'accès 🔄
      tags:
        - Auth
      responses:
        '200':
          description: Nouveau token généré
          content:
            application/json:
              example:
                success: true
                accessToken: eyJhbGciOiJIUzI1Ni...
  /auth/google:
    post:
      summary: Connexion via Google 🌐
      tags:
        - Auth
      responses:
        '200':
          description: Connexion réussie via Google
          content:
            application/json:
              example:
                success: true
                token: eyJhbGciOiJIUzI1Ni...
  /chat:
    post:
      summary: Discuter avec l'assistant IA 🤖
      tags:
        - Chat
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - message
              properties:
                message:
                  type: string
                  example: Peux-tu m'aider à comprendre la photosynthèse ? 🌿
      responses:
        '200':
          description: Réponse de l'IA reçue ✨
          content:
            application/json:
              example:
                success: true
                response: >-
                  Bien sûr ! La photosynthèse est le processus par lequel les
                  plantes transforment la lumière du soleil en énergie... 🌿🌸
                history:
                  - role: user
                    content: ...
                  - role: assistant
                    content: ...
  /chat/metrics:
    get:
      summary: Récupérer les métriques d'utilisation du chat 📊
      tags:
        - Chat
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Métriques récupérées avec succès 📈
          content:
            application/json:
              example:
                success: true
                data:
                  totalMessages: 42
                  lastInteraction: '2023-12-30T10:30:00Z'
  /lofi:
    get:
      summary: Liste les pistes Lo-Fi relaxantes (DB + Jamendo) 🎧
      tags:
        - LoFi
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des pistes récupérées avec succès 🎵
          content:
            application/json:
              example:
                success: true
                count: 2
                data:
                  - title: Matin Calme 🌸
                    artist: Lofi Girl
                    url: https://api.jamendo.com/v3.0/tracks/...
                    thumbnail: https://images.unsplash.com/...
                    category: relax
                  - title: Focus & Study 📚
                    artist: Chill Hop
                    url: https://api.jamendo.com/...
                    thumbnail: https://images.unsplash.com/...
                    category: focus
    post:
      summary: Ajouter une piste Lo-Fi (Admin) ☁️
      tags:
        - LoFi
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  example: Nuit Étoilée 🌙
                artist:
                  type: string
                  example: Lofi Princess
                url:
                  type: string
                  example: https://youtube.com/...
                thumbnail:
                  type: string
                  example: https://img.youtube.com/...
                category:
                  type: string
                  example: relax
      responses:
        '201':
          description: Piste ajoutée avec succès ✨
          content:
            application/json:
              example:
                success: true
                message: Nouvelle piste ajoutée à la collection ! 🎵
  /planning:
    get:
      summary: Récupérer tous les plannings de l'utilisateur 🗓️
      tags:
        - Planning
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des plannings récupérée ✨
          content:
            application/json:
              example:
                success: true
                data:
                  - id: 658af...
                    title: Semaine d'Examens 📚
                    sessions:
                      - subjectId: 658bc...
                        startTime: '2023-12-30T09:00:00Z'
                        endTime: '2023-12-30T11:00:00Z'
    post:
      summary: Créer ou générer un nouveau planning 🤖
      tags:
        - Planning
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - sessions
              properties:
                title:
                  type: string
                  example: Ma semaine de révisions 📚
                sessions:
                  type: array
                  items:
                    type: object
                    properties:
                      subjectId:
                        type: string
                        example: 658bc...
                      startTime:
                        type: string
                        format: date-time
                        example: '2023-12-30T14:00:00Z'
                      endTime:
                        type: string
                        format: date-time
                        example: '2023-12-30T16:00:00Z'
      responses:
        '201':
          description: Planning créé avec succès ✨
          content:
            application/json:
              example:
                success: true
                message: Planning généré et enregistré ! 🤖
                data:
                  id: 658af...
                  title: Ma semaine de révisions 📚
  /planning/{id}:
    put:
      summary: Mettre à jour un planning existant 📝
      tags:
        - Planning
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          example: 658af...
      responses:
        '200':
          description: Planning mis à jour avec succès 🍭
          content:
            application/json:
              example:
                success: true
                message: Planning mis à jour ! ✨
    delete:
      summary: Supprimer un planning 🗑️
      tags:
        - Planning
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          example: 658af...
      responses:
        '200':
          description: Planning supprimé 🍬
          content:
            application/json:
              example:
                success: true
                message: Planning supprimé définitivement. 🗑️
  /planning/{id}/export.ical:
    get:
      summary: Exporter un planning au format iCal 📅
      tags:
        - Planning
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
      responses:
        '200':
          description: Fichier iCal généré
  /planning/{id}/export.pdf:
    get:
      summary: Exporter un planning en PDF (format Girly 🎀)
      tags:
        - Planning
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
      responses:
        '200':
          description: Fichier PDF généré
  /progress:
    get:
      summary: Récupérer tout l'historique de progression 📚
      tags:
        - Progress
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Historique récupéré avec succès ✨
          content:
            application/json:
              example:
                success: true
                data:
                  - subjectId: 658bc...
                    durationMinutes: 45
                    xpGained: 15
                    date: '2023-12-30T10:00:00Z'
    post:
      summary: Enregistrer une nouvelle session d'étude ✨
      tags:
        - Progress
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - subjectId
                - durationMinutes
              properties:
                subjectId:
                  type: string
                  example: 658bc...
                durationMinutes:
                  type: number
                  example: 45
                notes:
                  type: string
                  example: Révision des équations. ✏️
      responses:
        '201':
          description: Session enregistrée et XP accordée 🎉
          content:
            application/json:
              example:
                success: true
                message: Bravo ! Tu as gagné 15 XP. ✨
                data:
                  xpGained: 15
                  newTotalXP: 165
  /progress/summary:
    get:
      summary: Récupérer un résumé de la progression (XP totale, niveau) 🏆
      tags:
        - Progress
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Résumé récupéré avec succès 🍭
          content:
            application/json:
              example:
                success: true
                data:
                  totalXP: 165
                  level: 2
                  xpToNextLevel: 35
                  rank: Apprentie studieuse 🎀
  /reminders:
    get:
      summary: Récupérer tous les rappels 🔔
      tags:
        - Reminders
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des rappels récupérée 🍭
          content:
            application/json:
              example:
                success: true
                data:
                  - id: 658af...
                    title: Révision Géo 🌍
                    time: '2023-12-30T18:00:00Z'
                    isCompleted: false
    post:
      summary: Créer un nouveau rappel ✨
      tags:
        - Reminders
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - time
              properties:
                title:
                  type: string
                  example: Faire les devoirs de Maths 📐
                time:
                  type: string
                  format: date-time
                  example: '2023-12-30T17:00:00Z'
      responses:
        '201':
          description: Rappel créé avec succès 🍬
          content:
            application/json:
              example:
                success: true
                message: Rappel ajouté ! Je te préviendrai. 🔔
  /reminders/{id}:
    put:
      summary: Modifier ou marquer un rappel comme complété ✅
      tags:
        - Reminders
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          example: 658af...
      responses:
        '200':
          description: Rappel mis à jour 🍭
          content:
            application/json:
              example:
                success: true
                message: Rappel mis à jour ! ✨
  /stats:
    get:
      summary: Récupérer les statistiques globales de l'utilisateur 📊
      tags:
        - Stats
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Statistiques récupérées avec succès 📈
          content:
            application/json:
              example:
                success: true
                data:
                  totalStudyTime: 1250
                  averageSessionDuration: 45
                  mostStudiedSubject: Mathématiques 📐
                  streakDays: 5
  /stats/subjects:
    get:
      summary: Récupérer la répartition du temps par matière 🍕
      tags:
        - Stats
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Répartition récupérée ✨
          content:
            application/json:
              example:
                success: true
                data:
                  - subject: Maths
                    minutes: 450
                    color: '#FFB6C1'
                  - subject: Français
                    minutes: 300
                    color: '#B19CD9'
  /subjects:
    get:
      summary: Liste toutes les matières de l'utilisateur 📚
      tags:
        - Subjects
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des matières récupérée 🍭
          content:
            application/json:
              example:
                success: true
                data:
                  - id: 658bc...
                    name: Mathématiques 📐
                    color: '#FFB6C1'
                    totalStudyTime: 450
    post:
      summary: Ajouter une nouvelle matière 🎨
      tags:
        - Subjects
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
              properties:
                name:
                  type: string
                  example: Histoire 🏰
                color:
                  type: string
                  example: '#B19CD9'
      responses:
        '201':
          description: Matière créée avec succès ✨
          content:
            application/json:
              example:
                success: true
                message: Nouvelle matière ajoutée ! ✨
                data:
                  id: 658bd...
                  name: Histoire 🏰
  /subjects/{id}:
    put:
      summary: Modifier une matière 📝
      tags:
        - Subjects
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: id
          required: true
          example: 658bc...
      responses:
        '200':
          description: Matière mise à jour 🍬
          content:
            application/json:
              example:
                success: true
                message: Matière mise à jour ! ✨
  /themes:
    get:
      summary: Liste tous les thèmes disponibles avec config complète 🎀
      tags:
        - Themes
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des thèmes et leurs configurations visuelles 🎨
          content:
            application/json:
              example:
                success: true
                data:
                  - key: strawberry-milk
                    name: Lait Fraise 🍓
                    priceXP: 500
                    config:
                      primaryColor: '#FF8DA1'
                      backgroundColor: '#FFF5F6'
                      fontFamily: '''Fredoka'', sans-serif'
                  - key: lavender-dream
                    name: Rêve de Lavande 💜
                    priceXP: 1000
  /themes/unlock/{key}:
    post:
      summary: Débloquer un thème avec de l'XP ✨
      tags:
        - Themes
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: key
          required: true
          schema:
            type: string
          example: strawberry-milk
      responses:
        '200':
          description: Thème débloqué avec succès 🎉
          content:
            application/json:
              example:
                success: true
                message: Thème Lait Fraise 🍓 débloqué ! Profites-en bien. ✨
        '400':
          description: XP insuffisante ou thème déjà débloqué ❌
          content:
            application/json:
              example:
                success: false
                message: Tu n'as pas assez d'XP pour ce thème. Continue d'étudier ! 💪
  /themes/set/{key}:
    put:
      summary: Changer le thème actuel et récupérer sa config 🌸
      tags:
        - Themes
      security:
        - bearerAuth: []
      parameters:
        - in: path
          name: key
          required: true
          schema:
            type: string
          example: lavender-dream
      responses:
        '200':
          description: Thème mis à jour avec les variables visuelles 🍭
          content:
            application/json:
              example:
                success: true
                message: Thème mis à jour ! 🌸
                data:
                  currentTheme: lavender-dream
                  themeConfig:
                    primaryColor: '#B19CD9'
                    secondaryColor: '#E6E6FA'
                    fontFamily: '''Nunito'', sans-serif'
  /users/profile:
    get:
      summary: Récupérer le profil de l'utilisateur connecté ✨
      tags:
        - Users
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profil récupéré avec succès 🌸
          content:
            application/json:
              example:
                success: true
                data:
                  name: Sakura
                  email: sakura@love.com
                  gender: F
                  avatar: "https://..."
                  gamification:
                    totalXP: 150
                    level: 2
                  preferences:
                    currentTheme: strawberry-milk
                  themeConfig:
                    primaryColor: '#FFB6C1'
                    secondaryColor: '#FFD1DC'
    put:
      summary: Mettre à jour le profil utilisateur 📝
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: "Sakura ✨" }
                gender: { type: string, enum: ["M", "F", "O"], example: "F" }
                avatar: { type: string, example: "https://..." }
      responses:
        '200':
          description: Profil mis à jour ! 🍭
          content:
            application/json:
              example:
                success: true
                message: "Profil mis à jour ! ✨"
  /users/change-password:
    put:
      summary: Changer le mot de passe utilisateur 🔑
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [oldPassword, newPassword]
              properties:
                oldPassword: { type: string }
                newPassword: { type: string }
      responses:
        '200':
          description: Mot de passe changé ! 🍬
          content:
            application/json:
              example:
                success: true
                message: "Mot de passe modifié ! 🍭"
                    fontFamily: '''Quicksand'', sans-serif'
    put:
      summary: Mettre à jour les informations du profil 📝
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: Sakura Pink
                gender:
                  type: string
                  enum:
                    - M
                    - F
                    - O
                  example: F
                avatar:
                  type: string
                  example: https://api.dicebear.com/7.x/adventurer/svg?seed=Sakura
                preferences:
                  type: object
                  properties:
                    matieres:
                      type: array
                      items:
                        type: string
                      example:
                        - Maths
                        - Design
      responses:
        '200':
          description: Profil mis à jour ✨
          content:
            application/json:
              example:
                success: true
                message: Profil mis à jour avec succès ! ✨
                data:
                  name: Sakura Pink
                  gender: F
  /users/change-password:
    put:
      summary: Changer le mot de passe de l'utilisateur 🍭
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - oldPassword
                - newPassword
              properties:
                oldPassword:
                  type: string
                  example: ancienMDP123
                newPassword:
                  type: string
                  example: nouveauMDP456
      responses:
        '200':
          description: Mot de passe modifié avec succès 🍬
          content:
            application/json:
              example:
                success: true
                message: Mot de passe modifié avec succès ! 🍭
        '400':
          description: Ancien mot de passe incorrect ❌
          content:
            application/json:
              example:
                success: false
                message: L'ancien mot de passe est incorrect. 🍯
tags:
  - name: Auth
    description: Gestion de l'authentification 🔐
  - name: Chat
    description: Assistant d'étude IA (Mistral AI) 💬
  - name: LoFi
    description: Lecteur Lo-Fi pour étudier 🎵
  - name: Planning
    description: Gestion de l'emploi du temps intelligent 📅
  - name: Progress
    description: Suivi des sessions d'étude et XP 📈
  - name: Reminders
    description: Rappels et notifications d'étude 🔔
  - name: Stats
    description: Statistiques d'apprentissage 📊
  - name: Subjects
    description: Gestion des matières personnalisées 🎨
  - name: Themes
    description: Boutique de thèmes pastel 🍭
  - name: Users
    description: Gestion du profil utilisateur 👤
