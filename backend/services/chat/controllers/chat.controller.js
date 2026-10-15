import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    console.log("User ID from header:", userId);

    const conversation = await Conversation.create({
      userId: userId,
    });

    return res.status(201).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to create conversation ${error}` });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    // get most recent conversations for the user sorted by updatedAt in descending order
    const conversations = await Conversation.find({ userId: userId }).sort({
      updatedAt: -1,
    });

    return res.status(200).json(conversations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get conversations ${error}` });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(id, {
      title,
    });

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: `Failed to update title ${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;

    const message = await Message.create({
      conversationId,
      content,
      role,
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: `Failed to save message ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get messages ${error}` });
  }
};
