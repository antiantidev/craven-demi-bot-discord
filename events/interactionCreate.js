const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === "streamoverlay") {
        const choice = interaction.values[0];

        let reply;
        let button; // Khai báo button

        switch (choice) {
          case "cosy-boho":
            reply = "🌿 You chose **Cosy Boho Stream Package**!";
            button = new ButtonBuilder()
              .setLabel("Download")
              .setStyle(ButtonStyle.Link)
              .setURL(
                "https://17vh2r-my.sharepoint.com/:u:/g/personal/chokernguyen_gateway_id_vn/EY8gcZ-8W9hAuiNB3LT0byMBuE0Fz-YrvV2kDbjbpvGBZA?e=U2NINh"
              ); // Link của Bulbasaur
            break;
          case "goth-skull":
            reply = "🔥 You chose **Goth Skull Stream Package**!";
            button = new ButtonBuilder()
              .setLabel("Download")
              .setStyle(ButtonStyle.Link)
              .setURL(
                "https://17vh2r-my.sharepoint.com/:u:/g/personal/chokernguyen_gateway_id_vn/EWSViTgO-N9FkIWWfQ744m4BmdZHd8WuHy4SeWNvMxZi3g?e=VOgfDD"
              ); // Link của Charmander
            break;
          case "mint-green":
            reply = "💧 You chose **Goth Skull - Mint Green**!";
            button = new ButtonBuilder()
              .setLabel("Download")
              .setStyle(ButtonStyle.Link)
              .setURL(
                "https://17vh2r-my.sharepoint.com/:u:/g/personal/chokernguyen_gateway_id_vn/EVEgfnTdTTBHlCSkqYKbJXwBVdSWdw7h1tAPaJ45o6nyEQ?e=3aw218"
              ); // Link của Squirtle
            break;
          case "glow-pink":
            reply = "💧 You chose **Goth Skull - Glowing Pink**!";
            button = new ButtonBuilder()
              .setLabel("Download")
              .setStyle(ButtonStyle.Link)
              .setURL(
                "https://17vh2r-my.sharepoint.com/:u:/g/personal/chokernguyen_gateway_id_vn/EXf6tVt_3cFFro3hXgamgk0BRkWv3OVjh0q7LQQvF0XP0w?e=j87tm3"
              ); // Link của Squirtle
            break;
          default:
            reply = "Hmmm... Em chưa biết Pokémon đó luôn á~ 😝";
            button = new ButtonBuilder()
              .setLabel("Learn more about Pokémon")
              .setStyle(ButtonStyle.Link)
              .setURL("https://pokemon.fandom.com/wiki/Pokémon"); // Link mặc định nếu không có lựa chọn
        }

        // Tạo một ActionRow chứa button
        const row = new ActionRowBuilder().addComponents(button);

        // Cập nhật tin nhắn với button link
        await interaction.update({
          content: reply,
          components: [row], // Thêm ActionRow chứa button
        });
      }
    }
  },
};
