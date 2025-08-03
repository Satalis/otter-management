const reddit = require('./redditAPI');

async function checkRedditPosts(client) {
  if (!client.db) return;
  try {
    const snapshot = await client.db.collection('redditPosts').get();
    let processed = 0;
    for (const doc of snapshot.docs) {
      if (processed >= 90) {
        console.warn('Quota Reddit atteint, arrêt de la vérification des posts.');
        break;
      }

      const remaining = typeof reddit.ratelimitRemaining === 'number' ? reddit.ratelimitRemaining : null;
      const reset = typeof reddit.ratelimitExpiration === 'number'
        ? Math.ceil((reddit.ratelimitExpiration - Date.now()) / 1000)
        : null;
      console.log(`Reddit rate limit - Remaining: ${remaining}, Reset: ${reset}s`);
      if (remaining !== null && remaining <= 10) {
        console.warn('Ratelimit Reddit faible, arrêt de la vérification des posts.');
        break;
      }

      const postId = doc.id;
      const { messageId, channelId } = doc.data();
      try {
        await reddit.getSubmission(postId).fetch();
      } catch (err) {
        if (err.statusCode === 404) {
          const channel = client.channels.cache.get(channelId);
          if (channel) {
            try {
              const message = await channel.messages.fetch(messageId);
              await message.delete();
            } catch (discordErr) {
              console.error('Erreur suppression message Discord:', discordErr);
            }
          }
          await client.db.collection('redditPosts').doc(postId).delete();
        } else {
          console.error('Erreur vérification post Reddit:', err);
        }
      }

      processed++;
    }
  } catch (err) {
    console.error('Erreur récupération redditPosts:', err);
  }
}

module.exports = { checkRedditPosts };
