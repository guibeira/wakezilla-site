---
title: Web Dashboard
description: Discover, register, inspect, wake, and manage machines from the browser.
---

The proxy server includes a dashboard at `http://<proxy-ip>:3000` by default. It uses the same HTTP API as the terminal interface.

![Wakezilla dashboard with the machine form and first port forward](/docs/images/dashboard-add-machine.png)

## Discover machines

The scanner at the top of the dashboard can automatically select a network interface or use one you choose.

1. Select the LAN interface that reaches the target machine.
2. Choose **Scan network**.
3. In **Discovered devices**, choose the plus action for a device.
4. Verify the prefilled IP address, MAC address, and hostname-derived name.

Scanning requires raw-network access on Linux and macOS and is unavailable in Windows builds. See [Network Scanner](./network-scanner/).

## Register a machine

The creation form accepts:

- a required name;
- a required MAC address;
- a required IPv4 address;
- an optional description;
- one or more port forwards;
- optional remote power support and its client port.

The form starts with one empty forward. Fill its service name, local port, and target port, or choose **Remove** if this machine does not need a forward. **+ Add port** creates additional rows.

The current creation form uses an inactivity period of `60` minutes but does not display that field. After creating the machine, open its detail page to review or change the value.

## Machine list

The dashboard table shows the machine address, description, client port, remote power setting, status, and forwards. Its actions can:

- send Wake-on-LAN immediately;
- request the target-side power action when configured;
- delete the machine after confirmation.

Select the machine name to open its detail page.

:::note
**Online** means the target-side Wakezilla client answered its `/health` endpoint. It does not mean every service on the machine is reachable. A powered-on machine without the client can appear offline.
:::

## Edit a machine

The detail page lets you change the name, IP address, description, remote power port, forwards, and inactivity period. Saving a change stops the old forwarders, starts the new configuration, and restarts the inactivity monitor.

![Machine detail page after Add port was selected, showing two port rows and the 60-minute inactivity setting](/docs/images/machine-detail.png)

The MAC address identifies the record and is displayed as read-only on this page.

## Remote controls

**Wake machine** sends the configured number of magic packets immediately. It does not wait for the machine to become reachable.

**Turn off machine** sends a request to the client port. The button is disabled until remote power is enabled and a port is configured. Platform behavior differs; see [Platform Behavior](../reference/platform-behavior/).

## Access history

The detail page charts accepted proxy connections for every configured forward. Switch between daily, weekly, and hourly buckets or choose **Refresh** to fetch the latest persisted data.

The raw machine JSON at the bottom is a diagnostic view of the API record. Treat it as potentially sensitive because it includes internal addresses and ports.
