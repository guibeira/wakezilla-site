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

The MAC address must belong to the network interface configured for Wake-on-LAN. Prefer a stable IP address or a DHCP reservation for the target machine.

## Remote shutdown

Enable **Can be turned off remotely** when the Wakezilla client runs on the target. Set **Turn Off Port** to the client's listening port, normally `3001`.

The proxy must be able to reach this port. Do not expose the client shutdown endpoint to untrusted networks.

## Inactivity period

The inactivity period is measured in minutes. For example, a value of `60` means Wakezilla waits for 60 minutes without a newly accepted proxy connection before requesting shutdown.

See [Inactivity Timeout](./inactivity-timeout/) for the exact timer behavior.

## Add or discover a machine

Use **Add Machine** to enter the values directly. On supported platforms, the network scanner can discover devices on the local network and prefill part of the machine record. Always verify the detected IP and MAC address before saving.
