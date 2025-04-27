// utils/deployCommands.js
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { clientId, guildId, token } = require("../config.json");

async function deployCommands() {
  const globalCommands = [];
  const guildCommands = [];

  const foldersPath = path.join(__dirname, "..", "commands");
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
          guildCommands.push(command.data.toJSON());
        }
      }
    }
  }

  const rest = new REST().setToken(token);

  try {
    if (globalCommands.length > 0) {
      console.log(`🌍 Deploying ${globalCommands.length} global commands...`);
      await rest.put(Routes.applicationCommands(clientId), {
        body: globalCommands,
      });
      console.log(`🟢 Deployed global commands.`);
    }

    if (guildCommands.length > 0) {
      console.log(`🌍 Deploying ${guildCommands.length} guild commands...`);
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: guildCommands,
      });
      console.log(`🟢 Deployed guild commands.`);
    }
  } catch (error) {
    console.error("❌ Error while deploying commands:", error);
  }
}

module.exports = { deployCommands };
