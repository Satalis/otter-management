require('dotenv').config();
console.log('DEBUG TEST_ENV =', process.env.TEST_ENV);
console.log('DEBUG 🔍 FIREBASE_CREDENTIALS =', process.env.FIREBASE_CREDENTIALS);

require('module-alias/register');
const fs = require('fs');
const https = require("https");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});

const { dateFormatLog } = require('./Helpers/logTools');
const { Client, GatewayIntentBits, Collection, InteractionType } = require('discord.js');
const Discord = require('discord.js');

// === 🔧 CONFIGURATION ENVIRONNEMENT ===
const env = process.env.TEST_ENV;
const isDev = env === 'dev';

let settings = {};
try {
  if (isDev && fs.existsSync('./settings-dev.js')) {
    console.log("✅ Environnement de développement – Chargement de settings-dev.js");
    settings = require('./settings-dev.js');
  } else if (!isDev && fs.existsSync('./settings.js')) {
    console.log("✅ Environnement de production – Chargement de settings.js");
    settings = require('./settings.js');
  } else {
    console.warn("⚠️ Aucun fichier de paramètres trouvé. Certaines fonctionnalités pourraient ne pas fonctionner.");
  }
} catch (err) {
  console.error("❌ Erreur lors du chargement des paramètres :", err);
}
// ======================================

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ]
});

bot.commands = new Collection();
bot.settings = settings;
bot.rolePermissions = {
  "Le Parrain": 7,
  "Loutre Lanceuse de Pantoufles": 6,
  "Loutre Sottocapo": 5,
  "Enrôloutre": 4,
  "Loutre Mafieuse": 3,
};

const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');
const loadSlashCommands = require('./Loader/loadSlashCommands');

const timestamp = new Date().toISOString();
bot.color = "#95A5A6";

console.log(timestamp + ': Connexion à Discord...');
bot.login(process.env.DISCORD_TOKEN);
console.log('Connexion validée !');

bot.db = loadDatabase();
loadCommands(bot);
loadEvents(bot);

const { checkRSS } = require('./Helpers/rssHandler');
const { checkRedditFashion } = require('./Helpers/redditFashionRSS');
const RSS_CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes
const REDDIT_CHECK_INTERVAL =
  bot.settings.intervals?.redditFashionRSS ?? 24 * 60 * 60 * 1000; // 24 heures par défaut
const RSS_FEEDS = [
  { url: 'https://fr.finalfantasyxiv.com/lodestone/news/news.xml' },
  { url: 'https://fr.finalfantasyxiv.com/lodestone/news/topics.xml' }
];
const REDDIT_FASHION_RSS = 'https://www.reddit.com/r/ffxiv/search.rss?restrict_sr=on&sort=new&q=author%3AGottesstrafe+Fashion+Report+-+Full+Details+-+For+Week+of&t=week';
const { createMonthlyBestOf } = require('@helpers/createMonthlyBestOf');

bot.on('ready', () => {
  console.log(`Bot opérationnel sous le nom: ${bot.user.tag}!`);

  const guildId = bot.settings.guildId;
  const channelId = bot.settings.channelId;
  if (!guildId || !channelId) {
    console.error('guildId ou channelId manquant dans les paramètres.');
    return;
  }

  const guild = bot.guilds.cache.get(guildId);
  if (guild) {
    const channel = guild.channels.cache.get(channelId);
    if (channel) {
      channel.send('Je suis de nouveau là ! <:otter_pompom:747554032582787163>');
    } else {
      console.error('Channel non trouvé');
    }
  } else {
    console.error('Serveur non trouvé');
  }

  bot.user.setActivity('GILLS', { type: 'WATCHING' });
  loadSlashCommands(bot);

  if (bot.settings.features?.rssFeed !== false) {
    RSS_FEEDS.forEach(feed => checkRSS(bot, feed.url));
  }
  if (bot.settings.features?.redditFashionRSS !== false) {
    checkRedditFashion(bot, REDDIT_FASHION_RSS);
  }

  setInterval(() => {
    if (bot.settings.features?.rssFeed !== false) {
      RSS_FEEDS.forEach(feed => checkRSS(bot, feed.url));
    }
    if (bot.settings.features?.monthlyBestOf !== false) {
      createMonthlyBestOf(bot);
    }
  }, RSS_CHECK_INTERVAL);

  setInterval(() => {
    if (bot.settings.features?.redditFashionRSS !== false) {
      checkRedditFashion(bot, REDDIT_FASHION_RSS);
    }
  }, REDDIT_CHECK_INTERVAL);

  if (bot.settings.features?.keepAlive !== false) {
    setInterval(() => {
      https.get("https://google.com", () => {}).on("error", () => {
        console.error("❌ Erreur Keep-Alive :");
      });
    }, 2 * 60 * 1000);
  }
});

const saveQuote = require('./Helpers/quoteSystem');
const verifyWord = require('./Helpers/verifyWord');
bot.removeAllListeners('messageCreate');

bot.on('messageCreate', async (message) => {
  const exceptionsChannels = bot.settings.ids?.exceptionChannels;
  if (!Array.isArray(exceptionsChannels)) {
    console.error('exceptionChannels non défini.');
  } else if (exceptionsChannels.includes(message.channel.id)) {
    return;
  }
  if (message.author.bot || message.mentions.everyone) return;

  const exceptionsUsers = bot.settings.ids?.exceptionUsers;
  if (!Array.isArray(exceptionsUsers)) {
    console.error('exceptionUsers non défini.');
  } else if (!exceptionsUsers.includes(message.author.id)) {
    if (bot.settings.features?.verifyWord !== false) {
      await verifyWord(message, bot);
    }
  }

  if (!message.mentions.has(bot.user)) return;
  if (bot.settings.features?.quoteSystem !== false) {
    await saveQuote(message, bot);
  }
});

const { welcomeMessage, assignRoles } = require('./Helpers/newMember');
bot.on('guildMemberAdd', async (member) => {
  try {
    if (bot.settings.features?.welcomeMessages !== false) {
      await welcomeMessage(member);
      await assignRoles(member);
    }
  } catch (error) {
    console.error('Erreur lors de l’accueil du nouveau membre :', error);
  }
});

const goodbyeMessage = require('./Helpers/goodbyeMessage');
bot.on('guildMemberRemove', async (member) => {
  console.log(`${member.displayName} a quitté le serveur ${member.guild.name}.`);
  if (bot.settings.features?.goodbyeMessages !== false) {
    await goodbyeMessage(member);
  }
});

bot.on('guildCreate', async (guild) => {
  await bot.function.linkGuildDB(bot, guild);
});

bot.removeAllListeners('interactionCreate');
bot.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = bot.commands.get(interaction.commandName);
      if (!command) return;
      const cfg = bot.settings.commands?.[command.name];
      if (cfg && cfg.enabled === false) {
        return interaction.reply({
          content: cfg.message || "Cette commande est actuellement désactivée.",
          ephemeral: true
        });
      }
      console.log(await dateFormatLog() + '- Commande: ' + command.name + ' par: ' + interaction.user.username);
      command.run(bot, interaction, command.options);
    }
  }
  bot.hasInteractionCreateListener = true;
});
