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

The target service may take longer to start than the machine itself. Confirm that the target IP and target port are correct, then check whether the service is reachable directly from the proxy host after boot.

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

## The network scanner finds nothing

Windows release builds do not currently include ARP scanning. On Linux or macOS, raw socket permissions may require elevated privileges. Also verify that Wakezilla is scanning the expected LAN interface.

## Inspect logs

Run Wakezilla in a terminal while reproducing the problem. Logs include wake packets, target connection attempts, proxy activity, shutdown requests, errors, and warnings.

For an installed service, use:

```sh
wakezilla service logs
```

Add `-f -n 100` to follow the latest 100 log lines on supported systems.
