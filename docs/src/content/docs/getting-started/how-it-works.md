---
title: How Wakezilla Works
description: Follow a connection from the caller to a sleeping machine and back again.
---

Wakezilla combines Wake-on-LAN, a bidirectional TCP proxy, and an optional target-side power client. The proxy runs on a machine that stays available. The client runs on each target that Wakezilla may suspend, hibernate, or shut down remotely.

## Connection lifecycle

1. A client connects to a **local port** configured in Wakezilla.
2. The proxy tries the configured target service port with a one-second TCP probe.
3. If that port is unavailable, Wakezilla sends the configured Wake-on-LAN packets.
4. It checks the target service every two seconds for up to 60 seconds.
5. Wakezilla connects to the configured **target port** on that machine.
6. Bytes from the original client are forwarded to the target service.
7. Bytes returned by the target service are forwarded back to the original client.

The forwarding is **bidirectional**. Wakezilla does not stop after delivering the request: it keeps both sides of the TCP connection connected so the caller receives the target service's response.

If the target service does not become reachable within 60 seconds, Wakezilla closes the original connection. The caller must reconnect to try again.

## Inactivity and shutdown

Whenever the proxy accepts a new connection for a machine, it updates that machine's activity timestamp. A single monitor compares this timestamp with the configured inactivity period.

The current web interface defaults new machine records to **60 minutes**. With that value, the lifecycle is:

- the connection is accepted and the timer is refreshed;
- traffic and responses continue in both directions;
- the connection eventually closes;
- if no new connection is accepted for 60 minutes, the proxy sends one remote power request to the Wakezilla client.

The inactivity timer is per target IP and is initialized when a configured port forward starts. A machine without a port forward is not monitored for inactivity. Changing a machine's configuration restarts the global monitor with the new settings.

The client waits five seconds, then performs the platform action: suspend with shutdown fallback on Linux, shutdown on macOS, or hibernate on Windows. See [Platform Behavior](../reference/platform-behavior/).

## Proxy and client roles

| Component | Default web port | Responsibility |
| --- | ---: | --- |
| Proxy server | `3000` | Dashboard, API, Wake-on-LAN, service-port checks, TCP forwarding, history, and inactivity monitoring |
| Client server | `3001` | Health endpoint and remote platform power request |

The client is required for dashboard status and remote power actions. Direct Wake-on-LAN and port forwarding are handled by the proxy server.
