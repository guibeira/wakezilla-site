---
title: Terminal UI
description: Monitor and control registered machines without a browser.
---

The terminal UI, or TUI, uses the proxy HTTP API. Start the proxy first, then connect the TUI to it.

```sh
wakezilla tui
```

The default API URL is `http://127.0.0.1:3000`. For a remote proxy:

```sh
wakezilla tui --api-url http://192.168.1.10:3000
```

## Layout

The machine list shows every registered machine with an **ON** or **OFF** indicator. The detail pane shows the selected machine's address, remote power settings, forwarded services, access totals, and recent activity.

The status indicator has the same semantics as the dashboard: it checks the target-side Wakezilla client, not every service on the machine.

## Keyboard controls

| Key | Action |
| --- | --- |
| `j` or `↓` | Select the next machine |
| `k` or `↑` | Select the previous machine |
| `r` | Refresh machines, status, and selected-machine history |
| `w` | Send Wake-on-LAN to the selected machine |
| `t` | Request the selected machine's remote power action |
| `d` | Open delete confirmation |
| `y` | Confirm deletion while the dialog is open |
| any other key | Cancel delete confirmation |
| `q`, `Esc`, or `Ctrl+C` | Exit |

## Security

The TUI does not add authentication. Anyone who can reach the proxy API can perform the same operations. Use a private network, VPN, or authenticated gateway when running it from another host.

Secure client pairing is managed in the web dashboard. The TUI does not display setup commands or verification state. Its `t` action asks the proxy to send the request; a pending, unreachable, or mismatched client can reject or fail that request. Complete [Secure Shutdown](/docs/guides/secure-shutdown/) in the dashboard first.

## Troubleshooting

If the TUI cannot load machines, verify the base URL directly:

```sh
curl http://192.168.1.10:3000/api/machines
```

If a powered-on machine appears off, verify its client endpoint and turn-off port. See [HTTP API](/docs/reference/http-api/#online-status-semantics).
