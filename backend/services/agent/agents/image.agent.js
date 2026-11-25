import { getModel } from "../config/llmModels.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageAgent = async (state) => {
  try {
    await checkAgentLimit(state?.userId, "image");

    const llm = await getModel("image");

    const res = await llm.invoke(
      `
            You are an elite AI image prompt engineer.

            Convert the user request into a highly detailed image generation prompt.

            Requirements:

            - Cinematic lighting
            - Professional composition
            - Ultra realistic
            - High detail
            - Beautiful color palette
            - Sharp focus
            - 8K quality
            - photorealistic
            - Depth of field
            - Professional photography
            - Stunning visuals

            Return only the image prompt.

            User request: 
            ${state.prompt}
        `,
    );

    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(imgRes.data);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    await deductCredits(state.userId, "image");

    return {
      ...state,
      aiResponse: `# 🏞️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 24 hours.`,
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
      aiResponse: "# ❌ Failed to Generate Image",
    };
  }
};
