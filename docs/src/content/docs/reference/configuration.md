---
title: Configuration Reference
description: Configure Wakezilla with config.toml and WAKEZILLA environment variables.
---

Wakezilla loads an optional `config.toml`, then applies environment variables on top. Environment variables use the `WAKEZILLA` prefix and a double underscore between nested keys.

```sh
WAKEZILLA__SERVER__PROXY_PORT=3000
WAKEZILLA__WOL__DEFAULT_BROADCAST_IP=192.168.1.255
```

## Configuration file locations

| Platform | File |
| --- | --- |
| Linux | `/etc/wakezilla/config.toml` |
| macOS | `/Library/Application Support/wakezilla/config.toml` |
| Windows | `%ProgramData%\wakezilla\config.toml` |

`wakezilla setup` creates this file. A foreground process without a configuration file uses built-in defaults and stores relative data files in its current working directory.

## Effective settings

```toml
[server]
proxy_port = 3000
client_port = 3001

[wol]
default_port = 9
default_broadcast_ip = "255.255.255.255"
default_packet_count = 3
packet_sleeptime_ms = 50

[storage]
machines_db_path = "machines.json"
access_history_path = "access_history.json"
max_access_records = 2000

[security]
# client_shutdown_key = "<generated-key>"
```

| TOML key | Environment variable | Default | Effect |
| --- | --- | ---: | --- |
| `server.proxy_port` | `WAKEZILLA__SERVER__PROXY_PORT` | `3000` | Dashboard and API port |
| `server.client_port` | `WAKEZILLA__SERVER__CLIENT_PORT` | `3001` | Client health and remote power port |
| `wol.default_port` | `WAKEZILLA__WOL__DEFAULT_PORT` | `9` | UDP destination for magic packets |
| `wol.default_broadcast_ip` | `WAKEZILLA__WOL__DEFAULT_BROADCAST_IP` | `255.255.255.255` | Wake packet broadcast address |
| `wol.default_packet_count` | `WAKEZILLA__WOL__DEFAULT_PACKET_COUNT` | `3` | Packets sent for each wake action |
| `wol.packet_sleeptime_ms` | `WAKEZILLA__WOL__PACKET_SLEEPTIME_MS` | `50` | Delay between wake packets |
| `storage.machines_db_path` | `WAKEZILLA__STORAGE__MACHINES_DB_PATH` | `machines.json` | Machine database location |
| `storage.access_history_path` | `WAKEZILLA__STORAGE__ACCESS_HISTORY_PATH` | `access_history.json` | Access history location |
| `storage.max_access_records` | `WAKEZILLA__STORAGE__MAX_ACCESS_RECORDS` | `2000` | Records retained per forwarded service |
| `security.client_shutdown_key` | `WAKEZILLA__SECURITY__CLIENT_SHUTDOWN_KEY` | unset | Per-machine HMAC key accepted by a target client |

Paths may be absolute or relative. Relative paths are resolved from the process working directory.

The dashboard-generated client setup command writes `security.client_shutdown_key` automatically. The value must be URL-safe base64 that decodes to exactly 32 bytes. A client with no key keeps legacy unsigned shutdown behavior for backward compatibility.

:::caution
The shutdown key is a credential. Do not commit `config.toml`, paste the key into logs, or share a generated setup command. Rotate the key from the machine detail page if it may have been exposed.
:::

## Declared but not currently applied

The configuration model also declares the following keys, but the current runtime does not consistently consume them. Do not rely on them to change production behavior:

- `server.health_timeout_secs`
- `wol.default_wait_secs`
- `wol.default_poll_interval_ms`
- `wol.default_connect_timeout_ms`
- `network.scan_duration_secs`
- `network.read_timeout_secs`
- every key under `health`

The proxy currently uses fixed connection and wake-wait values. See [Known Limitations](../help/known-limitations/).

## Invalid configuration

If Wakezilla cannot load or deserialize `config.toml`, it logs a warning and starts with the complete built-in default configuration. Check the startup log whenever a configured value appears to be ignored.

## Related

- [Storage and Backups](./storage/)
- [System Services](../guides/system-services/)
- [Security](./security/)
