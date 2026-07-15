---
title: Troubleshooting
description: Diagnose common Wake-on-LAN, proxy, scanning, and shutdown problems.
---

## The machine does not wake

- Verify that the saved MAC address belongs to the target's active network interface.
- Enable Wake-on-LAN in the target's BIOS or UEFI and operating system.
- Prefer a wired Ethernet connection; Wake-on-Wireless support is uncommon.
- Check that the proxy host can broadcast the Wake-on-LAN packet on the target network.
- Confirm that a firewall or VLAN rule is not blocking the required traffic.

## The first connection fails

The target service may take longer to start than the machine itself. Wakezilla waits up to 60 seconds, then closes the original connection. Confirm the target IP and port, wait for the service, and reconnect.

If direct access works but proxied access does not, verify that the selected local port is free and allowed through the proxy host's firewall.

## The caller does not receive a response

- Confirm that the target service sends a response over the same TCP connection.
- Test the target service directly from the proxy machine.
- Verify the target port in the forwarding rule.
- Check both host firewalls and any network policies between proxy and target.

Wakezilla forwards traffic bidirectionally. A missing response normally indicates that the target service is unavailable, the target port is wrong, or return traffic is blocked.

## Automatic shutdown does not run

- Confirm that remote shutdown is enabled for the machine.
- Verify the turn-off port, normally `3001`.
- Open `http://<target-ip>:3001/health` from the proxy host.
- Check that no new connections are reaching any configured port for the machine.
- Confirm that the inactivity period is expressed in minutes.
- Confirm that the machine has at least one port forward; the current monitor is initialized by a forwarder.

Wakezilla makes one request per activity window. If that request fails, create a new accepted proxy connection to reset the state before testing again.

## A powered-on machine appears offline

Dashboard and TUI status checks the Wakezilla client, not general host reachability. Start the client and verify `http://<target-ip>:<turn-off-port>/health`. Without a configured turn-off port, status uses `3001`.

## The network scanner finds nothing

Windows release builds do not currently include ARP scanning. On Linux or macOS, raw socket permissions may require elevated privileges. Also verify that Wakezilla is scanning the expected LAN interface.

## A configured server port is ignored

The current `proxy-server --port` and `client-server --port` arguments are not applied. Set `WAKEZILLA__SERVER__PROXY_PORT`, `WAKEZILLA__SERVER__CLIENT_PORT`, or the matching `config.toml` values.

The current browser client also assumes API port `3000` when opened from an explicit port. See [Known Limitations](./known-limitations/).

## The proxy cannot bind a local port

Each local forwarding port must be unique and unused on the proxy host. Inspect logs for `Failed to bind TCP listener`, then choose another local port or stop the conflicting process.

## Configuration changes have no effect

Check the startup line that reports proxy, client, Wake-on-LAN, and storage values. If `config.toml` cannot be parsed, Wakezilla logs a warning and starts with built-in defaults. Environment variables must use a double underscore between sections and keys.

## Inspect logs

Run Wakezilla in a terminal while reproducing the problem. Logs include wake packets, target connection attempts, proxy activity, shutdown requests, errors, and warnings.

For an installed service, use:

```sh
wakezilla service logs
```

Add `-f -n 100` to follow the latest 100 log lines on supported systems.

See [Logs](./logs/) for platform-specific sources and `RUST_LOG=debug`.
