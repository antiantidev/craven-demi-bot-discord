const { SlashCommandBuilder } = require("discord.js");
const ChatHistory = require("../../models/ChatHistory");
const AiPermission = require("../../models/AiPermission");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("aiclear")
    .setDescription("Delete your entire chat history with AI")
    .setIntegrationTypes(1)
    .setContexts(0, 1, 2),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id || null;

    // 🔐 If not the bot owner, check permission in DB
    if (userId !== process.env.OWNER_ID) {
      const hasPermission = await AiPermission.findOne({
        $or: [{ userId }, ...(guildId ? [{ guildId }] : [])],
      });

      if (!hasPermission) {
        await interaction.reply({
          content: "You don't have permission to use this command.",
          ephemeral: true,
        });
        return;
      }
    }

    const deleted = await ChatHistory.findOneAndDelete({ userId });

    if (deleted) {
      await interaction.reply(
        "Your entire chat history with the AI has been cleared! 🧹"
      );
    } else {
      await interaction.reply("Looks like you haven't talked to the AI yet!");
    }
  },
};
