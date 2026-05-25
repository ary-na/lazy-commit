#!/usr/bin/env node

import { execFileSync } from "child_process";
import chalk from "chalk";
import ora from "ora";
import { loadConfig, runConfigSetup } from "./config.js";
import { getStagedDiff } from "./git.js";
import { confirmCommit, editMessage } from "./prompt.js";
import { generateCommitMessage } from "./providers/index.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");

function parseDiffStats(diff: string) {
  const files = (diff.match(/^diff --git/gm) || []).length;
  const additions = (diff.match(/^\+(?!\+\+)/gm) || []).length;
  const deletions = (diff.match(/^-(?!--)/gm) || []).length;
  return { files, additions, deletions };
}

async function generate(diff: string, config: ReturnType<typeof loadConfig>) {
  const spinner = ora(chalk.dim(`generating with ${config.provider}...`)).start();
  try {
    const msg = await generateCommitMessage(diff, config);
    spinner.succeed(chalk.dim(`generated with ${config.provider}`));
    return msg;
  } catch (err) {
    spinner.fail(chalk.dim(`failed to generate with ${config.provider}`));
    throw err;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "config") {
    await runConfigSetup();
    process.exit(0);
  }

  if (args[0] === "--version" || args[0] === "-v") {
    console.log(version);
    process.exit(0);
  }

  const dryRun = args.includes("--dry-run");
  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(chalk.yellow("no staged changes found. use git add to stage your changes."));
    process.exit(0);
  }

  const stats = parseDiffStats(diff);
  const config = loadConfig();
  let commitMessage = await generate(diff, config);

  if (dryRun) {
    console.log(chalk.cyan(`\n  ${commitMessage}`));
    console.log(chalk.dim(`\n  ${stats.files} ${stats.files === 1 ? "file" : "files"}  ${chalk.green(`+${stats.additions}`)}  ${chalk.red(`-${stats.deletions}`)}`));
    console.log(chalk.yellow("\n  dry run — nothing was committed."));
    process.exit(0);
  }

  while (true) {
    const action = await confirmCommit(commitMessage, stats);

    if (action === "commit") {
      execFileSync("git", ["commit", "-m", commitMessage], { stdio: "inherit" });
      console.log(chalk.green("\n  ✔ committed"));
      break;
    } else if (action === "regenerate") {
      commitMessage = await generate(diff, config);
    } else if (action === "edit") {
      commitMessage = await editMessage(commitMessage);
    } else {
      console.log(chalk.dim("\n  cancelled."));
      break;
    }
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(chalk.red(`\n  error: ${message}`));
  process.exit(1);
});
