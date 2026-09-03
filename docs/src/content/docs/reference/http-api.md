---
title: HTTP API Reference
description: Endpoints exposed by the Wakezilla proxy and target-side client.
---

The proxy API is served from the dashboard port, normally `http://<proxy-ip>:3000`. It uses JSON for request and response bodies.

:::danger
The proxy API has no user authentication and includes state-changing wake, delete, key-rotation, and remote power operations. Restrict it to trusted clients. Secure shutdown authenticates the proxy-to-client request, not the caller-to-proxy request. See [Security](/docs/reference/security/).
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
| `GET` | `/api/machines/:mac/shutdown-setup` | Return the secure shutdown setup state and any generated platform commands |
| `POST` | `/api/machines/:mac/shutdown-setup/verify` | Ask the client to prove it has the same shutdown key |
| `POST` | `/api/machines/:mac/shutdown-setup/rotate` | Generate a new shutdown key and return the machine to pending setup |
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

## Secure shutdown setup

The shutdown setup endpoints return:

```json
{
  "status": "pending",
  "unix_command": "sudo wakezilla setup --mode client --port 3001 --key <generated-key> --yes",
  "windows_command": "wakezilla setup --mode client --port 3001 --key <generated-key> --yes"
}
```

`status` is one of:

- `disabled`: remote shutdown is not enabled;
- `legacy`: remote shutdown has no key and uses unsigned requests;
- `pending`: a key was generated but has not been verified;
- `verified`: the client proved it has the matching key;
- `unreachable`: the verification request could not reach the client;
- `key_mismatch`: the client responded but rejected the proxy's signature.

The command fields are returned only while the current key still needs to be configured. They contain a credential and must not be logged or exposed to untrusted callers.

`POST /api/machines/:mac/shutdown-setup/rotate` replaces the proxy's current key immediately. Run the returned command on the client before expecting secure health or shutdown requests to work again.

## Online status semantics

`GET /api/machines/:mac/is-on` requests `http://<machine-ip>:<turn-off-port>/health`. If no turn-off port is configured, it uses `3001`.

This reports whether the Wakezilla client endpoint is reachable. It does not ping the operating system or test every forwarded service. A powered-on machine without the client may therefore appear offline.

## Client endpoints

The target-side client listens on `3001` by default:

| Method | Path | Effect |
| --- | --- | --- |
| `GET` | `/health` | Return `{ "status": "ok" }` |
| `GET` | `/health/secure` | Verify the signed request and return `{ "status": "ok" }` |
| `POST` | `/machines/turn-off` | Schedule the platform-specific power action after five seconds |

When `security.client_shutdown_key` is configured, `/health/secure` and `/machines/turn-off` require these headers:

| Header | Value |
| --- | --- |
| `x-wakezilla-timestamp` | Current Unix time in seconds |
| `x-wakezilla-nonce` | A new random URL-safe base64 nonce for this request |
| `x-wakezilla-signature` | URL-safe base64 HMAC-SHA256 signature |

The signature covers the protocol marker `wakezilla-v1`, uppercase method, path, timestamp, and nonce separated by newlines. The client accepts a maximum clock skew of 60 seconds and rejects a nonce that was recently used.

A client without `security.client_shutdown_key` retains legacy behavior and accepts unsigned `/machines/turn-off` requests. Never expose either client mode to an untrusted network; use network policy as a second layer around authenticated clients and as the primary protection for legacy clients.
