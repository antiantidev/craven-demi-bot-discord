const Guild = require("../models/Guild");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    try {
      // Kiểm tra nếu guild đã tồn tại
      const existingGuild = await Guild.findOne({ guildId: guild.id });
      if (existingGuild) {
        console.log(`🔁 Guild ${guild.name} đã có trong DB rồi~`);
        return;
      }

      // Lưu thông tin mới
      await Guild.create({
        guildId: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
      });

      console.log(`🌟 Đã lưu guild mới: ${guild.name} (${guild.id})`);
    } catch (error) {
      console.error("❌ Lỗi khi lưu guild vào MongoDB:", error);
    }
  },
};
