const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const Guild = require("../../models/Guild");
const i18next = require("../../utils/i18n");

module.exports = {
  scope: "guild",
  data: new SlashCommandBuilder()
    .setName("revokepermission")
    .setDescription("Revoke command access permission from a server")
    .addStringOption((option) =>
      option
        .setName("guildid")
        .setDescription("The ID of the server to revoke permission from")
        .setRequired(true)
    ),

  async execute(interaction) {
    const guildId = interaction.options.getString("guildid");

    // Lấy ngôn ngữ từ cơ sở dữ liệu của guild
    const guildData = await Guild.findOne({ guildId: interaction.guild.id });
    const lang = guildData?.language || "en"; // Nếu không có ngôn ngữ, mặc định là "en"

    console.log(`Ngôn ngữ được chọn: ${lang}`); // Debug để kiểm tra ngôn ngữ

    // Kiểm tra quyền sở hữu
    if (interaction.user.id !== process.env.OWNER_ID) {
      return await interaction.reply({
        content: i18next.t("revoke_permission.not_owner", {
          lng: lang,
          ns: "revokepermission",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      // Cập nhật quyền của guild
      const guild = await Guild.findOneAndUpdate(
        { guildId },
        { permission: false },
        { new: true }
      );

      // Nếu guild không tồn tại, trả về thông báo lỗi
      if (!guild) {
        return await interaction.reply({
          content: i18next.t("revoke_permission.guild_not_found", {
            lng: lang,
            ns: "revokepermission",
            guildId,
          }),
          flags: MessageFlags.Ephemeral,
        });
      }

      // Thành công, trả về thông báo
      await interaction.reply({
        content: i18next.t("revoke_permission.success", {
          lng: lang,
          ns: "revokepermission",
          guildName: guild.name || "Unknown Guild",
          guildId,
        }),
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: i18next.t("revoke_permission.error", {
          lng: lang,
          ns: "revokepermission",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
