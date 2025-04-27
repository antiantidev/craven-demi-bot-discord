const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CommandUsage = require("../../models/CommandUsage");

module.exports = {
  scope: "global", // 💌 Thêm dòng này để phân loại
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription(
      "Get the avatar URL of the selected user, or your own avatar."
    )
    .setIntegrationTypes(1)
    .setContexts(0, 1, 2)
    .addUserOption((option) =>
      option.setName("target").setDescription("The user's avatar to show")
    ),

  async execute(interaction) {
    const commandName = interaction.commandName;
    const user = interaction.options.getUser("target");
    // Cập nhật thống kê số lần sử dụng lệnh (chỉ theo command)
    await CommandUsage.findOneAndUpdate(
      { commandName },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    const avatarURL = user
      ? user.displayAvatarURL({ dynamic: true, size: 4096 })
      : interaction.user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
      .setTitle(user ? `${user.username}'s Avatar` : "Your Avatar")
      .setImage(avatarURL)
      .setColor("#00FF00") // Màu sắc của Embed (tuỳ chỉnh theo ý bạn)
      .setFooter({
        text: user ? `${user.username}'s Avatar` : "Your Avatar",
        iconURL: interaction.user.displayAvatarURL(),
      });

    return interaction.reply({ embeds: [embed] });
  },
};
