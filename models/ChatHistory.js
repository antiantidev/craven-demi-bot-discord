// models/ChatHistory.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const chatHistorySchema = new mongoose.Schema({
  userId: String,
  messages: [messageSchema],
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
