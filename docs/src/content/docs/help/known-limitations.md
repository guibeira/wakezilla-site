---
title: Known Limitations
description: Current behavior that affects configuration, status, scanning, and inactivity handling.
---

This page records behavior in the current Wakezilla source so deployment instructions remain honest while the product evolves.

## Server `--port` options are not applied

`wakezilla proxy-server --port` and `wakezilla client-server --port` appear in command help, but the dispatcher currently starts both servers using `config.toml` or environment values.

Use:

```sh
WAKEZILLA__SERVER__PROXY_PORT=3100 wakezilla proxy-server
WAKEZILLA__SERVER__CLIENT_PORT=3101 wakezilla client-server
```

## Dashboard requests assume port 3000

When the development frontend is opened from a URL containing a port, its API client currently targets port `3000`. A dashboard served from another explicit port can therefore load while its API requests fail.

Use port `3000` for direct dashboard access, or verify same-origin behavior behind your reverse proxy before deploying a custom port.

## Inactivity defaults differ by entry point

The web interface and shared machine model default to `60` minutes. The backend fallback for an omitted or legacy `inactivity_period` field is currently `30` minutes.

Always save an explicit value through the machine detail page or API.

## New machines hide inactivity during creation

The creation form uses `60` minutes but does not show the field. Create the machine, open its detail page, then review **Inactivity Period (minutes)**.

## Inactivity requires a port forward

The current monitor registers a machine while starting one of its TCP forwarders. A machine with remote power enabled but no forward does not enter inactivity monitoring.

The timer starts when the forwarder starts. It can therefore trigger even if no connection has ever reached that forwarder.

## One remote power attempt per activity window

After the inactivity window expires, Wakezilla marks the action as triggered before sending the HTTP request. It does not retry until another accepted proxy connection resets the machine's activity state.

## Wake wait is fixed

An accepted forwarding connection uses a one-second probe, waits up to 60 seconds after sending Wake-on-LAN, and checks every two seconds. If the target service does not become reachable, Wakezilla drops the original connection. The caller must reconnect to try again.

Several related configuration keys are declared but do not currently replace these fixed values. See [Configuration](../reference/configuration/#declared-but-not-currently-applied).

## Status checks the Wakezilla client

Dashboard and TUI status call the client `/health` endpoint, using the configured remote power port or `3001`. They do not test general host reachability or a forwarded application port.

## Windows network scanning

Windows builds do not provide ARP scanning. Manual registration, Wake-on-LAN, forwarding, the client, services, TUI, tray, and updates remain supported.
