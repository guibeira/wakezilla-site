---
title: Logs
description: Find foreground and system-service logs on every supported platform.
---

Foreground Wakezilla commands write structured logs to the terminal. The default level is `info`; use the standard `RUST_LOG` variable for more detail.

```sh
RUST_LOG=debug wakezilla --no-update-check proxy-server
```

## Installed services

Use Wakezilla's cross-platform command first:

```sh
wakezilla service logs --mode proxy
wakezilla service logs --mode client --follow --lines 100
```

Run it with `sudo` on Linux or macOS and from an elevated PowerShell on Windows.

| Platform | Source or location |
| --- | --- |
| Linux | systemd journal for `wakezilla-proxy` or `wakezilla-client` |
| macOS | `/Library/Logs/wakezilla/dev.wakezilla.<mode>.out.log` and `.err.log` |
| Windows | `%ProgramData%\wakezilla\wakezilla-<mode>.log` |

Linux example:

```sh
sudo journalctl -u wakezilla-proxy -n 100 -f
```

## Useful events

Proxy logs report:

- configuration and storage paths at startup;
- bound dashboard and forwarding ports;
- accepted forwarding connections;
- Wake-on-LAN packets and reachability checks;
- access-history persistence;
- inactivity-triggered remote power requests;
- port conflicts, timeouts, and invalid machine data.

Client logs report health-server startup and the platform power command result.

## Protect log data

Logs can contain internal IP addresses, MAC addresses, service ports, and machine names. Redact this data before sharing logs outside your organization.
