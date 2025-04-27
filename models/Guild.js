const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  name: String,
  ownerId: String,
  permission: { type: Boolean, default: false },
  language: { type: String, default: "en" },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Guild", guildSchema);
