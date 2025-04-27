const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SlashCommandBuilder,
  MessageFlags,
} = require("discord.js");

const Guild = require("../../models/Guild");
const CommandUsage = require("../../models/CommandUsage");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("streamoverlay")
    .setDescription("Get stream overlay"),
  async execute(interaction) {
    const commandName = interaction.commandName;

    if (interaction.guild) {
      const guildId = interaction.guild.id;
      const guild = await Guild.findOne({ guildId });

      // ❗ Nếu chưa đăng ký trong DB
      if (!guild) {
        return await interaction.reply({
          content:
            "🚫 Server chưa được đăng ký trong hệ thống. Vui lòng mời bot lại hoặc liên hệ admin 💬",
          ephemeral: true,
        });
      }

      // ❗ Nếu không có quyền sử dụng lệnh
      if (!guild.permission) {
        return await interaction.reply({
          content:
            "🔒 Server của bạn chưa được cấp quyền sử dụng lệnh này. Vui lòng liên hệ admin để mở quyền 💬",
          ephemeral: true,
        });
      }
    }

    // ✅ Cập nhật số lần sử dụng lệnh
    await CommandUsage.findOneAndUpdate(
      { commandName },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    // ✅ Gửi menu lựa chọn
    const select = new StringSelectMenuBuilder()
      .setCustomId("streamoverlay")
      .setPlaceholder("Make a selection!")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Cosy Boho Stream Package")
          .setValue("cosy-boho"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Goth Skull Stream Package")
          .setValue("goth-skull"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Goth Skull - Mint Green")
          .setValue("mint-green"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Goth Skull - Glowing Pink")
          .setValue("glow-pink")
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: "Choose your starter!",
      flags: MessageFlags.Ephemeral,
      components: [row],
    });
  },
};
