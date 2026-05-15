#!/usr/bin/env node

import { execSync } from "child_process";
import chalk from "chalk";
import { loadConfig, runConfigSetup } from "./config.js";
import { getStagedDiff } from "./git.js";
import { confirmCommit } from "./prompt.js";
import { generateCommitMessage } from "./providers/index.js";

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "config") {
    await runConfigSetup();
    process.exit(0);
  }

  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(
      chalk.yellow(
        "no staged changes found. use git add to stage your changes.",
      ),
    );
    process.exit(0);
  }

  const config = loadConfig();
  console.log(
    chalk.dim(`generating commit message using ${config.provider}...\n`),
  );

  const commitMessage = await generateCommitMessage(diff, config);
  const accepted = await confirmCommit(commitMessage);

  if (accepted) {
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
    console.log(chalk.green("\ncommitted!"));
  } else {
    console.log(chalk.red("\ncommit cancelled."));
  }
}

main().catch((err) => {
  console.error(chalk.red(`error: ${err.message}`));
  process.exit(1);
});
