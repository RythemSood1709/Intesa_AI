import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  const intentModel = await getModel("intent");

  const llm = await getModel("coding");

  const intentRes = await intentModel.invoke(`
      You are an AI intent classifier.

      Return ONLY one of these values.

      CODE_GENERATION
      CODE_REVIEW
      CODE_EXPLANATION
      DEBUGGING
      OPTIMIZATION
      CONVERSION
      DOCUMENTATION

      User Request: 
      ${state.prompt}
    `);

  const intent = intentRes.content.trim();

  if (intent === "CODE_GENERATION") {
    const prompt = `
      You are IntesaAI Coding Agent.

      Generate the requested project.

      Default Stack:
      - HTML
      - CSS
      - JavaScript

      Use React/ Next.js / Vue ONLY if explicitly requested.

      Rules: 
      - Responsive
      - Modern UI
      - CSS Variables
      - Flexbox/Grid
      - Smooth Scroll
      - Hover Effects
      - Beautiful spacing
      - Single page unless user asks otherwise.

      Return ONLY valid JSON.

      Schema: 

      {
        "files":[
          {
            "name": "index.html",
            "content": "..."
          },
          {
            "name": "style.css",
            "content": "..."
          },
          {
            "name": "script.js",
            "content": "..."
          }
        ]
      }

      Rules: 
      - Output must start with {
      - Output must end with }
      - No markdown
      - No explanation
      - No extra text
      - No \`\`\`
      - Never mention intent

      User Request:
      ${state.prompt}
    `;
  }
};
