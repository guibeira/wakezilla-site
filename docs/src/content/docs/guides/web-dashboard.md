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

When remote power is enabled for a new machine, Wakezilla creates a unique shutdown key and opens the detail page so you can finish pairing the target client.

## Machine list

The dashboard table shows the machine address, description, client port, remote power setting, status, and forwards. Its actions can:

- send Wake-on-LAN immediately;
- request the target-side power action after the client is configured;
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

For a new machine with remote power enabled, **Finish setting up your client server** appears at the top of the detail page. It shows two steps for Linux/macOS and Windows:

1. Install Wakezilla on the target, if needed.
2. Run the generated `wakezilla setup --mode client --key ...` command with administrator privileges.

Each **Copy command** button briefly changes to **Copied!** after a successful copy. The page checks the client's authenticated health endpoint automatically and reports whether setup is pending, verified, unreachable, or using a different key.

**Turn off machine** is hidden for a new client until secure setup is verified. It sends an authenticated request to the client port once available. Legacy clients keep the control while they are migrated and show a **Secure now** action. A verified client offers **Reconfigure security** to rotate its key.

See [Secure Shutdown](./secure-shutdown/) for the pairing flow and [Platform Behavior](../reference/platform-behavior/) for the action performed on each operating system.

## Access history

The detail page charts accepted proxy connections for every configured forward. Switch between daily, weekly, and hourly buckets or choose **Refresh** to fetch the latest persisted data.

When Wakezilla is compiled with its debug feature, the page also includes a raw machine JSON diagnostic view. Production builds hide this section. Treat debug output as potentially sensitive because it includes internal addresses and ports.
