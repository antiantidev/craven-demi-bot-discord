const mongoose = require("mongoose");

const aiPermissionSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  guildId: { type: String, default: null },
});

module.exports = mongoose.model("AiPermission", aiPermissionSchema);
