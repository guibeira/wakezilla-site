---
title: Security
description: Network boundaries and access controls required for a safe Wakezilla deployment.
---

Wakezilla is designed for trusted networks. The proxy dashboard and API do not provide user accounts, API tokens, TLS termination, or authorization rules. A configured target client separately authenticates secure health and shutdown requests with a per-machine shared key.

## Exposed listeners

The proxy and client bind to all network interfaces by default.

| Listener | Default | Sensitive capabilities |
| --- | ---: | --- |
| Proxy dashboard and API | TCP `3000` | View and modify machines, scan the LAN, wake machines, delete records, request remote power |
| Client server | TCP `3001` | Public health check plus HMAC-authenticated secure health and remote power requests; legacy clients may still accept unsigned shutdown requests |
| Port forwards | User-defined TCP ports | Bidirectional access to services on target machines |

The proxy applies permissive CORS headers. A browser page from another origin can attempt API requests whenever it can reach the proxy.

## Required controls

1. Place proxy and target machines on a trusted LAN or private VPN.
2. Restrict TCP `3000` to administrators and trusted application clients.
3. Restrict TCP `3001` on each target so only the proxy host can reach it.
4. Restrict each local forwarding port to the clients that need the target service.
5. Do not publish the dashboard or client directly to the public internet.

If remote browser access is required, put Wakezilla behind a reverse proxy or private access gateway that provides TLS and authentication. Keep direct access to the original Wakezilla port blocked from untrusted networks.

## Secure remote power

For each newly registered remote-power machine, the proxy generates a unique random 256-bit key. The dashboard places that key in the target's `wakezilla setup --mode client --key ...` command. Once paired, the proxy signs the method, path, timestamp, and nonce of each secure health and shutdown request with HMAC-SHA256.

The client rejects invalid signatures, timestamps more than 60 seconds outside its clock, and recently reused nonces. This prevents an unauthenticated caller from scheduling the platform power action and prevents a captured valid request from being replayed.

The public `/health` endpoint does not trigger a power action and remains unsigned for availability reporting. The `/health/secure` and `/machines/turn-off` endpoints require signed requests after a key is configured.

Machines created before this feature can remain in `legacy` mode and accept unsigned shutdown requests until they are migrated with **Secure now**. Firewall policy remains an important defense for all clients, especially legacy clients. See [Secure Shutdown](../guides/secure-shutdown/).

## System-service installation

`wakezilla setup` requires elevated privileges because it installs protected executable copies and service-manager definitions. On Windows it also creates an inbound firewall rule for the configured proxy or client port.

Review that rule after installation and narrow its remote address scope when the default is broader than your network policy permits.

## Data protection

The proxy's `machines.json` contains shutdown keys as well as internal IP addresses, MAC addresses, service ports, and machine descriptions. A paired client's `config.toml` contains its shutdown key. `access_history.json` reveals connection timing.

Wakezilla restricts setup-managed configuration and machine database files to the service account where the platform permits it. Preserve those permissions, protect backups accordingly, and rotate the affected key if one of these files or a generated setup command is exposed.

The dashboard returns a generated command containing the key while setup is incomplete. Because the proxy does not provide TLS or dashboard authentication, only open it over a trusted network or through an authenticated TLS gateway.

## Current limitations

The proxy does not currently provide:

- user authentication or authorization;
- encrypted HTTP connections;
- request rate limits for API operations;
- an audit log of dashboard users.

Secure shutdown protects the proxy-to-client request. It does not authorize who may call the proxy API, so anyone who can reach that API can still request a wake, shutdown, update, or deletion operation.

Track deployment constraints in [Known Limitations](../help/known-limitations/).
