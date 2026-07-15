---
title: Platform Behavior
description: Differences in installation, services, scanning, remote power, and desktop support.
---

Wakezilla supports Linux, macOS, and Windows, but operating-system integrations are not identical.

## Feature matrix

| Feature | Linux | macOS | Windows |
| --- | --- | --- | --- |
| Proxy and client servers | Yes | Yes | Yes |
| Direct Wake-on-LAN | Yes | Yes | Yes |
| Network scanner | Yes, raw-socket permission required | Yes, raw-socket permission required | No |
| Service manager | systemd | launchd LaunchDaemon | Windows Service Manager |
| Setup-managed firewall | No | No | Inbound TCP rule |
| Desktop tray | GNU desktop builds | Menu-bar application | System tray application |
| Inactivity power action | Suspend, then shutdown fallback | Shut down | Hibernate |

## Remote power behavior

The client waits five seconds after accepting a remote power request.

- Linux runs `systemctl suspend`. If suspend fails, it runs `shutdown -h now`.
- macOS asks System Events to shut down the computer.
- Windows runs `shutdown /h`, which hibernates the computer.

Wake-on-LAN after suspend or hibernation depends on firmware, network adapter, operating-system power settings, and driver support. Test the complete sleep-and-wake cycle before enabling automatic inactivity actions.

## Network scanning

Linux and macOS use ARP through a raw network socket. Run the proxy with suitable privileges when scanning fails with a permission error.

Windows builds return an error because the current scanner backend requires an external Npcap or WinPcap SDK at build time. Manual machine registration remains available.

## Release targets

The Unix installation script detects x86_64 and ARM64 releases for Linux GNU, Linux musl, and macOS. The PowerShell installer currently supports x64 Windows.

Linux musl packages keep the primary executable free of desktop library requirements. A separate desktop helper may be included for tray support and requires GTK/AppIndicator runtime libraries.

## Related

- [Installation](../getting-started/installation/)
- [Network Scanner](../guides/network-scanner/)
- [System Services](../guides/system-services/)
- [Desktop Tray](../guides/desktop-tray/)
