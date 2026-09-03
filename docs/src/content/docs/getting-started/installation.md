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

The installer supports x64 Windows, requires `tar` in PowerShell, validates the release against `SHA256SUMS`, installs under `%LOCALAPPDATA%\Programs\wakezilla\bin`, registers an uninstaller, and adds the directory to your user `PATH`. Open a new terminal after installation.

Pin a version or choose a different directory:

```powershell
iex "& { $(irm https://wakezilla.dev/install.ps1) } -Version 0.2.11"
iex "& { $(irm https://wakezilla.dev/install.ps1) } -InstallDir $env:USERPROFILE\bin"
```

## Linux and macOS

Run the installation script:

```sh
curl -fsSL https://wakezilla.dev/install.sh | sh
```

The script detects x86_64 or ARM64 releases for Linux GNU, Linux musl, and macOS. It installs in `$HOME/.local/bin`, validates `SHA256SUMS`, and requires `curl`, `jq`, `tar`, and either `sha256sum` or `shasum`.

Pin a version or choose another destination:

```sh
curl -fsSL https://wakezilla.dev/install.sh | sh -s -- 0.2.11
curl -fsSL https://wakezilla.dev/install.sh | BIN_DIR=/usr/local/bin sh
```

### Homebrew

```sh
brew tap guibeira/wakezilla https://github.com/guibeira/wakezilla
brew install wakezilla
```

### Cargo

```sh
cargo install wakezilla
```

Cargo installation builds the command-line application from source. Desktop tray support depends on platform libraries and release features; use the release installer when you want the packaged desktop integration.

### Build from source

```sh
git clone https://github.com/guibeira/wakezilla.git
cd wakezilla
cargo build --release --bin wakezilla
```

The executable is written to `target/release/wakezilla`.

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

Install a specific version with `wakezilla update --version 0.2.11`. See [Updates and Uninstall](/docs/help/updates-uninstall/) before updating a system-service deployment.

Continue to [Quick Start](/docs/getting-started/quick-start/) to run the proxy and register a machine. For unattended startup, follow [System Services](/docs/guides/system-services/) after verifying the foreground flow.
