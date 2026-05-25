import * as readline from "readline";
import chalk from "chalk";

export function prompt(question: string): Promise<string> {
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

export async function editMessage(commitMessage: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.dim("\n  edit › "), (answer) => {
      rl.close();
      resolve(answer.trim() || commitMessage);
    });

    // pre-fill the input with the current commit message (uses Node.js internals)
    if (typeof (rl as any)._refreshLine === "function") {
      (rl as any).line = commitMessage;
      (rl as any).cursor = commitMessage.length;
      (rl as any)._refreshLine();
    }
  });
}

export type CommitAction = "commit" | "cancel" | "regenerate" | "edit";

export async function confirmCommit(
  commitMessage: string,
  stats?: { files: number; additions: number; deletions: number },
): Promise<CommitAction> {
  console.log(chalk.bold.white(`\n  ${commitMessage}`));

  if (stats) {
    console.log(
      chalk.dim(`  ${stats.files} ${stats.files === 1 ? "file" : "files"}  `) +
      chalk.green(`+${stats.additions}`) +
      chalk.dim("  ") +
      chalk.red(`-${stats.deletions}`),
    );
  }

  console.log(
    chalk.dim("\n  [y] commit   [e] edit   [r] regenerate   [n] cancel"),
  );

  const answer = await prompt(chalk.dim("  › "));

  switch (answer.trim().toLowerCase()) {
    case "y":
    case "yes":
      return "commit";
    case "r":
    case "regenerate":
      return "regenerate";
    case "e":
    case "edit":
      return "edit";
    default:
      return "cancel";
  }
}
