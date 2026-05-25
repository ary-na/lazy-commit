import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as readline from "readline";

const CONFIG_DIR = path.join(os.homedir(), ".config", "lazy-commit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export type Provider = "openai" | "anthropic" | "groq" | "gemini";

export interface Config {
  provider: Provider;
  apiKey: string;
  instructions?: string;
  prefix?: string;
}

export function configExists(): boolean {
  return fs.existsSync(CONFIG_FILE);
}

export function loadConfig(): Config {
  if (!configExists()) {
    console.error("no config found. run: lazy-commit config");
    process.exit(1);
  }
  const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Config;
  } catch {
    console.error("config file is corrupted. run: lazy-commit config");
    process.exit(1);
  }
}

export function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
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

export async function runConfigSetup(): Promise<void> {
  console.log("lazy-commit config setup\n");

  const existing = configExists() ? loadConfig() : ({} as Partial<Config>);

  const providerAnswer = await prompt(
    `ai provider - openai, anthropic, groq, gemini${existing.provider ? ` (current: ${existing.provider})` : ""}: `,
  );

  const provider = (providerAnswer.trim() ||
    existing.provider ||
    "openai") as Provider;

  if (!["openai", "anthropic", "groq", "gemini"].includes(provider)) {
    console.error(
      "invalid provider. choose openai, anthropic, groq, or gemini.",
    );
    process.exit(1);
  }

  const apiKey = await prompt(
    `api key for ${provider}${existing.apiKey ? " (press enter to keep existing)" : ""}: `,
  );

  const instructions = await prompt(
    `custom instructions e.g. "always use feat:, fix:, chore:"${existing.instructions ? " (press enter to keep existing)" : ""}: `,
  );

  const prefix = await prompt(
    `commit prefix e.g. "arii"${existing.prefix ? ` (current: ${existing.prefix})` : ""} (optional, press enter to skip/clear): `,
  );

  const config: Config = {
    provider,
    apiKey: apiKey.trim() || existing.apiKey || "",
    instructions: instructions.trim() || existing.instructions || "",
    prefix: prefix.trim(),
  };

  if (!config.apiKey) {
    console.error("api key is required.");
    process.exit(1);
  }

  saveConfig(config);
  console.log(`\nconfig saved to ${CONFIG_FILE}`);
}
