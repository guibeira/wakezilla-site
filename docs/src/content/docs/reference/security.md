---
title: Security
description: Network boundaries and access controls required for a safe Wakezilla deployment.
---

Wakezilla is designed for trusted networks. It does not provide user accounts, API tokens, TLS termination, or authorization rules.

## Exposed listeners

The proxy and client bind to all network interfaces by default.

| Listener | Default | Sensitive capabilities |
| --- | ---: | --- |
| Proxy dashboard and API | TCP `3000` | View and modify machines, scan the LAN, wake machines, delete records, request remote power |
| Client server | TCP `3001` | Health check and unauthenticated remote power request |
| Port forwards | User-defined TCP ports | Bidirectional access to services on target machines |

The proxy applies permissive CORS headers. A browser page from another origin can attempt API requests whenever it can reach the proxy.

## Required controls

1. Place proxy and target machines on a trusted LAN or private VPN.
2. Restrict TCP `3000` to administrators and trusted application clients.
3. Restrict TCP `3001` on each target so only the proxy host can reach it.
4. Restrict each local forwarding port to the clients that need the target service.
5. Do not publish the dashboard or client directly to the public internet.

If remote browser access is required, put Wakezilla behind a reverse proxy or private access gateway that provides TLS and authentication. Keep direct access to the original Wakezilla port blocked from untrusted networks.

## Remote power endpoint

Any client that can send `POST /machines/turn-off` to the target-side server can schedule the platform power action. There is no confirmation or application-level identity check.

Firewall policy is therefore part of the security model, not an optional hardening step.

## System-service installation

`wakezilla setup` requires elevated privileges because it installs protected executable copies and service-manager definitions. On Windows it also creates an inbound firewall rule for the configured proxy or client port.

Review that rule after installation and narrow its remote address scope when the default is broader than your network policy permits.

## Data protection

`machines.json` contains internal IP addresses, MAC addresses, service ports, and machine descriptions. `access_history.json` reveals connection timing. Restrict file access and protect backups accordingly.

## Current limitations

Wakezilla does not currently provide:

- authentication or authorization;
- encrypted HTTP connections;
- request rate limits for API operations;
- an audit log of dashboard users;
- per-machine secrets for remote power requests.

Track deployment constraints in [Known Limitations](../help/known-limitations/).
