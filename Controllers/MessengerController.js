const MessageModel = require("../Models/MessageModel");

const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text
  });
  try {
    const result = await message.save();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getMessage = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await MessageModel.find({ chatId });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  addMessage,
  getMessage,
};
