const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const AiPermission = require("../../models/AiPermission");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("airevoke")
    .setDescription("Revoke access to the /ai command (bot owner only)")
    .setIntegrationTypes(1)
    .setContexts(0, 1, 2)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Revoke from a user or guild")
        .setRequired(true)
        .addChoices(
          { name: "user", value: "user" },
          { name: "guild", value: "guild" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the user or guild")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== process.env.OWNER_ID) {
      await interaction.reply({
        content: "Only the bot owner can use this command.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");

    const deleted = await AiPermission.findOneAndDelete({
      [type === "user" ? "userId" : "guildId"]: id,
    });

    if (deleted) {
      await interaction.reply(
        `Revoked AI access from ${type} with ID \`${id}\`.`
      );
    } else {
      await interaction.reply("No permission entry found to revoke.");
    }
  },
};
