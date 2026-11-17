import { deductCredits } from "../utils/deductCredits.js";
import { getModel } from "../config/llmModels.js";
import { generatePPT } from "../utils/generatePPT.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");

    const prompt = `
    You are a professional presentation designer.

    Return ONLY valid JSON.

    Format:

    {
    "title": "",
    "subtitle":"",
    "slides":[
    {
    "title":"",
    "points":[
    "",
    "",
    "",
    "",
    ]
    }
    ]
    }

    Rules:
    - Generate exactly 6 content slides.
    - Each slide should have 4-6 concise bullet points.
    - No markdown.
    - No explanation.
    - No code block
    - Return ONLY JSON.
    - The user will give a prompt like (Create a presentation on Virat Kohli). You need to understand the prompt (extract topic from the prompt) and generate on that topic.

    Topic: ${state.prompt} 
    `;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);

    const ppt = await generatePPT(data);

    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });

    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60);

    await deductCredits(state.userId, "ppt");

    return {
      ...state,
      aiResponse: `# 📄 Presentation Generated

**${data?.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 24 hours._`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: "# ❌ Failed to Generate Presentation",
    };
  }
};
