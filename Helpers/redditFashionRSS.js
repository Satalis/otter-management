const RSSParser = require('rss-parser');
const { dateFormatLog } = require('./logTools');

const parser = new RSSParser({
    headers: { 'User-Agent': 'Mozilla/5.0 (OtterBot RSS Reader)' },
    customFields: {
        item: ['media:thumbnail', 'media:content']
    }
});

/**
 * Vérifie si un message avec le même titre d'embed existe déjà dans les 40 derniers messages.
 * @param {TextChannel} channel - Le channel Discord où vérifier les messages.
 * @param {string} title - Le titre du message à publier.
 * @returns {Promise<boolean>} - Retourne true si un doublon est trouvé, sinon false.
 */
async function isDuplicateMessage(channel, title) {
    try {
        const messages = await channel.messages.fetch({ limit: 40 });
        for (const [, message] of messages) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                if (embed.title === title) {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error(await dateFormatLog() + 'Erreur lors de la vérification des messages existants :', error);
        return false;
    }
}

/**
 * Extrait l'URL de la première image trouvée dans le contenu HTML.
 * @param {string} content - Contenu HTML de l'article.
 * @returns {string|null} - URL de l'image ou null si aucune image trouvée.
 */
function decodeHtmlEntities(str) {
    return str
        ? str
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
        : str;
}

function getFullSizeImage(url) {
    if (!url) {
        return url;
    }
    const clean = decodeHtmlEntities(url).split('?')[0];
    return clean
        .replace('external-preview.redd.it', 'i.redd.it')
        .replace('preview.redd.it', 'i.redd.it');
}

function extractImage(content) {
    const imgMatch = content && content.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? decodeHtmlEntities(imgMatch[1]) : null;
}

/**
 * Surveille un flux RSS Reddit pour les posts Fashion Report.
 * @param {Client} bot - L'instance du bot Discord.
 * @param {string} rssUrl - L'URL du flux RSS à surveiller.
 */
async function checkRedditFashion(bot, rssUrl) {
    try {
        const feed = await parser.parseURL(rssUrl);
        for (const item of feed.items) {
            const pubDate = new Date(item.pubDate || item.isoDate).getTime();
            if (!pubDate || Date.now() - pubDate > 7 * 24 * 60 * 60 * 1000) {
                continue;
            }

            const author = item.author || item.creator || '';
            const title = item.title || '';
            if (!author.includes('Gottesstrafe') || !title.includes('Fashion Report - Full Details - For Week of')) {
                continue;
            }

            const link = decodeHtmlEntities(item.link);
            const rawImageUrl =
                extractImage(item.content || item['content:encoded'] || '') ||
                item['media:content']?.$?.url ||
                item['media:thumbnail']?.$?.url ||
                '';
            const imageUrl = rawImageUrl ? getFullSizeImage(rawImageUrl) : null;

            console.log(await dateFormatLog() + `[Reddit] ${title} - ${link} - ${imageUrl}`);

            const settings = bot.settings || {};
            const channelId = settings.ids?.redditFashionChannel;
            if (!channelId) {
                continue;
            }
            const channel = bot.channels.cache.get(channelId);
            if (!channel) {
                console.warn(await dateFormatLog() + `Salon Reddit Fashion introuvable : ${channelId}`);
                continue;
            }
            if (await isDuplicateMessage(channel, title)) {
                continue;
            }
            const embed = {
                title,
                url: link,
                image: imageUrl ? { url: imageUrl } : undefined
            };

            await channel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.error(await dateFormatLog() + '[Reddit] Erreur lors de la vérification du flux RSS :', error);
    }
}

module.exports = { checkRedditFashion };
