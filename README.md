# 🦥 lazy-commit

> Stop writing commit messages. Let AI do it for you.

Generate clean, conventional git commit messages from your staged diff — instantly, in one command.

[![npm version](https://img.shields.io/npm/v/@ariian/lazy-commit?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/lazy-commit)
[![npm downloads](https://img.shields.io/npm/dm/@ariian/lazy-commit?color=black&style=flat-square)](https://www.npmjs.com/package/@ariian/lazy-commit)
[![license](https://img.shields.io/npm/l/@ariian/lazy-commit?color=black&style=flat-square)](./LICENSE)
[![node](https://img.shields.io/node/v/@ariian/lazy-commit?color=black&style=flat-square)](https://nodejs.org)

---

## why lazy-commit?

Writing commit messages is boring. So this tool automates it properly.

- AI-generated commit messages from your real diff
- conventional commits format by default
- one-command workflow
- custom instructions support
- always asks before committing — safe by design

---

## install

```bash
npm install -g @ariian/lazy-commit
```

---

## setup

Run the config wizard once:

```bash
lazy-commit config
```

You'll be prompted for:

| field | description |
|---|---|
| `apiKey` | your OpenAI API key (`sk-...`) |
| `instructions` | custom commit rules (optional) |
| `prefix` | optional tag added to every commit |

Config is stored at `~/.config/lazy-commit/config.json`.

---

## usage

Stage your changes and run:

```bash
git add .
lazy-commit
```

Then choose:

- `y` → accept and commit
- `n` → cancel

---

## example

```
$ git add src/auth.ts
$ lazy-commit

generating commit message...

  suggested commit message:

  fix(auth): handle token expiry edge case in refresh flow

use this message? (y/n): y

[main 3f2a1c4] fix(auth): handle token expiry edge case in refresh flow
 1 file changed, 12 insertions(+), 3 deletions(-)

committed!
```

---

## config file

Your config lives at `~/.config/lazy-commit/config.json`:

```json
{
  "apiKey": "sk-...",
  "instructions": "always use conventional commits: feat, fix, chore, docs, refactor. keep messages short and clear.",
  "prefix": "arii"
}
```

To update any setting, run `lazy-commit config` again.

---

## requirements

- node 18+
- a git repository with staged changes
- an [OpenAI API key](https://platform.openai.com/api-keys)

---

## development

```bash
git clone https://github.com/ary-na/lazy-commit
cd lazy-commit
npm install
```

test locally against a real repo:

```bash
cd /path/to/your/repo
git add .
npx tsx /path/to/lazy-commit/src/index.ts
```

build:

```bash
npm run build
```

---

## license

mit © [ariian](https://github.com/ary-na)
