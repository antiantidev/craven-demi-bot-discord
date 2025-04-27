const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionsBitField,
} = require("discord.js");
const i18next = require("../../utils/i18n");
const Guild = require("../../models/Guild");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("setlanguage")
    .setDescription("Set the language for the server")
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("Choose the language (en/vi)")
        .setRequired(true)
        .addChoices(
          { name: "English", value: "en" },
          { name: "Vietnamese", value: "vi" }
        )
    ),

  async execute(interaction) {
    const language = interaction.options.getString("language");

    // Kiểm tra ngôn ngữ hợp lệ
    if (!["en", "vi"].includes(language)) {
      return interaction.reply({
        content: i18next.t("set_language.invalid_language", {
          lng: language,
          ns: "setlanguage",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }

    const guildId = interaction.guildId;
    const guild = await Guild.findOne({ guildId });

    const lang = guild?.language || "en"; // Đảm bảo ngôn ngữ mặc định là "en"

    // Kiểm tra quyền quản trị viên
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content: i18next.t("set_language.no_permission", {
          lng: lang,
          ns: "setlanguage",
        }),
        flags: MessageFlags.Ephemeral,
      });
    }

    // Cập nhật ngôn ngữ cho guild
    await Guild.findOneAndUpdate(
      { guildId },
      { language },
      { upsert: true, new: true }
    );

    // Trả lời thông báo thành công
    await interaction.reply({
      content: i18next.t("set_language.success", {
        lng: language,
        ns: "setlanguage",
        language:
          language === "en"
            ? "English"
            : language === "vi"
            ? "Tiếng Việt"
            : language,
      }),
      flags: MessageFlags.Ephemeral,
    });
  },
};
