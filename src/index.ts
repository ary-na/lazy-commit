#!/usr/bin/env node

import { execSync } from "child_process";
import chalk from "chalk";
import { loadConfig, runConfigSetup } from "./config.js";
import { getStagedDiff } from "./git.js";
import { confirmCommit, editMessage } from "./prompt.js";
import { generateCommitMessage } from "./providers/index.js";

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "config") {
    await runConfigSetup();
    process.exit(0);
  }

  const dryRun = args.includes("--dry-run");

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

  let commitMessage = await generateCommitMessage(diff, config);

  if (dryRun) {
    console.log(chalk.bold("suggested commit message:\n"));
    console.log(chalk.cyan(`  ${commitMessage}\n`));
    console.log(chalk.yellow("dry run — nothing was committed."));
    process.exit(0);
  }

  while (true) {
    const action = await confirmCommit(commitMessage);

    if (action === "commit") {
      execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, {
        stdio: "inherit",
      });
      console.log(chalk.green("\ncommitted!"));
      break;
    } else if (action === "regenerate") {
      console.log(chalk.dim("\nregenerating...\n"));
      commitMessage = await generateCommitMessage(diff, config);
    } else if (action === "edit") {
      console.log(chalk.dim("\ncurrent message: ") + chalk.cyan(commitMessage));
      commitMessage = await editMessage(commitMessage);
      console.log(
        chalk.dim("\nupdated message: ") + chalk.cyan(commitMessage) + "\n",
      );
    } else {
      console.log(chalk.red("\ncommit cancelled."));
      break;
    }
  }
}

main().catch((err) => {
  console.error(chalk.red(`error: ${err.message}`));
  process.exit(1);
});
