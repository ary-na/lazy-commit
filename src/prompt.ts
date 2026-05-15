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

export async function confirmCommit(commitMessage: string): Promise<boolean> {
  console.log(chalk.bold("suggested commit message:\n"));
  console.log(chalk.cyan(`  ${commitMessage}\n`));
  const answer = await prompt(chalk.white("use this message? (y/n): "));
  return answer.toLowerCase() === "y";
}
