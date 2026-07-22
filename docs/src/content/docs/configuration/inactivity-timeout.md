---
title: Inactivity Timeout
description: Control when Wakezilla asks an inactive target machine to shut down.
---

Wakezilla tracks activity per target IP. The timer is initialized when a TCP forward starts and resets whenever that forward accepts a new connection.

## Configure the timeout

Set **Inactivity Period (minutes)** on the machine detail page. The current web interface creates new machines with `60` minutes:

```text
Inactivity Period: 60
```

Each newly accepted connection resets the timer. The connection may then carry requests and responses in both directions until it closes.

## Shutdown sequence

After 60 minutes without a new accepted connection:

1. the inactivity monitor identifies the machine as idle;
2. the proxy sends a shutdown request to the Wakezilla client;
3. the client waits five seconds and performs the platform action;
4. a later connection causes the proxy to send another Wake-on-LAN packet and wait for the machine again.

Changing a machine restarts the global monitor. Wakezilla sends one remote power request per activity window; another accepted connection resets the state and permits a later request.

:::caution
The timer records newly accepted proxy connections, not general CPU, disk, or user activity on the target. A local task running on the machine does not reset the Wakezilla timer unless it creates traffic through a configured proxy port.
:::

:::caution
Remote power monitoring currently requires at least one configured port forward. The timer begins when the forward starts, so a request can occur even when the forward has never accepted a connection.
:::

## Requirements

Automatic shutdown requires:

- remote shutdown enabled for the machine;
- the Wakezilla client running on the target;
- secure shutdown verified for a newly configured client, or a legacy client still available during migration;
- the correct turn-off port, normally `3001`;
- network access from the proxy to the client endpoint.

The final operating-system action is suspend with shutdown fallback on Linux, shutdown on macOS, and hibernate on Windows. Test that Wake-on-LAN can restore the target from its resulting power state.

See [Secure Shutdown](/docs/guides/secure-shutdown/) for client pairing and [Known Limitations](/docs/help/known-limitations/#one-remote-power-attempt-per-activity-window) for retry behavior and default differences.
