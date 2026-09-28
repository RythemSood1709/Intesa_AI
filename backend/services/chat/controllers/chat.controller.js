import Conversation from "../models/conversation.model.js";

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

const getConversations = async (req, res) => {
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
