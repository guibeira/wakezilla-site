---
title: Storage and Backups
description: Locate, back up, restore, and remove Wakezilla machine and access-history data.
---

Wakezilla persists machine configuration and access history as JSON files. Client service configuration is stored separately in `config.toml`.

| File | Contents |
| --- | --- |
| `machines.json` | Machines, MAC and IP addresses, remote power settings, shutdown keys and verification state, inactivity periods, and port forwards |
| `access_history.json` | Accepted connection timestamps grouped by machine and local port |
| `config.toml` | Service settings and, on a paired client, `security.client_shutdown_key` |

## Foreground processes

When you run `wakezilla proxy-server` without a generated system configuration, both files are relative to the directory from which Wakezilla starts.

```text
./machines.json
./access_history.json
```

Set absolute locations when the working directory may change:

```sh
export WAKEZILLA__STORAGE__MACHINES_DB_PATH=/srv/wakezilla/machines.json
export WAKEZILLA__STORAGE__ACCESS_HISTORY_PATH=/srv/wakezilla/access_history.json
```

## System service data

`wakezilla setup` writes absolute paths for service data:

| Platform | Data directory |
| --- | --- |
| Linux | `/var/lib/wakezilla` |
| macOS | `/Library/Application Support/wakezilla` |
| Windows | `%ProgramData%\wakezilla` |

## Access-history retention

Wakezilla keeps up to `2000` accepted-connection timestamps per forwarded service by default. Set `storage.max_access_records` to a different number. A value of `0` disables new history records.

The proxy writes access history every 60 seconds and once more during graceful shutdown. A forced process termination can lose the most recent interval.

## Back up

:::caution
Backups of `machines.json` or a paired client's `config.toml` contain shutdown credentials. Encrypt the backup, restrict access to it, and never publish these files with diagnostic bundles.
:::

1. Stop the proxy or system service so files do not change during the copy.
2. Copy `config.toml`, `machines.json`, and `access_history.json` to the backup location.
3. Start the proxy again.

On Linux:

```sh
sudo wakezilla service stop --mode proxy
sudo cp -a /etc/wakezilla/config.toml /var/lib/wakezilla /path/to/backup/
sudo wakezilla service start --mode proxy
```

## Restore

1. Stop the proxy.
2. Restore the files to the paths declared by the configuration.
3. Preserve ownership and permissions required by the service manager.
4. Start the proxy and inspect its logs for parsing errors.

After restoring a client or proxy from different points in time, the stored keys may no longer match. Open the machine detail page, choose **Reconfigure security** if necessary, run the current command on the target, and wait for verification.

## Uninstall behavior

`wakezilla uninstall` removes services, their protected executable copies, and setup-managed Windows Firewall rules. It intentionally leaves configuration, data, and logs in place. Remove those files separately only after taking any required backup.
