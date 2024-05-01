const MessageModel = require ("../model/messageModel");


async function addMessage(req, res) {
  const { chatId, senderId, text ,audio} = req.body;

  // Si un fichier est téléchargé, vous pouvez accéder à ses données via req.file
  const file = req.file;

  const message = new MessageModel({
    chatId,
    senderId,
    text,
    file: file ? file.buffer : null, // Assurez-vous de récupérer correctement les données du fichier si elles sont envoyées
    audio
  });

  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
}


async function getMessages  (req, res) {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addMessage,
  getMessages
};
