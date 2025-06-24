const RSSParser = require('rss-parser');
const parser = new RSSParser();
const { dateFormatLog } = require('./logTools');
const { isDuplicateMessage, convertToFrenchTime } = require('./rssHandler');

/**
 * Vérifie et publie les tweets correspondant à un filtre depuis un compte Twitter via Nitter.
 * @param {Client} bot - Instance du bot Discord.
 * @param {string} username - Nom d'utilisateur Twitter.
 * @param {string} titleFilter - Texte devant être présent dans le titre du tweet.
 */
/**
 *
 * @param {Client} bot - Instance du bot Discord.
 * @param {string} username - Nom d'utilisateur Twitter.
 * @param {string} titleFilter - Texte devant être présent dans le titre du tweet.
 * @param {number} [maxAgeMs=5 * 60 * 60 * 1000] - Durée maximale en millisecondes pour laquelle on considère un tweet valide.
 */
async function checkTwitterFeed(bot, username, titleFilter, maxAgeMs = 5 * 60 * 60 * 1000) {
  const rssUrl = `https://nitter.net/${username}/rss`;
  try {
    const feed = await parser.parseURL(rssUrl);
    const now = Date.now();

    for (const item of feed.items) {
      if (!item.title || !item.title.toLowerCase().includes(titleFilter.toLowerCase())) {
        continue;
      }

      const pubDate = new Date(item.pubDate || item.isoDate).getTime();
      if (isNaN(pubDate) || now - pubDate > maxAgeMs) {
        continue;
      }

      const idMatch = item.link.match(/status\/(\d+)/);
      const tweetUrl = idMatch ? `https://x.com/${username}/status/${idMatch[1]}` : item.link;

      const frenchTime = convertToFrenchTime(pubDate);
      const embed = {
        title: item.title,
        url: tweetUrl,
        footer: {
          text: `Twitter • ${frenchTime}`,
          icon_url: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png'
        }
      };

      const channelId = bot.settings?.ids?.rssChannel;
      if (!channelId) {
        console.warn(await dateFormatLog() + "Aucun canal RSS défini dans les paramètres.");
        return;
      }
      const channel = bot.channels.cache.get(channelId);
      if (!channel) {
        console.error(await dateFormatLog() + `Le canal avec l'ID ${channelId} n'existe pas.`);
        return;
      }

      if (await isDuplicateMessage(channel, item.title)) {
        console.log(await dateFormatLog() + `Tweet déjà publié, passage : ${item.title}`);
        continue;
      }

      await channel.send({ embeds: [embed] });
      console.log(await dateFormatLog() + `Publication Twitter : ${item.title}`);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du flux Twitter :', error);
  }
}

module.exports = { checkTwitterFeed };
