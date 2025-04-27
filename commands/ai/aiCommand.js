const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { callAiAPI } = require("../../utils/callAiGenerateContent");
const ChatHistory = require("../../models/ChatHistory");
const AiPermission = require("../../models/AiPermission");
const CommandUsage = require("../../models/CommandUsage");

module.exports = {
  scope: "global",
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Chat with AI through LM Studio or Google GenAI")
    .setIntegrationTypes(1)
    .setContexts(0, 1, 2)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to send to the AI")
        .setRequired(true)
    ),
  // .addStringOption((option) =>
  //   option
  //     .setName("source")
  //     .setDescription("Choose the AI source (lmstudio or google)")
  //     .setRequired(true)
  //     .addChoices(
  //       { name: "LM Studio", value: "lmstudio" },
  //       { name: "Google GenAI", value: "google" }
  //     )
  // ),

  async execute(interaction) {
    const commandName = interaction.commandName;
    const userId = interaction.user.id;
    const guildId = interaction.guild?.id || null;
    const userMessage = interaction.options.getString("message");
    // const source = interaction.options.getString("source");

    // 🔐 If not the bot owner, check permission from DB
    if (userId !== process.env.OWNER_ID) {
      const hasPermission = await AiPermission.findOne({
        $or: [{ userId }, ...(guildId ? [{ guildId }] : [])],
      });

      if (!hasPermission) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    // Cập nhật thống kê số lần sử dụng lệnh (chỉ theo command)
    await CommandUsage.findOneAndUpdate(
      { commandName },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    await interaction.deferReply();

    // 💬 Get or create chat history
    let history = await ChatHistory.findOne({ userId });
    if (!history) {
      history = new ChatHistory({ userId, messages: [] });
    }

    // ➕ Add user message
    history.messages.push({ role: "user", content: userMessage });

    try {
      // 📡 Call the AI API with the selected source (lmstudio or google)
      const aiReply = await callAiAPI(history.messages, "google");

      // 🧠 Add AI reply and trim if too long
      history.messages.push({ role: "assistant", content: aiReply });

      if (history.messages.length > 20) {
        history.messages = history.messages.slice(-20);
      }

      await history.save();

      // ✅ Nếu câu trả lời quá dài, chia thành nhiều phần
      const chunkSize = 2000;
      const chunks = [];

      // Chia câu trả lời thành các đoạn nhỏ không vượt quá 2000 ký tự
      for (let i = 0; i < aiReply.length; i += chunkSize) {
        chunks.push(aiReply.slice(i, i + chunkSize));
      }

      // Gửi từng phần một, không sử dụng editReply mà dùng followUp
      for (const chunk of chunks) {
        await interaction.followUp(chunk);
      }
    } catch (error) {
      console.error("Error during AI interaction:", error);
      await interaction.editReply(
        "Oops! Something went wrong while interacting with the AI 🥲"
      );
    }
  },
};
