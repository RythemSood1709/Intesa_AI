import { getModel } from "../config/llmModels.js";

const parseGeneratedProject = (content) => {
  const text = Array.isArray(content)
    ? content
        .map((part) => (typeof part === "string" ? part : part?.text || ""))
        .join("")
    : typeof content === "string"
      ? content
      : JSON.stringify(content);

  const withoutMarkdown = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const data = JSON.parse(withoutMarkdown);

    if (!data || !Array.isArray(data.files)) {
      throw new Error('The model response does not contain a "files" array.');
    }

    return data;
  } catch (error) {
    throw new Error(
      `Coding model returned invalid project JSON: ${error.message}. ` +
        "The response may have been truncated; increase the model output limit or simplify the request.",
      { cause: error },
    );
  }
};

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

    const response = await llm.invoke(prompt);

    const data = parseGeneratedProject(response.content);

    return {
      ...state,
      aiResponse: "Code Generated Successfully.",
      artifacts: [
        {
          id: Date.now(),
          type: "Project",
          title: state.prompt,
          files: data.files || [],
        },
      ],
    };
  }

  const res = await llm.invoke(`
  You are IntesaAI Coding Agent.

  User's Request is:
  ${intent}

  Return Markdown only.

  Never Generate project files.

  Use headings like:

  #Overview

  ##Explanation

  ##Problems

  ##Improvements

  ##Best Practices

  ##Optimized Code (if needed)

  User Request:
  ${state.prompt}
    `);

  const data = res.content;

  return {
    ...state,
    aiResponse: data,
    artifacts: [],
  };
};
