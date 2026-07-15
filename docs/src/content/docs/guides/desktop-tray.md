---
title: Desktop Tray
description: Open the dashboard and control installed services from the desktop menu.
---

Release builds for Linux GNU desktops, macOS, and Windows include desktop tray support. Start it with:

```sh
wakezilla tray
```

Some Linux musl archives use a separate `wakezilla-tray` helper installed beside the main executable. The `wakezilla tray` command delegates to it automatically.

## Menu actions

The tray menu can:

- open the local dashboard;
- copy the dashboard URL;
- show whether proxy and client services are installed, running, or stopped;
- start, stop, and restart either service;
- open service logs;
- check whether a newer release is available;
- configure tray login startup and open the service setup wizard;
- exit the tray process.

Service status refreshes periodically. Actions that change a service open an elevated command when the tray itself is not running with sufficient privileges.

## Configure startup

Choose **Configure startup** to install tray autostart for the current graphical user and open `wakezilla setup` for boot-time proxy or client configuration.

The tray and server services have different lifecycles:

- the tray starts when the user signs in to the desktop;
- proxy and client services start at system boot through `wakezilla setup`.

## Linux dependencies

Linux desktop builds require GTK 3 and AppIndicator libraries. Common development packages include:

- Debian or Ubuntu: `libgtk-3-dev`, `libayatana-appindicator3-dev`;
- Alpine: `gtk+3.0-dev`, `libayatana-appindicator-dev`, `pkgconf`.

Installed release packages require the corresponding runtime libraries. Headless Linux and musl server deployments can continue using the main executable without the tray.

## Dashboard URL

The tray opens the local proxy URL derived from Wakezilla configuration. If the proxy service is not installed or running, the browser may open a page that cannot connect. Check **Proxy** status in the menu before opening it.

## Related

- [System Services](./system-services/)
- [Logs](../help/logs/)
- [Platform Behavior](../reference/platform-behavior/)
