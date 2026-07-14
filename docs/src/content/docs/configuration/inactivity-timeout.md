---
title: Inactivity Timeout
description: Control when Wakezilla asks an inactive target machine to shut down.
---

Wakezilla tracks activity per machine using the time at which the proxy last accepted a connection for that machine.

## Configure the timeout

Set **Inactivity Period** in minutes when adding or editing a machine. A practical starting value is `60` minutes:

```text
Inactivity Period: 60
```

Each newly accepted connection resets the timer. The connection may then carry requests and responses in both directions until it closes.

## Shutdown sequence

After 60 minutes without a new accepted connection:

1. the inactivity monitor identifies the machine as idle;
2. the proxy sends a shutdown request to the Wakezilla client;
3. the client asks the operating system to power down;
4. a later connection causes the proxy to send another Wake-on-LAN packet and wait for the machine again.

Changing a machine's inactivity period restarts monitoring with the new value. Wakezilla uses one global monitor, preventing multiple shutdown requests from duplicate monitor instances.

:::caution
The timer records newly accepted proxy connections, not general CPU, disk, or user activity on the target. A local task running on the machine does not reset the Wakezilla timer unless it creates traffic through a configured proxy port.
:::

## Requirements

Automatic shutdown requires:

- remote shutdown enabled for the machine;
- the Wakezilla client running on the target;
- the correct turn-off port, normally `3001`;
- network access from the proxy to the client endpoint.
