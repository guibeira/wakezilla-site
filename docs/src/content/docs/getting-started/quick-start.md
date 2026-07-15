---
title: Quick Start
description: Run the proxy and client, register a machine, and forward your first port.
---

This walkthrough configures a target machine that Wakezilla can wake, proxy bidirectionally, and return to its platform power state after 60 minutes without a new connection.

## 1. Start the proxy server

On the machine that will stay online and receive incoming traffic, run:

```sh
wakezilla proxy-server
```

Open `http://<proxy-ip>:3000`. The dashboard listens on port `3000` by default.

## 2. Start the client server

On the target machine, run:

```sh
wakezilla client-server
```

The client listens on port `3001` by default. Confirm that the proxy machine can reach `http://<target-ip>:3001/health`.

## 3. Register the target machine

In the proxy dashboard, add a machine manually or select one from the network scanner. Enter:

- a recognizable name;
- the target machine's IP address;
- its Wake-on-LAN MAC address;
- turn-off port `3001` when remote power is enabled.

Enable remote turn off if you want Wakezilla to suspend, hibernate, or shut down the target after inactivity, depending on its operating system.

## 4. Add a port forward

The creation form already contains **Forward 1**. Enter:

- **Service name:** an optional label such as `media`;
- **Local Port:** the port accepted by the proxy, such as `8096`;
- **Target Port:** the service port on the target machine, such as `8096`.

Save the machine.

## 5. Confirm the inactivity period

The creation form uses `60` minutes but does not display the field. After saving, Wakezilla opens the machine detail page. Confirm that **Inactivity Period (minutes)** is `60`, then choose **Save changes** if you modify it.

## 6. Send traffic

Connect to `<proxy-ip>:8096`. If the target is sleeping, Wakezilla sends the wake packet and waits for the service. It then forwards the request to the target and forwards the response back to the caller.

The TCP stream remains bidirectional for the life of the connection. Each newly accepted connection resets the inactivity timer. When no new connection arrives for 60 minutes, Wakezilla asks the target's client to perform its platform power action.

:::note
Wakezilla waits up to 60 seconds for the target service. If it is still unavailable, the original connection closes and the caller must reconnect.
:::

For boot-time operation, continue to [System Services](../guides/system-services/). Before allowing another host to connect, read [Security](../reference/security/).
