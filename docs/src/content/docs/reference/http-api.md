---
title: HTTP API Reference
description: Endpoints exposed by the Wakezilla proxy and target-side client.
---

The proxy API is served from the dashboard port, normally `http://<proxy-ip>:3000`. It uses JSON for request and response bodies.

:::danger
The API has no authentication and includes state-changing wake, delete, and remote power operations. Restrict it to trusted clients. See [Security](./security/).
:::

## Machine model

```json
{
  "name": "media-server",
  "mac": "AA:BB:CC:DD:EE:FF",
  "ip": "192.168.1.42",
  "description": "Living room server",
  "turn_off_port": 3001,
  "can_be_turned_off": true,
  "inactivity_period": 60,
  "port_forwards": [
    {
      "name": "media",
      "local_port": 8096,
      "target_port": 8096
    }
  ]
}
```

IPv4 addresses and MAC addresses are validated when a machine is created. Port values are unsigned 16-bit integers; use `1` through `65535` for listening and target ports.

## Proxy endpoints

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/interfaces` | List usable network interfaces |
| `GET` | `/api/scan?interface=<name>` | Scan a selected or automatically detected LAN interface |
| `GET` | `/api/machines` | List registered machines, newest first |
| `POST` | `/api/machines` | Register a machine |
| `GET` | `/api/machines/:mac` | Return one machine |
| `PUT` | `/api/machines/:mac` | Replace a machine and restart its forwarders |
| `GET` | `/api/machines/:mac/access-history` | Return timestamps for each configured forward |
| `POST` | `/api/machines/:mac/wake` | Send the configured Wake-on-LAN packets |
| `POST` | `/api/machines/:mac/remote-turn-off` | Ask the target-side client to enter its platform power state |
| `GET` | `/api/machines/:mac/is-on` | Check the Wakezilla client health endpoint |
| `DELETE` | `/api/machines/delete` | Delete the machine identified by a JSON `mac` field |

Example manual wake:

```sh
curl -X POST \
  http://192.168.1.10:3000/api/machines/AA%3ABB%3ACC%3ADD%3AEE%3AFF/wake
```

Delete body:

```json
{ "mac": "AA:BB:CC:DD:EE:FF" }
```

## Access history

The response groups accepted proxy connections by configured forward:

```json
{
  "services": [
    {
      "name": "media",
      "local_port": 8096,
      "target_port": 8096,
      "timestamps": [1720981200000]
    }
  ]
}
```

Timestamps are Unix time in milliseconds.

## Online status semantics

`GET /api/machines/:mac/is-on` requests `http://<machine-ip>:<turn-off-port>/health`. If no turn-off port is configured, it uses `3001`.

This reports whether the Wakezilla client endpoint is reachable. It does not ping the operating system or test every forwarded service. A powered-on machine without the client may therefore appear offline.

## Client endpoints

The target-side client listens on `3001` by default:

| Method | Path | Effect |
| --- | --- | --- |
| `GET` | `/health` | Return `{ "status": "ok" }` |
| `POST` | `/machines/turn-off` | Schedule the platform-specific power action after five seconds |

The client endpoint has no authentication. Never expose it to an untrusted network.
