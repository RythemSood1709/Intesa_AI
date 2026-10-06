import api from "../api/api";

export const getConversations = async () => {
  try {
    const { data } = await api.get("/api/chat/get-conversations");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
