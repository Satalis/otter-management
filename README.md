# Chantal - Bot Discord

Chantal est un bot Discord avancé conçu pour animer et gérer une communauté dynamique. Il offre des fonctionnalités variées allant du **Kaazino** (machine à sous) à la gestion de **citations**, en passant par un **système de succès** et des **best-of mensuels**.

---

## 📌 Fonctionnalités

### 🔹 Jeux et animations
- 🎰 **Kaazino** : Une machine à sous avec des probabilités ajustées et un jackpot progressif.
- 🎟️ **Loterie** : Un pourcentage des mises du Kaazino alimente une cagnotte, qui peut être gagnée en cas de "quasi victoire".
- 🏆 **Système de succès** [SOON] : Attribution automatique de succès pour encourager la participation.

### 🔹 Gestion et automatisation
- 📌 **Citations** : Système de sauvegarde et suppression des meilleures citations des membres.
- 📜 **Best-of mensuel** : Génération automatique d’un best-of des citations chaque mois.
- 🔄 **Mise à jour des rôles** : Synchronisation automatique des rôles Discord en fonction des données Firestore.
- 📋 **Liste des membres par rôle** : `/listrole` affiche le nom du rôle et ses membres (chacun précédé d'une puce), leur nombre et la date de création du rôle.

### 🔹 Intégrations et API
- 📰 **Flux RSS Lodestone** : Surveillance des news FFXIV et publication automatique sur Discord.

### 🔹 Utilitaires
- 🛠️ **Commandes personnalisées** : `/help`, `/quote`, `/kaazino`, etc.
- 🚀 **Keep-Alive** : Maintien du bot actif sur Koyeb malgré la mise en veille automatique.
- 🔔 **Messages d'accueil et d'au revoir** : Attribution automatique de rôles à l’arrivée et annonce du départ.

---

## 📦 Installation

###  Prérequis
- **Node.js** (v18+ recommandé)
- **Firestore** pour la base de données
- **Un bot Discord** (avec son Token)

### Cloner le repo
```sh
git clone https://github.com/ton-user/chantal-bot.git
cd chantal-bot

npm install (installer les dépendances)

### Créer un .env

Créer un .env
TEST_ENV=dev   #Vous pouvez mettre 'prod' pour utiliser le settings.js pour l'env prod
DISCORD_TOKEN=ton_token
FIREBASE_CREDENTIALS=chemin_du_fichier_json
GITHUB_BRANCH=main
GOOGLE_SHEET_ID=ton_id_google_sheet
FTP_HOST=ftp.tonsite.com
FTP_USER=ton_user
FTP_PASS=ton_mdp

### Configurer les paramètres Discord

Un fichier `settings-example.js` est fourni pour vous aider à renseigner toutes
les ID nécessaires (salons, rôles, utilisateurs, etc.). Copiez ce fichier en
`settings.js` (et `settings-dev.js` si besoin) puis remplissez chaque valeur avec
vos propres identifiants Discord.

La configuration comporte désormais une section `commands` permettant d'activer
ou de désactiver chaque commande du bot&nbsp;:

commands: {
  add: { enabled: true },
  aide: { enabled: true },
  delete: { enabled: true },
  gill: { enabled: true },
  quote: { enabled: true },
  suggestion: { enabled: true },
  update: { enabled: true },
  listrole: { enabled: true },
}

Mettez `enabled` à `false` pour bloquer une commande et utilisez `message` pour
personnaliser la réponse lorsqu'elle est désactivée.

De la même manière, une section `features` permet d'activer ou non certaines
fonctionnalités du bot :

features: {
  rssFeed: true,
  redditFashionRSS: true,
  monthlyBestOf: true,
  verifyWord: true,
  quoteSystem: true,
  welcomeMessages: true,
  goodbyeMessages: true,
  keepAlive: true,
}

Passez la valeur à `false` pour désactiver l'une de ces fonctionnalités.

Une section `intervals` permet également de personnaliser certaines fréquences de vérification :

```js
intervals: {
  redditFashionRSS: 24 * 60 * 60 * 1000, // vérifie le flux Fashion Report toutes les 24h
}
```

Si aucune valeur n'est précisée, un intervalle par défaut de 24&nbsp;heures est utilisé pour le flux Reddit.

### Le démarrer
node bot.js
