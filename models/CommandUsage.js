const mongoose = require("mongoose");

const commandUsageSchema = new mongoose.Schema({
  commandName: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
});

module.exports = mongoose.model("CommandUsage", commandUsageSchema);
