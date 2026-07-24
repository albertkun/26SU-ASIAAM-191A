---
title: "Coding Together"
---

### Requirements:
- [Committing code to GitHub in VS Code](../git_commit/)

When you're working on a group project, more than one person is touching the same code. This guide covers the one-time safety net you should set up, the rhythm you should follow every time you work, and the three ways groups in this class actually work together.

You can also check out the [slides on Coding Together](/26SU-ASIAAM-191A/help/git_collaboration.pdf) for a visual walkthrough of these same steps.

## One-time setup: avoid most merge conflicts before they happen

Open a terminal in VS Code: click the `...` menu in the top toolbar, then **Terminal** → **New Terminal** (or press `Ctrl+Shift+` ` `).

<img src="/26SU-ASIAAM-191A/help/media/coding_together_terminal.png" alt="Opening a new terminal from the ... menu in VS Code">

A terminal prompt will open at the bottom of the window:

<img src="/26SU-ASIAAM-191A/help/media/coding_together_terminal_2.png" alt="An empty VS Code terminal prompt">

Run this once in that terminal:

```bash
git config --global pull.ff only
```

This tells git not to try to automatically merge your local copy with the GitHub copy when they've both changed. Instead of dropping you into a merge conflict, it will stop with a message like `fatal: Not possible to fast-forward, aborting.` That error is expected, just reach out if you can't continue.

## Every time you work

1. `git pull` (before you start)
2. do your work
3. `git add .` / `git commit -m "what you changed"` / `git push` (before you stop)

Most conflicts come from starting work on a stale copy, so the `pull` at the beginning does most of the work here. Editing a file directly on github.com and then also editing it locally is the most common way to end up diverged — try to avoid it.

## Three ways to work together

There isn't one "right" way to collaborate - pick whichever fits how your group is meeting.

### 1. Pair Coding

Get on a Zoom/Discord call and screen share, with only **one person** editing at a time.

- **Driver**: the person typing/coding
- **Navigator**: the person looking over their shoulder, catching bugs, thinking one step ahead

Since only one person is ever pushing changes, this avoids merge conflicts entirely. Switch who's driving every so often so everyone gets practice.

### 2. Live Share (edit together, live)

Install the [Live Share extension](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) in VS Code and invite your partners into the file you're editing. Everyone can see and edit the same file in real time, with each person's cursor shown in a different color.

Like pair coding, only whoever the "host" is needs to commit and push at the end of the session, so this also avoids merge conflicts.

You can follow the [Live Share Quickstart](../live_share/) guide for more details on how to set it up.

### 3. Commit separately

Each person works on their own copy and commits/pushes independently. This is the most flexible option (everyone can work whenever they want), but it's also the one place merge conflicts can show up, since two people may edit the same file before either one has pulled the other's changes.

If you go this route:

- Follow the [pull → work → push](#every-time-you-work) rhythm above every single time, even for small changes.
- Try to work on different files or different parts of a file when possible.
- If `git pull` errors out, don't guess — screenshot it and get help (Discord, email, or office hours). It's usually a two-minute fix.

:::tip
Not sure which method to use? Pair Coding or Live Share are the safest choices if you're short on time and want to avoid conflicts altogether. Save "commit separately" for when your group is comfortable with git or is working on clearly separate files.
:::
