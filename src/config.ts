import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as readline from "readline";

const CONFIG_DIR = path.join(os.homedir(), ".config", "lazy-commit");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export interface Config {
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
  return JSON.parse(raw) as Config;
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

  const apiKey = await prompt(
    `openai api key${existing.apiKey ? " (press enter to keep existing)" : ""}: `,
  );

  const instructions = await prompt(
    `custom instructions${existing.instructions ? " (press enter to keep existing)" : ""}: `,
  );

  const prefix = await prompt(
    `commit prefix e.g. "arii" (optional, press enter to skip): `,
  );

  const config: Config = {
    apiKey: apiKey.trim() || existing.apiKey || "",
    instructions: instructions.trim() || existing.instructions || "",
    prefix: prefix.trim() || existing.prefix || "",
  };

  if (!config.apiKey.startsWith("sk-")) {
    console.error("invalid openai api key.");
    process.exit(1);
  }

  saveConfig(config);

  console.log(`\nconfig saved to ${CONFIG_FILE}`);
}
