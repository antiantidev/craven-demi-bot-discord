const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Guild = require("../../models/Guild");
const i18next = require("../../utils/i18n");

module.exports = {
  scope: "guild",
  data: new SlashCommandBuilder()
    .setName("grantpermission")
    .setDescription("Grant permission to use commands for a server")
    .addStringOption((option) =>
      option
        .setName("guildid")
        .setDescription("The ID of the server to grant permission to")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.options.getString("guildid");

    // Lấy ngôn ngữ từ cơ sở dữ liệu của guild
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    const lang = guildData?.language || "en"; // Nếu không có ngôn ngữ, mặc định là "en"

    console.log(`Ngôn ngữ được chọn: ${lang}`); // Debug để kiểm tra ngôn ngữ

    // Nếu người dùng không phải chủ sở hữu bot, trả về thông báo lỗi
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({
        content: i18next.t("grant_permission.not_owner", {
          lng: lang,
          ns: "grantpermission",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      // Cập nhật quyền cho guild
      const guild = await Guild.findOneAndUpdate(
        { guildId },
        { permission: true },
        { upsert: false, new: true }
      );

      // Nếu guild không tồn tại, trả về thông báo lỗi
      if (!guild) {
        return await interaction.reply({
          content: i18next.t("grant_permission.guild_not_found", {
            lng: lang,
            ns: "grantpermission",
            guildId,
          }),
          flags: MessageFlags.Ephemeral,
        });
      }

      // Thành công, trả về thông báo
      await interaction.reply({
        content: i18next.t("grant_permission.success", {
          lng: lang,
          ns: "grantpermission",
          guildName: guild.name || "Unknown Guild",
          guildId,
        }),
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: i18next.t("grant_permission.error", {
          lng: lang,
          ns: "grantpermission",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
