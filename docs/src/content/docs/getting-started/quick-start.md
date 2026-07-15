---
title: Quick Start
description: Install the proxy and client services with wakezilla setup, then forward your first port.
---

The fastest way to start Wakezilla is the interactive `wakezilla setup` wizard. Run it once on the machine that stays online as the proxy, then run it again on the target machine as the client. The wizard writes the system configuration, installs a boot-time service, starts it, and checks that its port is reachable.

## What you need

- Wakezilla installed on the proxy and target machines;
- administrator access on both machines;
- the target machine's IP address and Wake-on-LAN MAC address;
- one target service to forward, such as a media server on TCP `8096`.

## 1. Configure the proxy service

On the machine that will stay online and receive incoming traffic, run:

```sh
sudo wakezilla setup
```

On Windows, open PowerShell as Administrator and run `wakezilla setup` without `sudo`.

Choose **Proxy server** with the arrow keys or press `1`, then press Enter.

![Wakezilla setup wizard with Proxy server selected](/docs/images/setup-select-mode.png)

Keep the default proxy port `3000`, or enter another available TCP port.

![Wakezilla setup wizard asking for the proxy server port](/docs/images/setup-proxy-port.png)

Review the selected mode, port, and configuration path. Press Enter to install and start the service. The path shown below is from macOS; Linux and Windows use their platform-specific system paths.

![Wakezilla setup wizard confirming proxy server port 3000 and the macOS configuration path](/docs/images/setup-confirm.png)

## 2. Verify the proxy

Check the service from the proxy machine:

```sh
sudo wakezilla service status --mode proxy
```

On Windows, run the command from an elevated PowerShell without `sudo`.

Open `http://<proxy-ip>:3000`. The dashboard should load before you continue. If you selected a different port, replace `3000` in the URL.

## 3. Configure the target client

On the machine Wakezilla will wake and later return to its platform power state, run the same wizard:

```sh
sudo wakezilla setup
```

Choose **Client server**, keep its default port `3001`, and confirm the configuration. On Windows, use an elevated PowerShell without `sudo`.

From the proxy machine, verify the target-side client:

```sh
curl http://<target-ip>:3001/health
```

The endpoint returns `{"status":"ok"}`. Allow TCP `3001` only between the proxy and target; it exposes the remote power operation without application-level authentication.

## 4. Use the tray on a graphical desktop

Release installers include the Wakezilla tray application. When a graphical desktop session is available, the installer requests an immediate tray launch or configures it for the next graphical login.

<img src="/docs/images/tray-icon.png" alt="Wakezilla dinosaur tray icon" width="120" />

If the icon is not already visible, start it manually:

```sh
wakezilla tray
```

The tray can open or copy the dashboard URL, show proxy and client status, control installed services, open logs, check for updates, and configure startup.

:::note
Headless servers do not show a tray icon. This does not affect the proxy or client service installed by `wakezilla setup`. Use `wakezilla service` commands and the web dashboard instead.
:::

See [Desktop Tray](../guides/desktop-tray/) for the complete menu and platform requirements.

## 5. Register the target machine

In the proxy dashboard, add a machine manually or select one from the network scanner. Enter:

- a recognizable name;
- the target machine's IP address;
- its Wake-on-LAN MAC address;
- turn-off port `3001`;
- **Allow remote turn off** enabled.

The creation form already contains **Forward 1**. Enter:

- **Service name:** an optional label such as `media`;
- **Local Port:** the port accepted by the proxy, such as `8096`;
- **Target Port:** the service port on the target machine, such as `8096`.

Save the machine.

## 6. Confirm the inactivity period

The creation form uses `60` minutes but does not display the field. After saving, Wakezilla opens the machine detail page. Confirm that **Inactivity Period (minutes)** is `60`, then choose **Save changes** if you modify it.

## 7. Send traffic through Wakezilla

Connect to `<proxy-ip>:8096`. If the target is sleeping, Wakezilla sends the wake packet and waits for the service. It then forwards the request to the target and forwards the response back to the caller.

The TCP stream remains bidirectional for the life of the connection. Each newly accepted connection resets the inactivity timer. When no new connection arrives for 60 minutes, Wakezilla asks the target's client to perform its platform power action.

:::note
Wakezilla waits up to 60 seconds for the target service. If it is still unavailable, the original connection closes and the caller must reconnect.
:::

## What you built

The proxy and client now start automatically with the operating system. A connection to the proxy wakes the target when required, carries traffic in both directions, and lets Wakezilla return the target to its platform power state after 60 minutes without a new connection.

Continue with [Web Dashboard](../guides/web-dashboard/) for machine management or [System Services](../guides/system-services/) for service controls and logs. Before allowing another host to connect, read [Security](../reference/security/).
