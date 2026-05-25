import Groq from "groq-sdk";
import { Config } from "../config.js";

export async function generateWithGroq(
  diff: string,
  systemPrompt: string,
  config: Config,
): Promise<string> {
  const client = new Groq({ apiKey: config.apiKey });
  const response = await client.chat.completions.create({
    model: "llama3-8b-8192",
    max_tokens: 256,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate a commit message for this diff:\n\n${diff}`,
      },
    ],
  });
  if (!response.choices.length) throw new Error("unexpected response from groq");
  const content = response.choices[0].message.content;
  if (!content) throw new Error("unexpected response from groq");
  return content.trim();
}
