import Anthropic from "@anthropic-ai/sdk";
import { Config } from "../config.js";

export async function generateWithAnthropic(
  diff: string,
  systemPrompt: string,
  config: Config,
): Promise<string> {
  const client = new Anthropic({ apiKey: config.apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Generate a commit message for this diff:\n\n${diff}`,
      },
    ],
  });
  const block = response.content[0];
  if (block.type !== "text")
    throw new Error("unexpected response from anthropic");
  return block.text.trim();
}
