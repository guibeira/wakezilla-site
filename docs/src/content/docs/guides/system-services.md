---
title: System Services
description: Install and operate Wakezilla at boot with systemd, launchd, or Windows Service Manager.
---

`wakezilla setup` installs either the proxy or client as an operating-system service, writes an OS-standard configuration, starts the service, and checks that its port becomes reachable.

## Install interactively

On Linux or macOS:

```sh
sudo wakezilla setup
```

On Windows, open PowerShell as Administrator:

```powershell
wakezilla setup
```

Choose **Proxy** for the machine that remains available and **Client** for a target that accepts remote power requests. The wizard then asks for the listening port.

## Install without prompts

Provide the mode and port together:

```sh
sudo wakezilla setup --mode proxy --port 3000
sudo wakezilla setup --mode client --port 3001
```

Add `--yes` when automation should overwrite an existing Wakezilla configuration without confirmation:

```sh
sudo wakezilla setup --mode proxy --port 3000 --yes
```

Reconfiguring one mode preserves the other mode's port in `config.toml`.

## What setup installs

| Platform | Manager | Service names |
| --- | --- | --- |
| Linux | systemd | `wakezilla-proxy`, `wakezilla-client` |
| macOS | launchd LaunchDaemon | `dev.wakezilla.proxy`, `dev.wakezilla.client` |
| Windows | Windows Service Manager | `wakezilla-proxy`, `wakezilla-client` |

The service runs a protected copy of the executable and starts with `--no-update-check`. On Windows, setup also creates or updates an inbound TCP firewall rule for the selected port.

## Control a service

Elevated privileges are required:

```sh
sudo wakezilla service status --mode proxy
sudo wakezilla service start --mode proxy
sudo wakezilla service stop --mode proxy
sudo wakezilla service restart --mode proxy
```

Omit `--mode` to select interactively when both services are installed. When only one mode is installed, Wakezilla selects it automatically.

On Windows, run the same commands from an elevated PowerShell without `sudo`.

## Read logs

```sh
sudo wakezilla service logs --mode proxy
sudo wakezilla service logs --mode proxy --follow --lines 100
```

See [Logs](../help/logs/) for platform locations and direct service-manager commands.

## Update a service installation

`wakezilla update` replaces the executable that launched the update command. Service processes use protected executable copies created by `setup`. After updating, rerun setup for each installed mode so its protected copy receives the new version:

```sh
sudo wakezilla setup --mode proxy --port 3000 --yes
sudo wakezilla setup --mode client --port 3001 --yes
```

## Remove services

```sh
sudo wakezilla uninstall
```

On Windows, run `wakezilla uninstall` as Administrator. This removes every installed Wakezilla service and setup-managed firewall rule, while preserving configuration, data, and logs.

## Verification

For a proxy service:

```sh
curl http://127.0.0.1:3000/api/machines
```

For a client service:

```sh
curl http://127.0.0.1:3001/health
```

Do not test the client power endpoint unless you intend to suspend, hibernate, or shut down the host.
