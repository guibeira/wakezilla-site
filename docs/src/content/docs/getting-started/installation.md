---
title: Installation
description: Install Wakezilla on Windows, Linux, or macOS.
---

Choose the installation method for your operating system, then verify that the `wakezilla` command is available.

## Windows

Open PowerShell and run:

```powershell
irm https://wakezilla.dev/install.ps1 | iex
```

The installer supports x64 Windows, requires `tar` in PowerShell, installs the application under `%LOCALAPPDATA%\Programs\wakezilla\bin`, and adds that directory to your user `PATH`. Open a new terminal after installation.

## Linux and macOS

Run the installation script:

```sh
curl -fsSL https://wakezilla.dev/install.sh | sh
```

The script installs a prebuilt release in `$HOME/.local/bin`. It requires `curl`, `jq`, `tar`, and either `sha256sum` or `shasum`.

### Homebrew

```sh
brew tap guibeira/wakezilla https://github.com/guibeira/wakezilla
brew install wakezilla
```

### Cargo

```sh
cargo install wakezilla
```

## Verify the installation

```sh
wakezilla --version
```

If the command is not found, open a new terminal and confirm that the installation directory is included in your `PATH`.

## Update later

Install the latest available release with:

```sh
wakezilla update
```

Continue to [Quick Start](./quick-start/) to run the proxy and register a machine.
