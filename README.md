# lazy-commit 🦥

> AI-powered git commit messages from your staged diff — in one command.

[![npm version](https://img.shields.io/npm/v/@ariian/lazy-commit?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/lazy-commit)
[![npm downloads](https://img.shields.io/npm/dm/@ariian/lazy-commit?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/lazy-commit)
[![license](https://img.shields.io/npm/l/@ariian/lazy-commit?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@ariian/lazy-commit?color=black&style=flat-square)](https://nodejs.org)

---

## what it does

`lazy-commit` reads your staged git diff, sends it to an AI model, and suggests a commit message in [conventional commits](https://www.conventionalcommits.org) format. You approve it with `y` and it commits — or decline with `n` to cancel.

---

## install

\`\`\`bash
npm install -g @ariian/lazy-commit
\`\`\`

---

## setup

Run the config setup once to save your API key and preferences:

\`\`\`bash
lazy-commit config
\`\`\`

You'll be prompted for:

| field | description |
|---|---|
| `apiKey` | your OpenAI API key (`sk-...`) |
| `instructions` | custom instructions e.g. `always use feat:, fix:, chore:` |
| `prefix` | optional prefix for every message e.g. your name or team tag |

Config is saved to `~/.config/lazy-commit/config.json`.

---

## usage

Stage your changes and run:

\`\`\`bash
git add .
lazy-commit
\`\`\`

---

## example

\`\`\`
$ git add src/auth.ts
$ lazy-commit

generating commit message...

  suggested commit message:

  fix(auth): handle token expiry edge case in refresh flow

use this message? (y/n): y

[main 3f2a1c4] fix(auth): handle token expiry edge case in refresh flow
 1 file changed, 12 insertions(+), 3 deletions(-)

committed!
\`\`\`

---

## config file

Your config lives at `~/.config/lazy-commit/config.json`:

\`\`\`json
{
  "apiKey": "sk-...",
  "instructions": "always use conventional commits format: feat:, fix:, chore:, docs:, refactor:",
  "prefix": "arii"
}
\`\`\`

To update any setting just run `lazy-commit config` again.

---

## requirements

- node 18+
- an [OpenAI API key](https://platform.openai.com/api-keys)
- a git repository with staged changes

---

## contributing

Pull requests are welcome! Here's how to get started:

\`\`\`bash
git clone https://github.com/ary-na/lazy-commit
cd lazy-commit
npm install
\`\`\`

To test locally against a real repo:

\`\`\`bash
cd /path/to/your/repo
git add .
npx tsx /path/to/lazy-commit/src/index.ts
\`\`\`

To build:

\`\`\`bash
npm run build
\`\`\`

---

## license

mit © [ariian](https://github.com/ary-na)
