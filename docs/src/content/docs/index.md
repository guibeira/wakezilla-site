---
title: Wakezilla Documentation
description: Wake machines on demand, proxy traffic in both directions, and power them down after inactivity.
template: splash
hero:
  tagline: Wake a machine when traffic arrives, return the response, and power it down when the work is done.
  actions:
    - text: Install Wakezilla
      link: ./getting-started/installation/
      icon: right-arrow
      variant: primary
    - text: How it works
      link: ./getting-started/how-it-works/
      icon: open-book
---

Wakezilla is a Wake-on-LAN and TCP reverse proxy toolkit for machines that do not need to stay powered on all day.

## One connection, both directions

When a connection reaches a configured local port, Wakezilla checks the target machine, wakes it when necessary, and waits until the target service is reachable. It then forwards traffic to the target and sends the target's response back to the original client over the same connection.

Every accepted connection refreshes the machine's inactivity timer. If no new connection arrives during the configured period—for example, **60 minutes**—Wakezilla asks the client service on that machine to shut it down.

## Start here

- Follow [Installation](./getting-started/installation/) to install the command-line application.
- Read [Quick Start](./getting-started/quick-start/) to configure your first machine and port.
- Open [How Wakezilla Works](./getting-started/how-it-works/) for the complete request-and-response lifecycle.

:::caution
Run Wakezilla on a trusted network. Restrict access to the dashboard and client shutdown endpoint if they could otherwise be reached from an untrusted network.
:::
