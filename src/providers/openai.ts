import OpenAI from "openai";
import { Config } from "../config.js";

export async function generateWithOpenAI(
  diff: string,
  systemPrompt: string,
  config: Config,
): Promise<string> {
  const client = new OpenAI({ apiKey: config.apiKey });
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 256,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Generate a commit message for this diff:\n\n${diff}`,
      },
    ],
  });
  if (!response.choices.length) throw new Error("unexpected response from openai");
  const content = response.choices[0].message.content;
  if (!content) throw new Error("unexpected response from openai");
  return content.trim();
}
