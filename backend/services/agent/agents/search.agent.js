import { deductCredits } from "../utils/deductCredits.js";
import { searchTool } from "../config/tavily.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const searchAgent = async (state) => {
  try {
    await checkAgentLimit(state?.userId, "search");

    const results = await searchTool.invoke({
      query: state.prompt,
    });
    console.log(results);

    await deductCredits(state.userId, "search");

    return {
      ...state,
      searchResults: results,
      images: results.images,
    };
  } catch (error) {
    if (error?.status === 429) {
      return {
        ...state,
        aiResponse: error?.data?.message,
      };
    }
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
