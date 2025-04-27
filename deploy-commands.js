const { REST, Routes } = require("discord.js");
const { clientId, guildId, token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const globalCommands = [];
const guildCommands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      if (command.scope === "global") {
        globalCommands.push(command.data.toJSON());
      } else {
        // Mặc định là 'guild' nếu không chỉ định
        guildCommands.push(command.data.toJSON());
      }
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    // Đăng ký GLOBAL commands
    if (globalCommands.length > 0) {
      console.log(`🔄 Registering ${globalCommands.length} global commands...`);
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: globalCommands,
      });
      console.log(`✅ Successfully registered ${data.length} global commands.`);
    }

    // Đăng ký GUILD commands
    if (guildCommands.length > 0) {
      console.log(`🔄 Registering ${guildCommands.length} guild commands...`);
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: guildCommands }
      );
      console.log(`✅ Successfully registered ${data.length} guild commands.`);
    }
  } catch (error) {
    console.error("❌ Error registering commands:", error);
  }
})();
