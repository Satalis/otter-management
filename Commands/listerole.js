const { EmbedBuilder } = require('discord.js');
const settings = require('../settings.json');

module.exports = {
    name: "listerole",
    description: "Affiche la liste des membres possédant un rôle.",
    permission: "Aucune",
    dm: false,
    options: [
        {
            type: "ROLE",
            name: "role",
            description: "Rôle à afficher",
            required: true,
        }
    ],
    async run(bot, interaction) {
        if (!settings.commands?.listerole) {
            return interaction.reply({ content: 'Cette fonctionnalité est désactivée.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        await interaction.deferReply({ ephemeral: true });
        await interaction.guild.members.fetch();

        const members = role.members.map(m => `\u2022 ${m.displayName || m.user.username}`);

        const embed = new EmbedBuilder()
            .setTitle(`Rôle : ${role.name}`)
            .addFields(
                { name: 'Nom du rôle', value: `\u2022 ${role.name}`},
                { name: 'Nombre de membres', value: `${members.length}`},
                { name: 'Pseudo des membres', value: members.length > 0 ? members.join('\n') : 'Aucun membre.' },
                { name: 'Date du rôle', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>` }
            )
            .setColor(role.color || '#0099ff')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
