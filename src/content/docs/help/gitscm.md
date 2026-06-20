---
title: "Guide for installing Git SCM"
---

1. Go to <https://git-scm.com/>
2. Download and install Git for your operating system using the steps below.

Follow the section for your operating system, then continue with
[After installing (all platforms)](#after-installing-all-platforms).

## Windows (PC)

1. Run the [installer](https://git-scm.com/download/win) and go through the installation wizard.

   <img src="/26SU-ASIAAM-191A/help/media/gitInstall.png" alt="Git for Windows installer">

2. Launch the command prompt when done by pressing the `Windows` key and typing `cmd`.
3. In the command prompt, run the command to test your installation:

   ```bash
   git --version
   ```

   <img src="/26SU-ASIAAM-191A/help/media/image5.png" alt="git --version output on Windows">

   - If it is working, continue to [After installing](#after-installing-all-platforms).
   - If it is not working, send an email or post on the GitHub discussion board.

## macOS

:::note
Make sure you have [Homebrew installed](https://brew.sh/). If you can run the command `brew`, then you are good to go.
:::

1. Open Launchpad and search for **Terminal**:

   <img src="/26SU-ASIAAM-191A/help/media/gitcsm_mac_terminal.jpg" alt="Searching for Terminal on macOS">

2. In the terminal, type `brew install git`:

   <img src="/26SU-ASIAAM-191A/help/media/terminalup.png" alt="Running brew install git">

3. In the terminal, run the command to test your installation:

   ```bash
   git --version
   ```

   <img src="/26SU-ASIAAM-191A/help/media/gitversion_mac.jpg" alt="git --version output on macOS">

   - If it is working, continue to [After installing](#after-installing-all-platforms).
   - If it is not working, send an email or post on the GitHub discussion board.

## After installing (all platforms)

1. Set your identity to your GitHub username for Git by running:

   ```bash
   git config --global user.name "YOUR_GITHUB_USERNAME"
   ```

   :::caution
   Remember to change `"YOUR_GITHUB_USERNAME"` to your actual GitHub username, and include the double quotes `" "`.
   :::

2. Set your email to the email you signed up with on GitHub by running:

   ```bash
   git config --global user.email YOUR@EMAIL.COM
   ```

   :::caution
   Remember to change `YOUR@EMAIL.COM` to your actual GitHub email.
   :::

3. Once finished, run the following to check your email and username:

   ```bash
   git config --list
   ```

4. If you had any issues, please check this documentation for more details or reach out for help.
5. Now you are ready to [clone a repository](git_cloning.md) in [VS Code](https://code.visualstudio.com/)!
