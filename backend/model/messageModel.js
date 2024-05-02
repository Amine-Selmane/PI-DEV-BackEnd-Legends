const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
    file: {
      type: Buffer, // Utilisez Buffer pour stocker les données du fichier
    },

    audio: {
      type: String
  }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
