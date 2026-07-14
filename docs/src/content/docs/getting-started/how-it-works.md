---
title: How Wakezilla Works
description: Follow a connection from the caller to a sleeping machine and back again.
---

Wakezilla combines Wake-on-LAN, a TCP proxy, and an optional shutdown client. The proxy runs on a machine that stays available; the client runs on each target that Wakezilla may turn off remotely.

## Connection lifecycle

1. A client connects to a **local port** configured in Wakezilla.
2. The proxy checks whether the target machine is reachable.
3. If it is offline, Wakezilla sends a Wake-on-LAN magic packet and waits for it to become available.
4. Wakezilla connects to the configured **target port** on that machine.
5. Bytes from the original client are forwarded to the target service.
6. Bytes returned by the target service are forwarded back to the original client.

The forwarding is **bidirectional**. Wakezilla does not stop after delivering the request: it keeps both sides of the TCP connection connected so the caller receives the target service's response.

## Inactivity and shutdown

Whenever the proxy accepts a new connection for a machine, it updates that machine's `last_request` timestamp. A single monitor compares this timestamp with the configured inactivity period.

With an inactivity period of **60 minutes**, the lifecycle is:

- the connection is accepted and the timer is refreshed;
- traffic and responses continue in both directions;
- the connection eventually closes;
- if no new connection is accepted for 60 minutes, the proxy sends a shutdown request to the Wakezilla client on the target machine.

The inactivity timer is per machine. Changing a machine's configuration restarts the monitor with the new settings without creating duplicate monitors.

## Proxy and client roles

| Component | Default web port | Responsibility |
| --- | ---: | --- |
| Proxy server | `3000` | Dashboard, Wake-on-LAN, reachability checks, TCP forwarding, and inactivity monitoring |
| Client server | `3001` | Receives a shutdown request from the proxy on the target machine |

The client is only required when Wakezilla must turn the target off remotely. Wake-on-LAN and port forwarding are handled by the proxy server.
