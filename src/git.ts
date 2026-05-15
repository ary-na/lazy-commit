import { execSync } from "child_process";
import chalk from "chalk";

export function getStagedDiff(): string {
  try {
    const diff = execSync("git diff --staged", { encoding: "utf-8" });
    return diff;
  } catch {
    console.error(
      chalk.red("error: not a git repository or git is not installed"),
    );
    process.exit(1);
  }
}
