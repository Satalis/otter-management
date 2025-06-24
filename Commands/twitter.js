const { checkTwitterFeed } = require('../Helpers/twitterFeed');

module.exports = {
    name: "twitter",
    description: "Vérifie les tweets d'un utilisateur contenant un mot-clé.",
    permission: "Aucune",
    dm: false,
    category: "User",
    options: [
        {
            type: "STRING",
            name: "utilisateur",
            description: "Nom d'utilisateur Twitter",
            required: true
        },
        {
            type: "STRING",
            name: "motcle",
            description: "Texte à rechercher dans le titre",
            required: true
        },
        {
            type: "STRING",
            name: "periode",
            description: "Ex. 15m, 1h ou 24h",
            required: false
        }
    ],

    async run(bot, interaction) {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ ephemeral: true });
        }

        const username = interaction.options.getString('utilisateur');
        const filter = interaction.options.getString('motcle');
        const periodStr = interaction.options.getString('periode');

        let maxAgeMs = 5 * 60 * 60 * 1000; // 5 heures par défaut
        if (periodStr) {
            const match = periodStr.match(/^(\d+)(m|h|d)?$/i);
            if (match) {
                const value = parseInt(match[1], 10);
                const unit = match[2] ? match[2].toLowerCase() : 'm';
                if (unit === 'h') maxAgeMs = value * 60 * 60 * 1000;
                else if (unit === 'd') maxAgeMs = value * 24 * 60 * 60 * 1000;
                else maxAgeMs = value * 60 * 1000;
            }
        }

        await checkTwitterFeed(bot, username, filter, maxAgeMs);
        await interaction.followUp({ content: "Flux vérifié.", ephemeral: true });
    }
};
