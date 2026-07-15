---
title: Wakezilla Documentation
description: Install, operate, secure, and troubleshoot Wakezilla across Linux, macOS, and Windows.
template: splash
hero:
  tagline: Wake a machine when traffic arrives, return the response, and manage its power state after the work is done.
  actions:
    - text: Install Wakezilla
      link: ./getting-started/installation/
      icon: right-arrow
      variant: primary
    - text: How it works
      link: ./getting-started/how-it-works/
      icon: open-book
---

Wakezilla is a Wake-on-LAN and TCP proxy toolkit for machines that do not need to remain active all day. A proxy host receives a connection, wakes the target when needed, and carries the TCP stream in both directions.

## One connection, both directions

When a connection reaches a configured local port, Wakezilla checks the target machine, wakes it when necessary, and waits until the target service is reachable. It then forwards traffic to the target and sends the target's response back to the original client over the same connection.

Every accepted connection refreshes the machine's inactivity timer. If no new connection arrives during the configured period, Wakezilla asks the client service to enter its platform-specific power state.

## Start here

- Follow [Installation](./getting-started/installation/) to install the command-line application.
- Read [Quick Start](./getting-started/quick-start/) to configure your first machine and port.
- Open [How Wakezilla Works](./getting-started/how-it-works/) for the complete request-and-response lifecycle.

## Operate Wakezilla

- Use the [Web Dashboard](./guides/web-dashboard/) to discover and manage machines.
- Pair each target with [Secure Shutdown](./guides/secure-shutdown/) before enabling remote power operations.
- Install [System Services](./guides/system-services/) for boot-time startup.
- Work from the [Terminal UI](./guides/terminal-ui/) or [Desktop Tray](./guides/desktop-tray/).
- Consult the [CLI](./reference/cli/), [Configuration](./reference/configuration/), and [HTTP API](./reference/http-api/) references.

## Deploy safely

Wakezilla authenticates shutdown requests between a paired proxy and client. The proxy dashboard and API still do not provide user authentication or TLS, and legacy clients can accept unsigned shutdown requests until migrated. Read [Security](./reference/security/) before allowing access from another host, and review [Known Limitations](./help/known-limitations/) before choosing custom ports or relying on status and inactivity behavior.

:::caution
Run Wakezilla on a trusted network. Restrict the dashboard, API, client, and forwarding ports with firewall or private-network policy.
:::
