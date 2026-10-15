import React from "react";
import api from "../../utils/axios";

const sendMessage = async (payload) => {
  try {
    const { data } = await api.post("/api/agent/chat", payload);

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default sendMessage;
