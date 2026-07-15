---
title: Updates and Uninstall
description: Upgrade the Wakezilla executable and remove its system services safely.
---

## Check for updates

Most interactive commands check GitHub Releases at startup and print a warning when a newer version exists. Disable that request for offline or scripted use:

```sh
wakezilla --no-update-check proxy-server
```

Services installed by `wakezilla setup` disable the automatic check.

## Install the latest release

```sh
wakezilla update
```

The updater downloads the archive and `SHA256SUMS`, verifies the selected asset, extracts it to a temporary directory, and replaces the executable that started the command.

If that executable is in a protected directory such as `/usr/local/bin`, run the update with suitable privileges.

## Install a specific release

```sh
wakezilla update --version 0.2.11
```

Do not include the leading `v`.

## Refresh system-service copies

System services run protected copies created by setup. After updating the command-line executable, rerun setup for each installed service:

```sh
sudo wakezilla setup --mode proxy --port 3000 --yes
sudo wakezilla setup --mode client --port 3001 --yes
```

Use an elevated PowerShell without `sudo` on Windows.

## Remove system services

```sh
sudo wakezilla uninstall
```

This removes both proxy and client services when present. On Windows it also removes the inbound firewall rules created by setup.

The command intentionally preserves:

- `config.toml`;
- `machines.json`;
- `access_history.json`;
- service log files;
- the user-installed Wakezilla executable.

See [Storage and Backups](../reference/storage/) before deleting retained data.

## Remove the executable

Use the reverse of the installation method:

- installation script: remove the binary from `$HOME/.local/bin` or the chosen `BIN_DIR`;
- Homebrew: `brew uninstall wakezilla`;
- Cargo: `cargo uninstall wakezilla`;
- Windows installer: use **Installed apps** or its registered uninstaller.

Run `wakezilla uninstall` first whenever system services are still installed.
