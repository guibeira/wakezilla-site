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

## Dashboard and API must share an origin

The current dashboard uses relative `/api` URLs. A reverse proxy must serve the frontend and forward its API requests under the same origin. Serving only the static frontend files is not sufficient.

Port `3000` remains the default for direct access. Older dashboard builds assumed this port explicitly; refresh the frontend when upgrading to the current interface.

## Inactivity defaults differ by entry point

The web interface and shared machine model default to `60` minutes. The backend fallback for an omitted or legacy `inactivity_period` field is currently `30` minutes.

Always save an explicit value through **Client settings** in the machine window or through the API.

## Client settings are collapsed during creation

The creation form starts at `60` minutes. Expand **Client settings** to review or change **Inactivity (minutes)** before saving. A value of `0` disables automatic shutdown; it does not disable Wake-on-LAN or port forwarding.

## Inactivity requires a port forward

The current monitor registers a machine while starting one of its TCP forwarders. A machine with remote power enabled but no forward does not enter inactivity monitoring.

The timer starts when the forwarder starts. It can therefore trigger even if no connection has ever reached that forwarder.

## One remote power attempt per activity window

After the inactivity window expires, Wakezilla marks the action as triggered before sending the HTTP request. It does not retry until another accepted proxy connection resets the machine's activity state.

## Wake wait is fixed

An accepted forwarding connection uses a one-second probe, waits up to 60 seconds after sending Wake-on-LAN, and checks every two seconds. If the target service does not become reachable, Wakezilla drops the original connection. The caller must reconnect to try again.

Several related configuration keys are declared but do not currently replace these fixed values. See [Configuration](/docs/reference/configuration/#declared-but-not-currently-applied).

## Status checks the Wakezilla client

Dashboard and TUI status call the client `/health` endpoint, using the configured remote power port or `3001`. They do not test general host reachability or a forwarded application port.

## Secure shutdown onboarding is web-only

The web dashboard shows generated client commands, verifies the shared key, and hides its shutdown control until a new client is verified. The TUI does not display that onboarding state and can still ask the proxy to turn off a selected machine while setup is pending. A configured client can reject or fail the request, but a legacy client without a key can accept it and execute the shutdown action.

Migrate legacy targets or restrict their client port at the network boundary before relying on the TUI's `t` action. Complete secure setup in the machine detail page first. This does not weaken a configured client's HMAC validation.

## Windows network scanning

Windows builds do not provide ARP scanning. Manual registration, Wake-on-LAN, forwarding, the client, services, TUI, tray, and updates remain supported.
