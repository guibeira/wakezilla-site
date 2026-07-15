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
- **Service name** labels a port forward in the dashboard, history chart, and TUI.
- **Turn off port** identifies the target-side client.
- **Port forwards** define the TCP services that trigger wake and proxy traffic.

## Remote shutdown

Enable **Allow remote turn off** during creation, or **Enable remote turn off** on the detail page, when the Wakezilla client runs on the target. Set **Turn Off Port** to the client's listening port, normally `3001`.

For a new machine, the detail page generates a unique shutdown key and shows the commands to install Wakezilla and configure the target client. The page verifies the key automatically. The remote turn-off control appears only after verification succeeds.

The proxy must be able to reach the client port. Do not expose it to untrusted networks, even after authenticated shutdown is enabled. See [Secure Shutdown](../guides/secure-shutdown/).

## Inactivity period

The inactivity period is measured in minutes. The current creation form uses `60`; edit it on the machine detail page. Monitoring only starts for machines with at least one port forward.

See [Inactivity Timeout](./inactivity-timeout/) for the exact timer behavior.

## Add or discover a machine

Use **Add machine** to enter the values directly. On Linux and macOS, the network scanner can discover LAN devices and prefill the record. Always verify the detected IP and MAC address before saving.

## Online status

The dashboard checks the Wakezilla client `/health` endpoint on the configured turn-off port, or `3001` when no port is set. This is client availability, not a general host or forwarded-service check.

See [Web Dashboard](../guides/web-dashboard/) for editing, manual controls, history, and deletion.
