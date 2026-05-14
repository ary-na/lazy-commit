#!/usr/bin/env node

import OpenAI from "openai";
import { execSync } from "child_process";
import * as readline from "readline";
import { loadConfig, runConfigSetup } from "./config.js";

function getStagedDiff(): string {
  try {
    const diff = execSync("git diff --staged", { encoding: "utf-8" });
    return diff;
  } catch {
    console.error("error: not a git repository or git is not installed");
    process.exit(1);
  }
}

async function generateCommitMessage(diff: string): Promise<string> {
  const config = loadConfig();

  const client = new OpenAI({ apiKey: config.apiKey });

  const prefixNote = config.prefix
    ? `prefix every commit message with "${config.prefix}:"`
    : "";
  const instructions = [config.instructions, prefixNote]
    .filter(Boolean)
    .join(". ");

  const systemPrompt = `You are a git commit message generator. Generate concise commit messages in conventional commits format.${instructions ? ` ${instructions}.` : ""} Reply with only the commit message, nothing else.`;

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

  const content = response.choices[0].message.content;
  if (!content) throw new Error("unexpected response from api");
  return content.trim();
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "config") {
    await runConfigSetup();
    process.exit(0);
  }

  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log("no staged changes found. use git add to stage your changes.");
    process.exit(0);
  }

  console.log("generating commit message...\n");
  const commitMessage = await generateCommitMessage(diff);

  console.log(`suggested commit message:\n\n  ${commitMessage}\n`);

  const answer = await prompt("use this message? (y/n): ");

  if (answer.toLowerCase() === "y") {
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
    console.log("\ncommitted!");
  } else {
    console.log("commit cancelled.");
  }
}

main().catch(console.error);
