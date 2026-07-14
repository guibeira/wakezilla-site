---
title: Port Forwarding
description: Map a port on the Wakezilla proxy to a service on a target machine.
---

Each port forward maps one TCP port on the proxy host to one TCP port on the target machine.

## Add a forwarding rule

Open a machine in the web interface, select **+ Add port**, and fill in:

- **Local Port:** the port Wakezilla listens on at the proxy host;
- **Target Port:** the service port Wakezilla connects to on the target machine.

For a media server listening on port `8096`, a direct mapping looks like this:

| Local Port | Target Port | Connect to |
| ---: | ---: | --- |
| `8096` | `8096` | `<proxy-ip>:8096` |

The two ports do not have to match. For example, local port `18096` can forward to target port `8096`.

## What happens to a connection

When traffic reaches the local port, Wakezilla:

1. refreshes the machine's activity timestamp;
2. wakes the machine if it is offline;
3. waits until the target becomes reachable;
4. connects to the target port;
5. copies data in both directions until the TCP connection closes.

Bidirectional forwarding means the caller receives the target service's response. Wakezilla is not only a wake trigger; it remains between the caller and target for the complete connection.

:::tip
Allow the selected local port through the proxy host's firewall. Allow the target port between the proxy and target machines, but avoid exposing it more broadly than necessary.
:::
