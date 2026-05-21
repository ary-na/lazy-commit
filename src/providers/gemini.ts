import { GoogleGenerativeAI } from "@google/generative-ai";
import { Config } from "../config.js";

export async function generateWithGemini(
  diff: string,
  systemPrompt: string,
  config: Config,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(
    `Generate a commit message for this diff:\n\n${diff}`,
  );
  const content = result.response.text();
  if (!content) throw new Error("unexpected response from gemini");
  return content.trim();
}
