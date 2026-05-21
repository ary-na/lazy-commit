import { Config } from "../config.js";
import { generateWithOpenAI } from "./openai.js";
import { generateWithAnthropic } from "./anthropic.js";
import { generateWithGroq } from "./groq.js";
import { generateWithGemini } from "./gemini.js";

export async function generateCommitMessage(diff: string, config: Config): Promise<string> {
  const prefixNote = config.prefix
    ? `prefix every commit message with "${config.prefix}:"`
    : "";
  const instructions = [config.instructions, prefixNote].filter(Boolean).join(". ");
  const systemPrompt = `You are a git commit message generator. Generate concise commit messages in conventional commits format.${instructions ? ` ${instructions}.` : ""} Reply with only the commit message, nothing else.`;

  switch (config.provider) {
    case "anthropic":
      return generateWithAnthropic(diff, systemPrompt, config);
    case "groq":
      return generateWithGroq(diff, systemPrompt, config);
    case "gemini":
      return generateWithGemini(diff, systemPrompt, config);
    default:
      return generateWithOpenAI(diff, systemPrompt, config);
  }
}
