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
    rl.question(chalk.white("edit: "), (answer) => {
      rl.close();
      resolve(answer.trim() || commitMessage);
    });

    // pre-fill the input with the current commit message
    (rl as any).line = commitMessage;
    (rl as any).cursor = commitMessage.length;
    (rl as any)._refreshLine();
  });
}

export type CommitAction = "commit" | "cancel" | "regenerate" | "edit";

export async function confirmCommit(
  commitMessage: string,
): Promise<CommitAction> {
  console.log(chalk.bold("suggested commit message:\n"));
  console.log(chalk.cyan(`  ${commitMessage}\n`));
  const answer = await prompt(
    chalk.white("use this message? (y)es / (n)o / (r)egenerate / (e)dit: "),
  );

  switch (answer.toLowerCase()) {
    case "y":
      return "commit";
    case "r":
      return "regenerate";
    case "e":
      return "edit";
    default:
      return "cancel";
  }
}
