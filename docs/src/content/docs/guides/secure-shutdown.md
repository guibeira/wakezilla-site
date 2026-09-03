---
title: Secure Shutdown
description: Pair a target client with the proxy so only authenticated Wakezilla requests can power it down.
---

Wakezilla can pair each target client with its proxy using a unique 256-bit key. After pairing, shutdown requests are signed with HMAC-SHA256 and the client rejects requests with an invalid signature, an expired timestamp, or a reused nonce.

This protects the destructive target-side action from unauthenticated callers. The proxy dashboard and API remain separate trust boundaries and should still be restricted to a trusted network, VPN, or authenticated gateway. See [Security](/docs/reference/security/).

## Pair a new client

### 1. Register the target

In the proxy dashboard, add the target machine and enable **Allow remote turn off**. Keep the default client port `3001` unless you intend to run the client on a different port.

After the machine is saved, its detail page opens with **Finish setting up your client server** at the top. Wakezilla generates a different key for every machine and includes it in the displayed configuration command.

### 2. Install Wakezilla on the target

The setup card displays the installation command before the configuration command. Run the command for the target platform if Wakezilla is not already installed.

For Linux and macOS:

```sh
curl -fsSL https://wakezilla.dev/install.sh | sh
```

For Windows, open PowerShell as Administrator:

```powershell
irm https://wakezilla.dev/install.ps1 | iex
```

### 3. Configure the client server

Copy the generated command from step 2 of the setup card and run it on the target. It has this shape:

```sh
sudo wakezilla setup --mode client --port 3001 --key <generated-key> --yes
```

On Windows, run the same command from an Administrator terminal without `sudo`.

:::caution
The generated command contains the machine's shutdown credential. Treat it as a secret: do not share it, commit it, or leave it in logs. Restrict access to the dashboard while the command is visible.
:::

### 4. Wait for verification

Keep the machine detail page open. The dashboard automatically sends an authenticated request to the client's secure health endpoint. When the keys match, the setup state changes to **verified** and the **Turn off machine** control becomes available.

The regular `/health` endpoint remains public so Wakezilla can report whether the client is reachable. Verification uses the authenticated `/health/secure` endpoint instead.

## Setup states

| State | Meaning | Next action |
| --- | --- | --- |
| `disabled` | Remote shutdown is not enabled for this machine. | Enable remote shutdown if needed. |
| `legacy` | The client accepts older unsigned shutdown requests. | Choose **Secure now**, then run the generated command. |
| `pending` | A key exists, but the client has not proved it is using that key. | Run the generated command and leave the page open. |
| `verified` | The proxy and client share the same key. | No action is required. |
| `unreachable` | The proxy could not reach the client. | Start the client and check its IP, port, firewall, and service status. |
| `key_mismatch` | The client responded with a different key. | Run the currently displayed setup command again. |

The dashboard only shows **Turn off machine** for `legacy` and `verified` clients. New secure clients must be verified before the control appears.

## How requests are authenticated

For each secure health or shutdown request, the proxy creates a timestamp and a random nonce. It signs this exact newline-delimited payload with the machine key:

```text
wakezilla-v1
<UPPERCASE_METHOD>
<path>
<timestamp>
<nonce>
```

It sends the timestamp, nonce, and resulting signature in these headers:

- `x-wakezilla-timestamp`;
- `x-wakezilla-nonce`;
- `x-wakezilla-signature`.

The client reconstructs the same HMAC-SHA256 signature and compares it with the request. It accepts timestamps within 60 seconds and remembers recent nonces so a captured request cannot be replayed.

Keep the proxy and target clocks synchronized. A clock difference greater than 60 seconds causes authentication to fail even when the key is correct.

## Secure a legacy client

Machines created before secure shutdown can appear as `legacy`. They continue to work with unsigned requests for compatibility, but should be migrated:

1. Open the machine detail page.
2. Choose **Secure now**.
3. Run the new configuration command on the target.
4. Wait for the dashboard to report `verified`.

Once the key is configured, that client no longer accepts unsigned secure health or shutdown requests.

## Rotate or replace a key

Choose **Reconfigure security** on a verified machine to generate a new key. Rotation immediately changes the key stored by the proxy and returns the machine to `pending`, so shutdown requests will not work until the new command is run on the target and verification succeeds.

Rotate the key if the setup command, client configuration, proxy machine database, or a backup containing either file may have been exposed.

## Troubleshooting

- **The setup stays unreachable:** verify the target is powered on, the client service is running, and TCP `3001` is allowed from the proxy.
- **The setup reports key mismatch:** run the command currently shown in the dashboard; an older copied command may contain a previous key.
- **Authentication fails intermittently:** synchronize the proxy and target clocks.
- **The shutdown control is missing:** finish verification, or confirm that remote shutdown is enabled for the machine.

See [Web Dashboard](/docs/guides/web-dashboard/) for the complete machine workflow, [System Services](/docs/guides/system-services/) for client service controls, and [HTTP API](/docs/reference/http-api/) for endpoint details.
