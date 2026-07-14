

# 🤖 Goldorak Database — Base de données complète de l'univers Goldorak

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.0-61dafb.svg)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

Une application web full‑stack moderne pour gérer et explorer l'univers de Goldorak (UFO Robot Grendizer).  
Cette base de données interactive permet de cataloguer et consulter tous les personnages, robots, vaisseaux, armes, épisodes et monstres de la série légendaire.

![Goldorak Banner](./frontend/src/assets/GrendizerLogo.png)

---

## 📑 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🎯 Sections principales](#-sections-principales)
- [🏗️ Architecture du projet](#️-architecture-du-projet)
- [🔧 Technologies utilisées](#-technologies-utilisées)
- [🔑 Prérequis](#-prérequis)
- [📦 Installation & Démarrage](#-installation--démarrage)
- [🐳 Architecture Docker](#-architecture-docker)
- [🔐 Authentification OAuth2 & mode invité](#-authentification-oauth2--mode-invité)
- [📚 Structure de la base de données](#-structure-de-la-base-de-données)
- [🎨 Interface utilisateur](#-interface-utilisateur)
- [🔌 API REST](#-api-rest)
- [⚙️ Configuration](#️-configuration)
- [📝 Scripts disponibles](#-scripts-disponibles)
- [🥚 Easter Egg](#-easter-egg)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🎭 Gestion complète des données
- ✅ **CRUD complet** pour toutes les entités (Créer, Lire, Modifier, Supprimer)
- ✅ **Recherche et filtrage** avancés avec debounce (déclenchée après 2 caractères)
- ✅ **Validation des données** côté client et serveur
- ✅ **Relations entre entités** (personnages ↔ robots, robots ↔ armes, etc.)
- ✅ **Gestion des doublons** automatique
- ✅ **Export CSV** pour toutes les entités (bouton thématique `⬇️ Export CSV`)
- ✅ **Pagination** configurable (10, 20, 50 ou 100 éléments par page, défaut: 100)
- ✅ **Listes déroulantes** dynamiques pour les relations (pilotes, robots, épisodes)

### 🔐 Authentification OAuth2 & mode invité
- 🔑 **Google OAuth** — Connexion avec compte Google
- 🔑 **GitHub OAuth** — Connexion avec compte GitHub
- 🔑 **Mode invité** — Accès en lecture seule (sans compte, ni mot de passe)
- 🔑 **JWT Tokens** — Gestion sécurisée des sessions
- 🔑 **Routes protégées** — Accès sécurisé à l'application

### 🎨 Interface moderne
- 🌌 **Design spatial thématique** inspiré de l'univers Goldorak
- 📱 **Responsive Design** — Compatible mobile, tablette et desktop
- 🎯 **Navigation par onglets** intuitive
- 💫 **Animations fluides** et transitions CSS
- 🌈 **Palette de couleurs** cyan, rouge, orange (couleurs iconiques de Goldorak)
- 🎵 **Lecteur musical intégré** — 4 titres emblématiques de la série
- 💬 **Tooltips améliorés** — Affichage des descriptions complètes au clic (toutes les descriptions, même courtes)
- 🔽 **Sélecteurs de référence** — Affichage `ID X = Nom` pour faciliter la sélection

### 📊 Tableau de bord
- 📈 **Statistiques en temps réel** du nombre d'entrées par catégorie
- 🔄 **Actualisation automatique** des données
- 🟢 **Statut de l'API** en temps réel
- 👤 **Informations utilisateur** avec photo de profil (Google/GitHub)

### 🐳 Conteneurisation Docker
- 🏗️ **3 services orchestrés** (MySQL, Backend, Frontend) via Docker Compose
- 🔄 **Hot‑reload** en développement (volumes montés)
- 🏥 **Health check** automatique — le backend attend MySQL avant de démarrer
- 🚀 **Build multi‑stage** Nginx pour la production frontend

---

## 🎯 Sections principales

### 👥 Personnages
Gérez tous les personnages de la série.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🎭 Rôle (Héros, Allié, Antagoniste, Scientifique, Pilote, Mécanicien, Commandant, Autre) — *liste déroulante*
- 🌍 Faction (Terre, Véga, Neutre) — *liste déroulante*
- 🌍 Planète d'origine (Euphor, Terre, Véga, Fleed, Rigel, Floga, Inconnue) — *liste déroulante*
- 🎂 Âge
- 📄 Description détaillée

**Fonctionnalités :**
- Affichage des badges de faction avec couleurs distinctives
- Recherche par nom, rôle, faction, planète d'origine (avec debounce)
- Vue détaillée avec toutes les informations
- Modification et suppression sécurisées

---

### 🤖 Robots & Méchas
Cataloguez tous les robots de combat.

**Champs disponibles :**
- 📝 Nom français / japonais
- 👤 Pilote (relation avec Personnages) — *liste déroulante* `ID X = Nom`
- 🏷️ Type de robot (Combat, Transformable, Transport, Reconnaissance, Sauvetage) — *liste déroulante*
- 📏 Hauteur (en mètres)
- ⚖️ Poids (en tonnes)
- 📄 Description complète

**Fonctionnalités :**
- Sélection du pilote avec format "ID X = Nom"
- Types prédéfinis avec dropdown
- Badges colorés par type
- Affichage des spécifications techniques
- Nombre d'armes associées

---

### 🚀 Vaisseaux
Répertoriez tous les vaisseaux spatiaux et terrestres.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🚀 Type (Vaisseau‑mère, Croiseur de combat, Vaisseau de combat, Char d'assaut, Submersible, Vaisseau de reconnaissance, Vaisseau de recherche, Vaisseau expérimental) — *liste déroulante*
- 👤 Pilote (optionnel) — *liste déroulante* `ID X = Nom`
- 🌍 Faction (Terre, Véga, Neutre) — *liste déroulante*
- 📄 Description

**Fonctionnalités :**
- Classification par type avec badges
- Affichage de la faction avec couleurs
- Option "Aucun" pour les vaisseaux automatiques
- Liens avec les personnages pilotes

---

### ⚔️ Armes de Goldorak
Documentez toutes les armes et attaques spéciales.

**Champs disponibles :**
- 📝 Nom français / japonais
- 🤖 Robot associé (relation) — *liste déroulante* `ID X = Nom`
- ⚡ Puissance (texte descriptif)
- 📊 Fréquence d'utilisation (Très Fréquente → Très Rare) — *liste déroulante*
- 📄 Description de l'attaque

**Fonctionnalités :**
- Sélection du robot propriétaire
- Fréquence avec badges colorés :
  - 🔴 Très Fréquente
  - 🟠 Fréquente
  - 🟡 Occasionnelle
  - 🟢 Rare
- Descriptions détaillées avec tooltip

---

### 📺 Épisodes
Suivez tous les épisodes de la série.

**Champs disponibles :**
- 📝 Titre français / japonais
- 🔢 Numéro épisode JP / FR
- 🗓️ Date de diffusion JP / FR
- 📋 Résumé
- ✅ Statut de diffusion FR

**Fonctionnalités :**
- Calcul automatique de la saison
- Badges de statut de diffusion
- Timeline des diffusions
- Recherche par titre, numéro ou résumé

---

### 🐉 Monstres & Ennemis
Recensez tous les adversaires et monstres.

**Champs disponibles :**
- 📝 Nom français / japonais
- 📺 Épisode d'apparition (relation) — *liste déroulante* `ID X = Nom`
- 🏷️ Type (Monstre, Robot, Vaisseau) — *liste déroulante*
- 📏 Taille (en mètres)
- ⚡ Puissance
- 📄 Description

**Fonctionnalités :**
- Lien avec l'épisode d'apparition
- Classification par type
- Spécifications physiques
- Recherche par épisode

---

## 🏗️ Architecture du projet

```text
Goldorak-DB-react-NodeJS-tailwind/
│
├── 📁 backend/                          # 🔌 Serveur Node.js + Express
│   ├── 📁 config/                       # Configuration générale
│   │   └── 🔐 passport.js              # Configuration OAuth2 (Google, GitHub)
│   ├── 📁 database/                     # Schémas et données SQL
│   │   └── 📊 users.sql                # Schéma table utilisateurs OAuth
│   ├── 📁 middlewares/                  # Middlewares Express
│   │   ├── 🛡️ authMiddleware.js        # Protection des routes (JWT verification)
│   │   ├── 🗄️ dbMiddleware.js          # Injection de la connexion DB dans req
│   │   └── ✔️ validation.js             # Validation des données entrantes
│   ├── 📁 routes/                       # Routes API REST (pagination + recherche)
│   │   ├── 🔐 auth.js                   # Routes authentification OAuth2 + mode invité
│   │   ├── 👥 personnages.js            # CRUD Personnages (avec planete_origine)
│   │   ├── 🤖 robots.js                 # CRUD Robots & Méchas
│   │   ├── 🚀 vaisseaux.js              # CRUD Vaisseaux spatiaux
│   │   ├── ⚔️ armes.js                  # CRUD Armes & attaques spéciales
│   │   ├── 📺 episodes.js               # CRUD Épisodes
│   │   └── 🐉 monstres.js               # CRUD Monstres & ennemis
│   ├── 🐳 Dockerfile                    # Image Node.js production
│   ├── 🐳 Dockerfile.dev                # Image Node.js développement
│   ├── 🔒 .env.example                  # Template variables d'environnement
│   ├── 🚀 index.js                      # Point d'entrée serveur Express
│   ├── 📦 package.json                  # Dépendances & scripts npm
│   └── 📦 package-lock.json             # Verrouillage versions dépendances
│
├── 📁 frontend/                         # ⚛️ Application React + Vite
│   ├── 📁 src/                          # Code source React
│   │   ├── 📁 assets/                   # Images, logos, ressources
│   │   │   └── 🎨 GrendizerLogo.png     # Logo Goldorak
│   │   ├── 📁 components/               # Composants React réutilisables
│   │   │   ├── 🔐 Login.jsx             # Page connexion OAuth2 + mode invité
│   │   │   ├── 🔄 AuthCallback.jsx      # Gestion callback OAuth
│   │   │   ├── 🛡️ ProtectedRoute.jsx    # Wrapper routes protégées
│   │   │   ├── 📋 Header.jsx            # En‑tête avec infos utilisateur
│   │   │   ├── 🔔 LoadingSpinner.jsx    # Spinner de chargement
│   │   │   ├── 📝 Modal.jsx             # Modal CRUD universel (avec références)
│   │   │   ├── 💬 DescriptionCell.jsx   # Tooltip descriptions (toutes les descriptions)
│   │   │   ├── 🎵 MusicPlayer.jsx       # Lecteur musical Goldorak
│   │   │   ├── 👥 Personnages.jsx       # Gestion des personnages
│   │   │   ├── 🤖 Robots.jsx            # Gestion des robots
│   │   │   ├── 🚀 Vaisseaux.jsx         # Gestion des vaisseaux
│   │   │   ├── ⚔️ Armes.jsx             # Gestion des armes
│   │   │   ├── 📺 Episodes.jsx          # Gestion des épisodes
│   │   │   └── 🐉 Monstres.jsx          # Gestion des monstres
│   │   ├── 📁 context/                  # Contextes React globaux
│   │   │   └── 🔐 AuthContext.jsx       # Contexte authentification utilisateur
│   │   ├── 📁 hooks/                    # Hooks React personnalisés
│   │   │   ├── 🎣 useFetchData.js       # Hook CRUD générique (pagination + recherche)
│   │   │   ├── 📋 useFormFields.js      # Configuration dynamique formulaires
│   │   │   ├── 🔗 useReferenceData.js   # Chargement données référence (dropdown)
│   │   │   └── 🥚 useKonamiCode.js      # Détection du code Konami (Easter Egg)
│   │   ├── 📁 styles/                   # Fichiers CSS spécifiques
│   │   │   ├── 💄 Header.css            # Styles en‑tête
│   │   │   ├── 🔐 Login.css             # Styles page connexion
│   │   │   ├── 🎨 Components.css        # Styles composants réutilisables (pagination, recherche, export)
│   │   │   ├── 📝 Modal.css             # Styles modals
│   │   │   └── 🎵 MusicPlayer.css       # Styles lecteur musical
│   │   ├── 🔌 api.js                    # Client API REST (fetch wrapper)
│   │   ├── 📱 App.jsx                   # Composant principal app (sans auth)
│   │   ├── 🔐 AppWithAuth.jsx           # Wrapper avec authentification + Easter Egg
│   │   ├── 💄 App.css                   # Styles globaux app
│   │   ├── 💄 index.css                 # Styles globaux page
│   │   └── 🚀 main.jsx                  # Point d'entrée React
│   ├── 📁 public/                       # Fichiers statiques publics
│   │   ├── 🎯 favicon.ico               # Icône du site
│   │   └── 📁 musiques/                 # Fichiers audio (lecteur musical)
│   ├── 🐳 Dockerfile                    # Image Nginx production (build multi‑stage)
│   ├── 🐳 Dockerfile.dev                # Image Vite développement
│   ├── 📄 index.html                    # Page HTML entry point
│   ├── 🔒 .env.example                  # Template variables d'environnement frontend
│   ├── 📦 package.json                  # Dépendances & scripts npm
│   ├── 📦 package-lock.json             # Verrouillage versions dépendances
│   ├── ⚡ vite.config.js                # Configuration Vite build tool
│   └── 📋 eslint.config.js              # Configuration linter ESLint
│
├── 📁 mysql/                            # 🗄️ Base de données
│   └── 📊 init.sql                      # Schéma complet + données de démo
│
├── 🐳 docker-compose.yml                # Orchestration 3 services
├── 🔒 .env.example                      # Template variables d'environnement Docker
├── 📋 .gitignore                        # Fichiers ignorés par Git
├── 📄 README.md                         # Documentation principale
└── 🔐 OAUTH2_SETUP.md                   # Guide configuration OAuth2 détaillé
```

---

## 🔧 Technologies utilisées

### Backend
| Package               | Version   | Rôle                                      |
|-----------------------|-----------|-------------------------------------------|
| Node.js               | ≥ 20.0.0  | Runtime JavaScript                        |
| Express               | ^5.2.1    | Framework web                             |
| MySQL2                | ^3.16.3   | Driver MySQL avec Promises                |
| Passport.js           | ^0.7.0    | OAuth2 (Google + GitHub)                  |
| express‑validator     | ^7.3.1    | Validation des données                    |
| express‑session       | —         | Gestion des sessions                      |
| jsonwebtoken          | ^9.0.3    | JWT                                       |
| cors                  | ^2.8.6    | Cross‑Origin Resource Sharing             |
| dotenv                | ^17.2.3   | Variables d'environnement                 |
| winston               | ^3.11.0   | Logging avancé                            |

### Frontend
| Package               | Version   | Rôle                                      |
|-----------------------|-----------|-------------------------------------------|
| React                 | ^19.2.0   | Bibliothèque UI                           |
| React Router DOM      | ^7.13.0   | Routage côté client                       |
| Vite                  | 7.2.5     | Build tool ultra‑rapide                   |

### Infrastructure
| Outil                 | Version   | Rôle                                      |
|-----------------------|-----------|-------------------------------------------|
| MySQL                 | 8.0       | SGBD relationnel                          |
| Docker                | ≥ 24.x    | Conteneurisation                          |
| Docker Compose        | ≥ 2.x     | Orchestration multi‑services              |
| Nginx                 | stable‑alpine | Serveur web production                 |

---

## 🔑 Prérequis

**Pour Docker (recommandé) :**
- ✅ **Docker Desktop** ≥ 24.x
- ✅ **Docker Compose** ≥ 2.x
- ✅ Clés OAuth2 Google et/ou GitHub *(optionnel — le mode invité permet un accès sans compte)*

**Pour le développement local (sans Docker) :**
- ✅ **Node.js** ≥ 20.0.0 ([Télécharger](https://nodejs.org/))
- ✅ **MySQL** ≥ 8.0 ([Télécharger](https://dev.mysql.com/downloads/))
- ✅ **Git** ([Télécharger](https://git-scm.com/))

---

## 📦 Installation & Démarrage

### 🐳 Avec Docker (recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Septieme7/Goldorak-DB-react-NodeJS-tailwind.git
cd Goldorak-DB-react-NodeJS-tailwind

# 2. Copier et configurer les variables d'environnement
cp .env.example .env
# ⚠️ Éditer .env avec tes propres secrets (voir section Variables d'environnement)

# 3. Construire et démarrer tous les services
docker compose up --build -d

# 4. Vérifier que tout est en ligne
docker compose ps
```

🟢 **Accès aux services :**
- Frontend (dev) : http://localhost:5173
- Backend API   : http://localhost:8800/api/v1
- MySQL         : localhost:3306

---

### 🛠️ En développement local (sans Docker)

#### Étape 1 — Backend

```bash
cd backend
npm install

# Copier et remplir le fichier .env local
cp .env.example .env

# Démarrage en développement
npm run dev
```

#### Étape 2 — Base de données

Créer manuellement la base via `mysql/init.sql` :

```bash
mysql -u root -p < mysql/init.sql
```

Ou via le client MySQL :

```sql
CREATE DATABASE goldorak_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE goldorak_db;
-- Puis exécuter le contenu de mysql/init.sql
```

**Créer les tables (extrait) :**

```sql
-- Table Personnages (avec planete_origine)
CREATE TABLE personnages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_fr VARCHAR(100) NOT NULL,
    nom_jp VARCHAR(100),
    faction VARCHAR(50),
    role VARCHAR(100),
    age INT,
    planete_origine VARCHAR(100),
    description TEXT
);

-- Table Épisodes (sans description)
CREATE TABLE episodes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre_fr VARCHAR(200) NOT NULL,
    titre_jp VARCHAR(200),
    numero_fr INT,
    numero_jp INT NOT NULL,
    diffuse_jp DATE,
    diffuse_fr DATE,
    resume TEXT
);

-- Les autres tables (robots, armes, vaisseaux, monstres, users) restent inchangées
-- Consulter mysql/init.sql pour le schéma complet
```

#### Étape 3 — Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:8800/api/v1
npm run dev
```

L'application démarre sur **http://localhost:5173**.

#### Mode production (sans Docker)

```bash
# Backend
cd backend && npm start

# Frontend — build puis prévisualisation
cd frontend
npm run build
npm run preview
```

---

## 🐳 Architecture Docker

### Services Docker Compose

Le fichier `docker-compose.yml` orchestre **3 services** :

#### 🗄️ Service `db` — MySQL 8.0

```yaml
image: mysql:8.0
container_name: goldorak-db
ports: "3307:3306"  # Port externe 3307 pour éviter les conflits
```

- Persistance des données via le volume nommé `mysql_data`
- Initialisation automatique du schéma via `mysql/init.sql`
- **Health check** intégré — les services dépendants attendent MySQL avant de démarrer

#### ⚙️ Service `backend` — Node.js / Express

```yaml
build: ./backend
container_name: goldorak-backend
ports: "8800:8800"
depends_on:
  db:
    condition: service_healthy   # ← attend le health check MySQL
```

- Variables d'environnement injectées depuis `.env`
- Volume monté sur `./backend:/app` pour le hot‑reload en développement

#### 🖥️ Service `frontend` — Vite (dev) ou Nginx (prod)

```yaml
build:
  context: ./frontend
  dockerfile: Dockerfile.dev     # ← Vite dev server (port 5173)
container_name: goldorak-frontend
ports: "5173:5173"
```

💡 **Passage en production :** remplacer `Dockerfile.dev` par `Dockerfile` (build Vite → Nginx, port `5173` → `80`).

---

### Fichiers Docker

#### `backend/Dockerfile` — Production Node.js

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci          # Install propre (respecte package-lock.json)
COPY . .
EXPOSE 8800
CMD ["node", "index.js"]
```

#### `frontend/Dockerfile.dev` — Dev Vite

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

#### `frontend/Dockerfile` — Production Nginx (build multi‑stage)

```dockerfile
# ── Étape 1 : Build React ────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # Génère /app/dist

# ── Étape 2 : Servir avec Nginx ─────────────────────────
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Variables d'environnement

Copier `.env.example` → `.env` et remplir les valeurs :

```dotenv
# ── MySQL ──────────────────────────────────────────────────
MYSQL_ROOT_PASSWORD=rootpassword      # Mot de passe root MySQL
MYSQL_DATABASE=goldorak_db            # Nom de la base
MYSQL_USER=app_user                   # Utilisateur applicatif
MYSQL_PASSWORD=app_password           # Son mot de passe

# ── Backend ────────────────────────────────────────────────
PORT=8800                             # Port du serveur Express
NODE_ENV=production                   # production | development
FRONTEND_URL=http://localhost         # URL du frontend (CORS)
CORS_ORIGIN=http://localhost          # Origine autorisée
LOG_LEVEL=info                        # Niveau de logs (winston)

# ── Sécurité ───────────────────────────────────────────────
SESSION_SECRET=un_secret_long_et_aleatoire_pour_les_sessions
JWT_SECRET=un_autre_secret_pour_jwt
JWT_EXPIRES_IN=7d

# ── OAuth2 Google (optionnel) ──────────────────────────────
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_secret
GOOGLE_CALLBACK_URL=http://localhost:8800/api/v1/auth/google/callback

# ── OAuth2 GitHub (optionnel) ──────────────────────────────
GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_secret
GITHUB_CALLBACK_URL=http://localhost:8800/api/v1/auth/github/callback
```

**Frontend** (dans `frontend/.env`) :

```dotenv
VITE_API_URL=http://localhost:8800/api/v1
```

---

### Commandes Docker utiles

```bash
# ── Cycle de vie ───────────────────────────────────────────

# Démarrer tous les services (en arrière‑plan)
docker compose up -d

# Reconstruire après modification du code ou du Dockerfile
docker compose up --build -d

# Voir l'état des conteneurs
docker compose ps

# ── Logs ───────────────────────────────────────────────────

# Logs de tous les services en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# ── Base de données ────────────────────────────────────────

# Accéder à MySQL dans le conteneur
docker exec -it goldorak-db mysql -u app_user -p goldorak_db

# Réinitialiser la base de données (perte de données !)
docker compose down -v && docker compose up --build -d

# ── Tests API rapides (curl) ───────────────────────────────

# Santé de l'API
curl http://localhost:8800/api/v1/health

# Lister les personnages (avec pagination)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8800/api/v1/personnages?page=1&limit=20"

# Recherche dans les personnages
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8800/api/v1/personnages?search=Actarus"

# Statistiques globales
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8800/api/v1/stats
```

### Arrêt & Nettoyage

```bash
# Arrêter les services (données conservées)
docker compose down

# Arrêter ET supprimer les volumes (⚠️ efface toute la DB)
docker compose down -v

# Supprimer les images Docker générées localement
docker compose down --rmi local

# Nettoyage complet (images, volumes, networks orphelins)
docker system prune -af --volumes
```

---

## 🔐 Authentification OAuth2 & mode invité

Consultez le fichier `OAUTH2_SETUP.md` pour la configuration complète de Google et GitHub OAuth.

### Mode invité

L'application propose un **mode invité** permettant un accès rapide en lecture seule :
- Aucun compte ni mot de passe requis
- Un utilisateur invité est créé automatiquement en base de données
- Les actions de création, modification et suppression sont désactivées
- Idéal pour une démonstration ou une prise en main rapide

### Flux OAuth2

```text
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Clic "Se connecter avec Google/GitHub"
       ▼
┌─────────────────────┐
│   Frontend React    │
│  /login page        │
└──────┬──────────────┘
       │
       │ 2. Redirection vers /api/v1/auth/google (ou /github)
       ▼
┌─────────────────────┐
│   Backend Express   │
│  (Passport.js)      │
└──────┬──────────────┘
       │
       │ 3. Redirection vers Google/GitHub OAuth
       ▼
┌─────────────────────┐
│  Google / GitHub    │
│  OAuth Server       │
└──────┬──────────────┘
       │
       │ 4. Utilisateur s'authentifie
       │ 5. Callback vers backend /auth/callback
       ▼
┌─────────────────────┐
│   Backend Express   │
│  /auth/callback     │
└──────┬──────────────┘
       │
       │ 6. Génération JWT Token
       │ 7. Redirection vers /auth/callback?token=...
       ▼
┌─────────────────────┐
│   Frontend React    │
│  /auth/callback     │
└──────┬──────────────┘
       │
       │ 8. Vérification token
       │ 9. Stockage localStorage
       │ 10. Redirection vers /
       ▼
┌─────────────────────┐
│   Application       │
│   Authentifiée ✅  │
└─────────────────────┘
```

### Endpoints d'authentification (non protégés)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`   | `/auth/google` | Initier l'auth Google |
| `GET`   | `/auth/google/callback` | Callback Google |
| `GET`   | `/auth/github` | Initier l'auth GitHub |
| `GET`   | `/auth/github/callback` | Callback GitHub |
| `POST`  | `/auth/guest` | Créer un compte invité |
| `GET`   | `/auth/verify` | Vérifier un token JWT |
| `POST`  | `/auth/logout` | Déconnexion |
| `GET`   | `/auth/me` | Profil utilisateur courant |

### Sécurité

- ✅ **Tokens JWT** avec expiration (7 jours par défaut)
- ✅ **Routes protégées** avec middleware d'authentification
- ✅ **CORS configuré** pour empêcher les requêtes non autorisées
- ✅ **Validation des données** côté client et serveur
- ✅ **Sessions sécurisées** avec express‑session
- ✅ **Cookies sécurisés** en mode production (`secure: true`)

---

## 📚 Structure de la base de données

### Modélisation de la Base de Données (Méthode Merise)

La structure de données a été normalisée en troisième forme normale (3FN) pour éliminer toute redondance et garantir la cohérence absolue des données.

```mermaid
erDiagram
    PERSONNAGE ||--o{ ROBOT : pilote
    PERSONNAGE ||--o{ VAISSEAU : pilote
    PERSONNAGE ||--o{ MONSTRE : combat
    ROBOT ||--|{ ARME : possede
    EPISODE ||--o{ MONSTRE : apparait_dans
    EPISODE ||--o{ PERSONNAGE : apparait

    PERSONNAGE {
        int id PK
        string nom_fr
        string nom_jp
        string faction
        string role
        int age
        string planete_origine
        text description
    }

    ROBOT {
        int id PK
        string nom_fr
        string nom_jp
        int pilote_id FK
        string type_robot
        decimal hauteur
        decimal poids
        text description
    }

    VAISSEAU {
        int id PK
        string nom_fr
        string nom_jp
        string type_vaisseau
        int pilote_id FK
        string faction
        text description
    }

    ARME {
        int id PK
        string nom_fr
        string nom_jp
        int robot_id FK
        string puissance
        string frequence_utilisation
        text description
    }

    EPISODE {
        int id PK
        string titre_fr
        string titre_jp
        int numero_fr
        int numero_jp
        date diffuse_jp
        date diffuse_fr
        text resume
    }

    MONSTRE {
        int id PK
        string nom_fr
        string nom_jp
        int episode_id FK
        string type_monstre
        decimal taille
        string puissance
        text description
    }

    USERS {
        int id PK
        string oauth_provider
        string oauth_id
        string email
        string display_name
        string avatar_url
        timestamp created_at
        timestamp last_login
    }
```

### Modèle Conceptuel de Données (MCD) - Règles d'association

1. **Piloter un Robot** : Un robot est piloté par un seul personnage (`pilote_id`). Un personnage peut piloter un ou plusieurs robots au cours de la série (0,N). → `(0,N) à (1,1)`

2. **Piloter un Vaisseau** : Un vaisseau peut être piloté par un seul personnage. Un personnage peut piloter plusieurs vaisseaux de soutien (0,N). → `(0,N) à (0,1)`

3. **Posséder des Armes** : Un robot possède une ou plusieurs armes (1,N), et chaque arme est exclusive à un robot spécifique (1,1). La suppression d'un robot entraîne la suppression automatique en cascade de ses armes (`ON DELETE CASCADE`). → `(1,N) à (1,1)`

4. **Apparition dans un Épisode** : Un épisode peut voir apparaître aucun ou plusieurs monstres (0,N). Un monstre apparaît obligatoirement dans un épisode de référence de la série (1,1). → `(0,N) à (1,1)`

5. **Apparition d'un Personnage** : Un personnage peut apparaître dans plusieurs épisodes. Un épisode peut contenir plusieurs personnages (relation non directement modélisée par une clé étrangère unique, mais gérée par la logique applicative).

6. **Authentification OAuth2** : La table `users` est indépendante des entités de l'univers Goldorak. Elle stocke les identifiants OAuth (Google, GitHub) ainsi que les comptes invités (provider = 'guest').

### Contraintes d'intégrité

| Table | Contrainte | Action |
|-------|------------|--------|
| `robots` | `pilote_id → personnages(id)` | `ON DELETE SET NULL` |
| `armes` | `robot_id → robots(id)` | `ON DELETE CASCADE` |
| `vaisseaux` | `pilote_id → personnages(id)` | `ON DELETE SET NULL` |
| `monstres` | `episode_id → episodes(id)` | `ON DELETE SET NULL` |
| `users` | `(oauth_provider, oauth_id)` | `UNIQUE` |

### SQL complet

Le schéma complet avec les données de démonstration est disponible dans `mysql/init.sql`.  
Il est exécuté automatiquement au premier démarrage du conteneur MySQL.  
> 💡 Le charset `utf8mb4` est utilisé pour le support des caractères japonais (ex: 名前).

---

## 🎨 Interface utilisateur

### Palette de couleurs

```css
--goldorak-space:  #0a0a2a   /* Bleu spatial foncé  */
--goldorak-blue:   #1a4b8c   /* Bleu Goldorak        */
--goldorak-red:    #ff2e2e   /* Rouge énergétique    */
--goldorak-orange: #ff8c00   /* Orange vibrant       */
--goldorak-yellow: #ffd700   /* Jaune doré           */
--goldorak-energy: #00ffea   /* Cyan électrique      */
--goldorak-light:  #e0e0e0   /* Gris clair           */
--goldorak-silver: #b0b0b0   /* Argent métallique    */
```

### 🎵 Lecteur musical intégré

Le projet intègre un **lecteur audio léger** aux couleurs de Goldorak, permettant d'écouter 4 titres emblématiques de la série pendant l'utilisation de l'interface.

**Fonctionnalités :**

| Commande | Icône | Action |
|----------|-------|--------|
| Lecture / Pause | ▶️ / ⏸ | Joue ou met en pause la piste courante |
| Piste précédente | ⏮ | Retour au titre précédent |
| Piste suivante | ⏭ | Passe au titre suivant |
| Playlist | 📀 | Menu déroulant pour sélectionner directement un morceau |

**Fichiers audio :**  
Placez vos 4 fichiers `.mp3` dans le dossier `frontend/public/musiques/`.  
Noms attendus (ajustables dans `MusicPlayer.jsx`) :
- `goldorak-generique.mp3`
- `actarus-deploie-toi.mp3`
- `combat-spatial.mp3`
- `vega-attaque.mp3`

**Intégration technique :**
- Composant `MusicPlayer.jsx` – aucune dépendance externe (API HTML5 Audio)
- Styles `MusicPlayer.css` – thème spatial (cyan, rouge, fonds transparents)
- Position : en haut à droite de l'en‑tête principal
- Volume : réglé à 50 % par défaut

### Composants principaux

#### 🎯 Modal universel
- Formulaires dynamiques générés automatiquement
- Validation en temps réel
- 3 modes : Créer / Modifier / Voir détails
- Design spatial avec fond d'étoiles
- Animations fluides d'ouverture/fermeture
- Champs `select` avec données de référence ou listes prédéfinies
- Affichage `ID X = Nom` pour les relations (pilotes, robots, épisodes)

#### 📊 Tableaux de données
- Tri par colonnes
- Actions rapides (Voir / Modifier / Supprimer)
- Badges colorés pour les catégories
- Descriptions avec tooltip au clic (toutes les descriptions, même courtes)
- Responsive avec scroll horizontal mobile
- **Pagination** : boutons `◀`/`▶` stylisés, 10/20/50/100 éléments par page
- **Recherche** : debounce 300ms, déclenchée après 2 caractères

#### 💬 Tooltip descriptions
- Activation au clic sur n'importe quelle description (courte ou longue)
- Affichage centré au premier plan (`z-index: 99999`)
- Fermeture automatique au scroll ou au redimensionnement
- Fermeture par clic sur overlay ou croix
- Texte agrandi pour meilleure lisibilité
- Un seul tooltip ouvert à la fois

#### 🎛️ Dashboard
- Cartes statistiques animées
- Statut API en temps réel
- Actualisation manuelle ou automatique
- Design responsive grid

#### 📥 Export CSV
- Bouton `⬇️ Export CSV` pour chaque entité
- Téléchargement d'un fichier `.csv` avec toutes les données
- Style bleu/cyan thématique assorti à l'univers Goldorak

#### 🔍 Barre de recherche
- Champ de recherche avec icône de loupe
- Debounce de 300ms pour éviter les appels API intempestifs
- Recherche déclenchée après la saisie de 2 caractères minimum
- Style spatial assorti au thème

---

## 🔌 API REST

### Base URL
```
http://localhost:8800/api/v1
```

> Toutes les routes (sauf `/auth/*`, `/health`, `/test` et `/easter-egg`) sont **protégées par JWT**.  
> Ajouter le header : `Authorization: Bearer <token>`

### Authentification

#### Connexion Google
```
GET /auth/google
```
Redirige vers l'authentification Google OAuth2.

#### Connexion GitHub
```
GET /auth/github
```
Redirige vers l'authentification GitHub OAuth2.

#### Mode invité
```
POST /auth/guest
```
Crée un compte invité et retourne un token JWT.

**Réponse :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "guest_1234567890@goldorak.local",
    "displayName": "Invité",
    "provider": "guest",
    "isGuest": true
  }
}
```

#### Vérifier un token
```
GET /auth/verify
Headers: Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "John Doe",
    "provider": "google"
  }
}
```

### Routes CRUD (pattern générique)

Toutes les entités suivent le même pattern :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET`    | `/{entité}` | Liste tous les éléments (pagination + recherche) |
| `GET`    | `/{entité}/:id` | Détail d'un élément |
| `POST`   | `/{entité}` | Créer un élément |
| `PATCH`  | `/{entité}/:id` | Modifier partiellement |
| `DELETE` | `/{entité}/:id` | Supprimer |
| `GET`    | `/{entité}/export/csv` | Exporter en CSV |

### Entités disponibles

| Entité      | Route          | Description                               |
|-------------|----------------|-------------------------------------------|
| 👥 Personnages | `/personnages` | Héros et ennemis (avec planete_origine) |
| 🤖 Robots    | `/robots`      | Robots de combat                          |
| 🚀 Vaisseaux | `/vaisseaux`   | Vaisseaux spatiaux                        |
| ⚔️ Armes     | `/armes`       | Arsenal de Goldorak                       |
| 📺 Épisodes  | `/episodes`    | Épisodes de la série                      |
| 🐉 Monstres  | `/monstres`    | Mécabêtes de Véga                         |
| 📊 Stats     | `/stats`       | Comptage global                           |
| 🏥 Health    | `/health`      | Santé de l'API + DB                       |

### Paramètres de requête (GET /{entité})

| Paramètre | Type   | Défaut | Description                              |
|-----------|--------|--------|------------------------------------------|
| `page`    | number | `1`    | Numéro de page                           |
| `limit`   | number | `20`   | Éléments par page (max 100)              |
| `search`  | string | `""`   | Terme de recherche (2 caractères minimum) |

### Valeurs d'énumération

| Champ | Valeurs acceptées |
|-------|-------------------|
| `faction` | `"Terre"` \| `"Véga"` \| `"Neutre"` |
| `role` | `"Héros"` \| `"Allié"` \| `"Antagoniste"` \| `"Scientifique"` \| `"Pilote"` \| `"Mécanicien"` \| `"Commandant"` \| `"Autre"` |
| `planete_origine` | `"Euphor"` \| `"Terre"` \| `"Véga"` \| `"Fleed"` \| `"Rigel"` \| `"Floga"` \| `"Inconnue"` |
| `type_robot` | `"Robot de combat"` \| `"Robot transformable"` \| `"Robot de transport"` \| `"Robot de reconnaissance"` \| `"Robot de sauvetage"` |
| `type_vaisseau` | `"Vaisseau‑mère"` \| `"Croiseur de combat"` \| `"Vaisseau de combat"` \| `"Char d'assaut"` \| `"Submersible"` \| `"Vaisseau de reconnaissance"` \| `"Vaisseau de recherche"` \| `"Vaisseau expérimental"` |
| `type_monstre` | `"Robot"` \| `"Monstre"` \| `"Vaisseau"` |
| `frequence_utilisation` | `"Très Fréquente"` \| `"Fréquente"` \| `"Occasionnelle"` \| `"Assez Rare"` \| `"Rare"` \| `"Très Rare"` |

### Exemples de requêtes

#### Créer un personnage
```bash
curl -X POST http://localhost:8800/api/v1/personnages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom_fr": "Actarus",
    "nom_jp": "デューク・フリード",
    "faction": "Terre",
    "role": "Héros principal",
    "age": 19,
    "planete_origine": "Euphor",
    "description": "Prince de la planète Euphor"
  }'
```

#### Rechercher des personnages
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8800/api/v1/personnages?search=Actarus&page=1&limit=10"
```

#### Exporter les robots en CSV
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8800/api/v1/robots/export/csv \
  --output robots.csv
```

#### Modifier partiellement un robot
```bash
curl -X PATCH http://localhost:8800/api/v1/robots/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hauteur": 30.5, "poids": 280.5}'
```

#### Vérifier la santé de l'API (sans token)
```bash
curl http://localhost:8800/api/v1/health
```

#### Voir les statistiques
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8800/api/v1/stats
```

---

## ⚙️ Configuration

### Variables d'environnement — Backend

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du serveur Express | `8800` |
| `NODE_ENV` | Environnement | `development` |
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_NAME` | Nom de la base | `goldorak_db` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | — |
| `DB_PORT` | Port MySQL | `3306` |
| `JWT_SECRET` | Secret JWT | À définir |
| `JWT_EXPIRES_IN` | Durée de validité du token | `7d` |
| `SESSION_SECRET` | Secret de session | À définir |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:5173` |
| `CORS_ORIGIN` | Origine CORS autorisée | `http://localhost:5173` |
| `LOG_LEVEL` | Niveau de logs (winston) | `info` |

### Variables d'environnement — Frontend

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:8800/api/v1` |

---

## 📝 Scripts disponibles

### Backend

```bash
# Démarrage mode développement (avec nodemon)
npm run dev

# Démarrage mode production
npm start

# Tests (à implémenter)
npm test
```

### Frontend

```bash
# Démarrage serveur de développement
npm run dev

# Build pour production
npm run build

# Prévisualisation du build
npm run preview

# Linter analyse statique du code
npm run lint
```

---

## 🥚 Easter Egg — Code Konami

> *Pour les vrais fans de Goldorak... et de jeux vidéo rétro.*

Une surprise secrète est cachée dans l'application. Elle se déclenche sur **n'importe quelle page** de l'interface.

### 🕹️ Comment l'activer ?

Saisissez la séquence légendaire au clavier :

```
↑  ↑  ↓  ↓  ←  →  ←  →  B  A
```

> 🎮 La séquence complète doit être entrée **sans délai trop long** entre chaque touche.  
> Fonctionne depuis n'importe quel écran de l'application, sans avoir à cliquer nulle part au préalable.

### ⚙️ Fonctionnement technique

- **Écoute globale** via un `useEffect` sur `window` dans `AppWithAuth.jsx` — actif sur toutes les pages
- **Séquence surveillée** : `ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight KeyB KeyA`
- Aucune dépendance externe — 100 % natif React + API `keydown`
- Appel API `POST /api/v1/easter-egg` (non protégé) pour tracer l'activation

### 💡 Indice

> *"Le ciel s'embrase quand Goldorak déploie ses ailes..."*

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Guidelines

- 📝 Commentaires en français dans le code
- ✅ Respecter les conventions de nommage existantes
- 🧪 Tester les modifications avant de soumettre
- 📚 Mettre à jour la documentation si nécessaire

---

## 📄 Licence

Ce projet est sous licence **ISC**.

---

## 👨‍💻 Auteur

Développé avec ❤️ et beaucoup de ☕ pour les fans de Goldorak.

---

## 🙏 Remerciements

- **Go Nagai** — Créateur de l'univers Goldorak
- **Toei Animation** — Studio d'animation
- Tous les fans qui maintiennent la flamme de cette série légendaire

---

## 📞 Support

Pour toute question ou problème :
- 🐛 Ouvrir une issue sur GitHub
- 📧 Contact : lordstiko7@gmail.com

---

<div align="center">

**⚡ Goldorak, Go! ⚡**

*"Nous sommes tous des enfants des étoiles"*

![Footer](https://img.shields.io/badge/Made%20with-React%20%26%20Express-blue?style=for-the-badge)
![Footer](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge)
![Footer](https://img.shields.io/badge/Auth-OAuth2-green?style=for-the-badge)
![Footer](https://img.shields.io/badge/Deploy-Docker-2496ED?style=for-the-badge&logo=docker)

*📅 Dernière mise à jour : Juillet 2026 — Goldorak DB v7.7.7*

</div>
```

---

## 📌 Récapitulatif des mises à jour

| Section | Modifications apportées |
|---------|------------------------|
| **Fonctionnalités** | Ajout de la pagination configurable, recherche avec debounce, tooltips pour toutes les descriptions, sélecteurs de référence `ID X = Nom` |
| **Sections principales** | Précision sur les listes déroulantes `ID X = Nom` pour pilotes, robots et épisodes |
| **Architecture** | Mention des hooks `useReferenceData`, `useFormFields` et du composant `Modal` avec références |
| **Interface utilisateur** | Ajout des sections : Barre de recherche, Tooltips améliorés, Pagination stylisée, Export CSV |
| **API REST** | Précision sur les paramètres `page`, `limit`, `search` et la pagination |
| **Divers** | Corrections mineures de typo et mise en forme |

Tu peux copier/coller ce fichier dans ton projet. 🚀