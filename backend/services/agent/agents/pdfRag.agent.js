import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDB.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfRagAgent = async (state) => {
  let pdf;

  try {
    await checkAgentLimit(state?.userId, "pdf");
    
    const buffer = await fs.readFile(state.file.path);

    pdf = new PDFParse({
      data: buffer,
    });

    const result = await pdf.getText();

    const text = result.text;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    const collectionName = `pdf-${Date.now()}`;

    const store = await vectorStore(docs, collectionName);

    const relevantDocs = await store.similaritySearch(state.prompt, 5);

    const context = relevantDocs.map((d) => d.pageContent).join("\n\n");

    const llm = await getModel("pdfRag");

    const messages = [
      new SystemMessage(` You are IntesaAI PDF Assistant.
          Rules: 
          - Answer ONLY from the uploaded PDF.
          - Never make up information.
          - If the answer is not present in the PDF, reply:
          "I couldn't find the answer to your question in the PDF. Please provide more information or ask a different question."
          - Use Markdown formatting.
        `),
      new HumanMessage(`Context: ${context}
        Question: ${state.prompt}
        `),
    ];

    const response = await llm.invoke(messages);

    await deductCredits(state.userId, "pdf");

    return {
      ...state,
      aiResponse: response?.content,
    };
  } catch (error) {
    console.log("Error in pdfRagAgent:", error);
    if (error?.status === 429) {
      return {
        ...state,
        aiResponse: error?.data?.message,
      };
    }
    return {
      ...state,
      aiResponse: "Failed to analyze the PDF.",
    };
  } finally {
    if (pdf) {
      await pdf.destroy();
    }
    if (state?.file?.path) {
      await fs.unlink(state.file.path).catch(() => {});
    }
  }
};
