const Discord = require('discord.js');
const db = require('@loader/loadDatabase'); 
const deleteMember = require('@websiteUtils/deleteMember');


module.exports = {
    name: "delete",
    description: "Supprime un membre du site.",
    options: [
        {
            type: "USER",
            name: "membre",
            description: "Membre à retirer de la BDD.",
            required: true,
            autocomplete: true,
        }
    ],
    async run(bot, interaction) {
        const allowedUsers = interaction.client.settings.ids?.allowedUsers;
        if (!Array.isArray(allowedUsers)) {
            return interaction.followUp({ content: "Liste des utilisateurs autorisés non configurée.", ephemeral: true });
        }
        const isAllowedUser = allowedUsers.includes(interaction.user.id);

        // Vérifie l'autorisation
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            console.log( `[Delete] Utilisateur non autorisé: ${interaction.user.username}`);
            return interaction.followUp({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

     // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordName = discordUser.username; // Récupérer le nom d'utilisateur Discord
        const discordId = discordUser.id
        console.log(`[Delete] Suppression du membre ${discordName} en cours...`);
        await deleteMember(discordId, interaction, bot);
    }
}