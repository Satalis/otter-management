module.exports = {
  // ID du serveur principal
  guildId: "YOUR_MAIN_GUILD_ID",

  // Canal utilisé pour tester que le bot est en ligne
  channelId: "YOUR_MAIN_CHANNEL_ID",

  ids: {
    // Salon où le bot souhaite la bienvenue
    welcomeChannel: "YOUR_WELCOME_CHANNEL_ID",

    // Rôles attribués aux nouveaux membres [Visiteur, Possible loutre]
    welcomeRoles: ["ROLE_ID_VISITEUR", "ROLE_ID_POSSIBLE_LOUTRE"],

    // Salon pour les notifications RSS Lodestone
    rssChannel: "YOUR_RSS_CHANNEL_ID",

    // Salon où publier le best-of mensuel
    bestOfChannel: "YOUR_BEST_OF_CHANNEL_ID",

    // Salon qui reçoit la notification du best-of
    notificationChannel: "YOUR_NOTIFICATION_CHANNEL_ID",

    // Salon pour les messages d'au revoir
    goodbyeChannel: "YOUR_GOODBYE_CHANNEL_ID",

    // Guildes suivies pour la mise à jour des rôles
    guildIdsRoleChange: ["GUILD_ID_ONE", "GUILD_ID_TWO"],

    // Salons ignorés par la vérification automatique
    exceptionChannels: ["IGNORED_CHANNEL_ID_ONE", "IGNORED_CHANNEL_ID_TWO"],

    // Utilisateurs ignorés par la vérification automatique
    exceptionUsers: ["IGNORED_USER_ID_ONE", "IGNORED_USER_ID_TWO", "IGNORED_USER_ID_THREE"],

    // Utilisateurs autorisés à gérer les profils
    allowedUsers: ["ALLOWED_USER_ID_ONE", "ALLOWED_USER_ID_TWO", "ALLOWED_USER_ID_THREE"],

    // Identifiant du bot en environnement de développement
    botDevId: "YOUR_DEV_BOT_ID",

    // Identifiant du bot principal
    botMainId: "YOUR_MAIN_BOT_ID",

    // Personnes référentes pour la commande /aide
    supportUsers: ["SUPPORT_USER_ID_ONE", "SUPPORT_USER_ID_TWO"]
  },

  // Activer ou désactiver individuellement les commandes
  commands: {
    add: { enabled: true },
    aide: { enabled: true },
    delete: { enabled: true },
    gill: { enabled: true },
    quote: { enabled: true },
    suggestion: { enabled: true },
    update: { enabled: true },
  },

  // Activer ou désactiver certaines fonctionnalités du bot
  features: {
    rssFeed: true,
    monthlyBestOf: true,
    verifyWord: true,
    quoteSystem: true,
    welcomeMessages: true,
    goodbyeMessages: true,
    keepAlive: true,
  }
};
