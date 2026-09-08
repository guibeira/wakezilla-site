---
title: Quick Start
description: Install the proxy, securely pair a target client, and forward your first port.
---

The fastest way to start Wakezilla is to configure the proxy with `wakezilla setup`, register the target in the dashboard, and run the generated secure client command. The setup process writes the system configuration, installs a boot-time service, starts it, and checks that its port is reachable.

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

Keep the default proxy port `3000` for this guide. The current dashboard uses same-origin `/api` requests. If you change the configured listener or use a reverse proxy, serve the dashboard and its `/api` routes together. See [Known Limitations](/docs/help/known-limitations/) for server configuration caveats.

![Wakezilla setup wizard asking for the proxy server port](/docs/images/setup-proxy-port.png)

Review the selected mode, port, and configuration path. Press Enter to install and start the service. The path shown below is from macOS; Linux and Windows use their platform-specific system paths.

![Wakezilla setup wizard confirming proxy server port 3000 and the macOS configuration path](/docs/images/setup-confirm.png)

## 2. Verify the proxy

Check the service from the proxy machine:

```sh
sudo wakezilla service status --mode proxy
```

On Windows, run the command from an elevated PowerShell without `sudo`.

Open `http://<proxy-ip>:3000`. The dashboard should load before you continue.

## 3. Install Wakezilla on the target

On Linux or macOS, run:

```sh
curl -fsSL https://wakezilla.dev/install.sh | sh
```

On Windows, open PowerShell as Administrator and run:

```powershell
irm https://wakezilla.dev/install.ps1 | iex
```

Do not configure the client service yet. The dashboard will generate a per-machine key and the complete command after you register the target.

## 4. Register the target machine

In the proxy dashboard, choose **Add machine**, or use **Find on network** to discover a target. Enter:

- a recognizable name;
- the target machine's IP address;
- its Wake-on-LAN MAC address;
- a machine type that identifies the hardware.

Expand **Client settings**. Enable **Allow shutdown from the dashboard**, keep **Client port** at `3001`, and set **Inactivity (minutes)** to `60`.

The form starts without services. Under **Services and port forwarding**, choose **Add service** and enter:

- **Service name:** an optional label such as `media`;
- **Local port:** the port accepted by the proxy, such as `8096`;
- **Target port:** the service port on the target machine, such as `8096`.

<img src="/docs/images/dashboard-add-machine.webp" alt="Add machine window with client settings and an unsaved example Jellyfin service" width="690" height="894" loading="lazy" decoding="async" />

Use your actual target addresses, then choose **Add machine** to save. With dashboard shutdown enabled, the window moves to **Set up your machine**.

## 5. Pair the target client

Select **Linux / macOS** or **Windows** in **Set up your machine**. The window generates the complete configuration command, including the machine's shutdown key. You do not need to create, type, or replace the key manually.

Since Wakezilla is already installed, choose **Copy** beside **2. Set up the client** and run the command on the target with administrator privileges. On Windows, use PowerShell as Administrator.

Leave the setup window open for automatic verification, or choose **Check connection**. When the client is paired, it shows **Client configured**. Allow TCP `3001` only between the proxy and target.

<img src="/docs/images/secure-shutdown-setup.webp" alt="Set up your machine window after successful client verification, showing Client configured" width="690" height="608" loading="lazy" decoding="async" />

This screenshot shows an existing, verified client. Setup commands are only shown while pairing is needed. Use **View machine** or **Done** to leave this screen. If you chose **Set up later**, reopen the machine and select **Set up client** to continue.

:::caution
The generated command contains the machine's shutdown credential. Treat it as a secret and restrict access to the dashboard while it is visible.
:::

See [Secure Shutdown](/docs/guides/secure-shutdown/) for verification states, legacy migration, key rotation, and troubleshooting.

## 6. Use the tray on a graphical desktop

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

See [Desktop Tray](/docs/guides/desktop-tray/) for the complete menu and platform requirements.

## 7. Confirm the inactivity period

Open the machine's details and expand **Client settings**. Confirm that **Inactivity (minutes)** is `60`, then choose **Save changes** if you modify it. This setting is also available during creation. A value of `0` disables automatic shutdown.

## 8. Send traffic through Wakezilla

Connect to `<proxy-ip>:8096`. If the target is sleeping, Wakezilla sends the wake packet and waits for the service. It then forwards the request to the target and forwards the response back to the caller.

The TCP stream remains bidirectional for the life of the connection. Each newly accepted connection resets the inactivity timer. When no new connection arrives for 60 minutes, Wakezilla asks the target's client to perform its platform power action.

:::note
Wakezilla waits up to 60 seconds for the target service. If it is still unavailable, the original connection closes and the caller must reconnect.
:::

## What you built

The proxy and client now start automatically with the operating system. A connection to the proxy wakes the target when required, carries traffic in both directions, and lets Wakezilla return the target to its platform power state after 60 minutes without a new connection.

Continue with [Web Dashboard](/docs/guides/web-dashboard/) for machine management or [System Services](/docs/guides/system-services/) for service controls and logs. Before allowing another host to connect, read [Security](/docs/reference/security/).
