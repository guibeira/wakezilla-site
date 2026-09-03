---
title: Port Forwarding
description: Map a port on the Wakezilla proxy to a service on a target machine.
---

Each port forward maps one TCP port on the proxy host to one TCP port on the target machine.

## Add a forwarding rule

The new-machine form starts with one empty forward. Fill it directly. On a machine detail page, choose **+ Add port** to create a new row.

- **Service Name:** an optional label used in history and the TUI;
- **Local Port:** the port Wakezilla listens on at the proxy host;
- **Target Port:** the service port Wakezilla connects to on the target machine.

For a media server listening on port `8096`, a direct mapping looks like this:

| Local Port | Target Port | Connect to |
| ---: | ---: | --- |
| `8096` | `8096` | `<proxy-ip>:8096` |

The two ports do not have to match. For example, local port `18096` can forward to target port `8096`.

Every local port must be free and unique across all Wakezilla forwards on the proxy host. Port values must be between `1` and `65535`.

## What happens to a connection

When traffic reaches the local port, Wakezilla:

1. refreshes the machine's activity timestamp;
2. probes the configured target service port;
3. sends Wake-on-LAN if that port is unavailable;
4. waits up to 60 seconds for the same target port;
5. connects to the target port;
6. copies data in both directions until the TCP connection closes.

Bidirectional forwarding means the caller receives the target service's response. Wakezilla is not only a wake trigger; it remains between the caller and target for the complete connection.

If the target port does not become reachable within 60 seconds, Wakezilla drops the accepted connection. The caller must reconnect.

:::tip
Allow the selected local port through the proxy host's firewall. Allow the target port between the proxy and target machines, but avoid exposing it more broadly than necessary.
:::

Accepted connections are recorded in the machine's access history. See [Storage and Backups](/docs/reference/storage/#access-history-retention).
