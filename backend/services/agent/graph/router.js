import { getModel } from "../config/llmModels.js";

export const router = async (state) => {
  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent,
    };
  }

  const llm = await getModel("router");

  const prompt = `You are an agent router. 
  You will be given a prompt and you will have to decide which agent is best suited to handle the prompt. 
  The agents available are: chat, search, coding, pdf, ppt, image. 
  You are a highly accurate routing assistant. Your ONLY job is to analyze the user's prompt and route it to the single most appropriate agent from the list below. 

    You must output ONLY the exact name of the agent. Do not include any other text, punctuation, or explanation.

    AVAILABLE AGENTS:
    1. "search": Use if the prompt requires up-to-date information, real-time data, current events, or web browsing.
    2. "coding": Use if the prompt involves writing, explaining, or debugging code, algorithms, or software architecture.
    3. "pdf": Use if the prompt asks to read, summarize, analyze, or create a PDF document.
    4. "ppt": Use if the prompt asks to build, format, or analyze presentation slides or a slide deck.
    5. "vision": Use if the prompt asks to generate, edit, or describe a picture, photo, or visual art.
    6. "chat": Use as the DEFAULT fallback for general conversation, creative writing, brainstorming, formatting text, or historical/static knowledge that does not require web search.

    Analyze the following user prompt and output the correct agent name:You will return the name (only name) of the agent that is best suited to handle the prompt. 
    The prompt is: ${state.prompt}`;

  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
