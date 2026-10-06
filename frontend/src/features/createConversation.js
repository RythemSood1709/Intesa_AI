import api from "../api/api";

export const createConversation = async () => {
  try {
    const { data } = await api.get("/api/chat/create-conversation");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
