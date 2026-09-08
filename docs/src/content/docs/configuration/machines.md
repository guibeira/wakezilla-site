---
title: Machines
description: Register a target machine and define how Wakezilla wakes and shuts it down.
---

A machine record tells Wakezilla where to send the wake packet, where to forward traffic, and whether the target can be shut down remotely.

## Required fields

| Field | Purpose |
| --- | --- |
| Name | A recognizable label shown in the dashboard |
| IP address | The address used for reachability checks and target connections |
| MAC address | The hardware address included in the Wake-on-LAN magic packet |

The MAC address must belong to the network interface configured for Wake-on-LAN. Prefer a stable IP address or DHCP reservation. Machine routes use the MAC address as the record identifier, so keep it unique.

## Optional fields

- **Description** gives administrators more context in the dashboard.
- **Machine type** selects a hardware category and its visual icon.
- **Service name** labels a port forward in the dashboard, history chart, and TUI.
- **Client port**, under **Client settings**, identifies the target-side client.
- **Port forwards** define the TCP services that trigger wake and proxy traffic.

## Remote shutdown

Expand **Client settings** during creation or in the machine's details. Enable **Allow shutdown from the dashboard** when the Wakezilla client runs on the target. Set **Client port** to the client's listening port, normally `3001`.

After saving a new machine with shutdown enabled, **Set up your machine** shows the installation and client configuration commands. It verifies the key automatically. You can also open it with **Set up client** in the details window. The **Shut down** control requires a reachable, configured client.

The proxy must be able to reach the client port. Do not expose it to untrusted networks, even after authenticated shutdown is enabled. See [Secure Shutdown](/docs/guides/secure-shutdown/).

## Inactivity period

Set **Inactivity (minutes)** under **Client settings**. The form starts at `60`, and you can change it before creation or later in the details window. Use `0` to disable automatic shutdown. Monitoring only starts for machines with at least one port forward.

See [Inactivity Timeout](/docs/configuration/inactivity-timeout/) for the exact timer behavior.

## Add or discover a machine

Use **Add machine** to enter the values directly. **Find on network** opens the scanner, where **Find devices** discovers LAN devices on Linux and macOS. Choose **Add** beside a result, then verify the detected IP and MAC address before saving.

## Online status

The dashboard checks the Wakezilla client `/health` endpoint on the configured turn-off port, or `3001` when no port is set. This is client availability, not a general host or forwarded-service check.

See [Web Dashboard](/docs/guides/web-dashboard/) for editing, manual controls, history, and deletion.
