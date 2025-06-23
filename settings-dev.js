module.exports = {
  // ID du serveur de développement
  guildId: "YOUR_DEV_GUILD_ID",

  // Canal de test pour vérifier que le bot fonctionne
  channelId: "YOUR_DEV_CHANNEL_ID",

  ids: {
    // Salon de bienvenue sur le serveur de dev
    welcomeChannel: "YOUR_DEV_WELCOME_CHANNEL_ID",

    // Rôles attribués en dev [Visiteur, Possible loutre]
    welcomeRoles: ["DEV_ROLE_ID_VISITEUR", "DEV_ROLE_ID_POSSIBLE_LOUTRE"],

    // Salon des notifications RSS en dev
    rssChannel: "YOUR_DEV_RSS_CHANNEL_ID",

    // Salon où publier le best-of en dev
    bestOfChannel: "YOUR_DEV_BEST_OF_CHANNEL_ID",

    // Salon pour annoncer la publication du best-of en dev
    notificationChannel: "YOUR_DEV_NOTIFICATION_CHANNEL_ID",

    // Salon pour les messages d'au revoir en dev
    goodbyeChannel: "YOUR_DEV_GOODBYE_CHANNEL_ID",

    // Guildes suivies pour la mise à jour des rôles
    guildIdsRoleChange: ["DEV_GUILD_ID_ONE", "DEV_GUILD_ID_TWO"],

    // Salons ignorés par la vérification automatique
    exceptionChannels: ["DEV_IGNORED_CHANNEL_ID_ONE", "DEV_IGNORED_CHANNEL_ID_TWO"],

    // Utilisateurs ignorés par la vérification automatique
    exceptionUsers: ["DEV_IGNORED_USER_ID_ONE", "DEV_IGNORED_USER_ID_TWO", "DEV_IGNORED_USER_ID_THREE"],

    // Utilisateurs autorisés à gérer les profils
    allowedUsers: ["DEV_ALLOWED_USER_ID_ONE", "DEV_ALLOWED_USER_ID_TWO", "DEV_ALLOWED_USER_ID_THREE"],

    // Identifiant du bot de développement
    botDevId: "YOUR_DEV_BOT_ID",

    // Identifiant du bot principal
    botMainId: "YOUR_MAIN_BOT_ID",

    // Personnes référentes pour la commande /aide
    supportUsers: ["DEV_SUPPORT_USER_ID_ONE", "DEV_SUPPORT_USER_ID_TWO"]
  }
};
