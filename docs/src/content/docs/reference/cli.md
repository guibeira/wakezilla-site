---
title: CLI Reference
description: Commands and options exposed by the Wakezilla executable.
---

Wakezilla provides commands for direct Wake-on-LAN, proxy and client servers, terminal and desktop interfaces, system services, and self-updates.

```sh
wakezilla [--no-update-check] <command>
```

`--no-update-check` disables the startup request that checks whether a newer GitHub release is available. Service installations add this option automatically.

## Commands

| Command | Purpose |
| --- | --- |
| `send` | Send a Wake-on-LAN packet directly |
| `proxy-server` | Start the dashboard, API, TCP forwarders, and inactivity monitor |
| `client-server` | Start the target-side health and remote power endpoint |
| `tui` | Open the terminal interface against a running proxy |
| `tray` | Open the desktop tray or menu-bar controller |
| `setup` | Install a proxy or client as an operating-system service |
| `service` | Start, stop, restart, inspect, or read logs from an installed service |
| `uninstall` | Remove services installed by `setup` |
| `update` | Download and install a release |

## `send`

```sh
wakezilla send <MAC> [options]
```

| Option | Default | Effect |
| --- | ---: | --- |
| `-b, --broadcast <IP>` | `255.255.255.255` | Destination broadcast address |
| `-p, --port <PORT>` | `9` | Wake-on-LAN UDP port |
| `-n, --count <COUNT>` | `3` | Number of magic packets |
| `--check-ip <IP>` | none | Wait for a host after sending the packet |
| `--check-tcp-port <PORT>` | `22` | TCP port used by the optional reachability check |
| `--wait-secs <SECONDS>` | `90` | Maximum time for the optional check |
| `--interval-ms <MS>` | `1000` | Delay between checks |
| `--connect-timeout-ms <MS>` | `700` | Per-attempt TCP connection timeout |

Example:

```sh
wakezilla send AA:BB:CC:DD:EE:FF \
  --broadcast 192.168.1.255 \
  --check-ip 192.168.1.42 \
  --check-tcp-port 22
```

## Server commands

```sh
wakezilla proxy-server
wakezilla client-server
```

The proxy and client use ports `3000` and `3001` by default. Configure different ports through `config.toml` or `WAKEZILLA__SERVER__PROXY_PORT` and `WAKEZILLA__SERVER__CLIENT_PORT`.

:::caution
The current CLI displays `--port` for both server commands, but those arguments are not applied by the command dispatcher. Use the configuration file or environment variables until this limitation is resolved.
:::

## `tui`

```sh
wakezilla tui --api-url http://192.168.1.10:3000
```

`--api-url` defaults to `http://127.0.0.1:3000`. See [Terminal UI](../guides/terminal-ui/).

## `setup`

```sh
wakezilla setup [--mode proxy|client] [--port <PORT>] [--key <KEY>] [-y|--yes]
```

| Option | Effect |
| --- | --- |
| `--mode proxy\|client` | Select the service role without the interactive selector |
| `--port <PORT>` | Set the listener used by the installed service |
| `--key <KEY>` | Configure the client shutdown key; valid only with `--mode client` |
| `-y, --yes` | Skip confirmation when Wakezilla detects an existing configuration or service |

Providing both `--mode` and `--port` skips the interactive selector. Elevated privileges are required.

The proxy dashboard generates the recommended client command after a remote-power machine is registered:

```sh
sudo wakezilla setup --mode client --port 3001 --key <generated-key> --yes
```

The key must be URL-safe base64 that decodes to exactly 32 bytes. Treat the complete command as a secret. On Windows, run it from an Administrator terminal without `sudo`.

See [Secure Shutdown](../guides/secure-shutdown/) for the pairing and rotation workflow.

## `service`

```sh
wakezilla service <start|stop|restart|status|logs> [options]
```

| Option | Applies to | Effect |
| --- | --- | --- |
| `--mode proxy|client` | every action | Select a service without the interactive picker |
| `-f, --follow` | `logs` | Continue streaming new log entries |
| `-n, --lines <COUNT>` | `logs` | Show a number of trailing lines; default `50` |

See [System Services](../guides/system-services/) and [Logs](../help/logs/).

## `update`

```sh
wakezilla update
wakezilla update --version 0.2.11
```

Omit `--version` for the latest release. Version values do not include the leading `v`.

## Built-in help

Use command-specific help as the source of truth for the installed release:

```sh
wakezilla --help
wakezilla service --help
```
