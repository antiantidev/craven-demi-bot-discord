require("dotenv").config(); // <- Load biến môi trường từ .env
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const { deployCommands } = require("./utils/deployCommands");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// === KẾT NỐI MONGODB ===
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🌸 Đã kết nối MongoDB thành công~"))
  .catch((err) => console.error("🔴 Lỗi kết nối MongoDB:", err));

// === LOAD COMMANDS ===
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
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// === LOAD EVENTS ===
client.events = new Map();
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  client.events.set(event.name, event);
  client.on(event.name, (...args) => event.execute(...args));
}

// === READY EVENT ===
client.once(Events.ClientReady, async () => {
  console.log(`🌸 Bot is ready! Logged in as ${client.user.tag}`);

  // Chỉ cần gọi deploy 1 lần khi khởi động
  await deployCommands();
});

// === COMMAND HANDLER ===
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`);
    console.error(error);
  }
});

// === LOGIN BOT ===
client.login(process.env.TOKEN);
