const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const AiPermission = require("../../models/AiPermission");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("aigrant")
    .setDescription("Grant access to the /ai command (bot owner only)")
    .setIntegrationTypes(1)
    .setContexts(0, 1, 2)
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Grant to a user or guild")
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

    const exists = await AiPermission.findOne({
      [type === "user" ? "userId" : "guildId"]: id,
    });

    if (exists) {
      await interaction.reply(
        "This target already has permission to use the AI command."
      );
      return;
    }

    const newPermission = new AiPermission({
      userId: type === "user" ? id : null,
      guildId: type === "guild" ? id : null,
    });

    await newPermission.save();
    await interaction.reply(
      `AI permission granted to **${type}** with ID \`${id}\`.`
    );
  },
};
