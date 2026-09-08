# Documentation screenshots

The web-dashboard screenshots were refreshed on 2026-09-08 from the running application at `http://192.168.1.200:3000/`. They show the actual interface, not a mockup.

| Source PNG | Captured state | Used by |
| --- | --- | --- |
| `dashboard-overview.png` | Loaded overview and registered machine cards | Web Dashboard |
| `dashboard-add-machine.png` | Expanded Client settings and an unsaved Jellyfin example | Web Dashboard, Quick Start |
| `machine-detail.png` | Existing Pc gamer machine, verified client, and Ollama service | Web Dashboard |
| `secure-shutdown-setup.png` | Existing Ubuntu client after verification | Quick Start, Secure Shutdown |
| `machine-history.png` | Existing services with no access records yet | Web Dashboard |
| `network-scanner.png` | Interface selection before starting a scan | Network Scanner |

The PNG files are kept in `docs/public/images/`. `npm run images` generates the WebP copies used by the documentation. Each screenshot has descriptive alt text, explicit dimensions, lazy loading, and asynchronous decoding. `npm run verify:docs` checks the generated files, dimensions, usage, current control names, and local links.

No machine was added, edited, removed, woken, or shut down for these captures. The example form was not submitted. No network scan, key rotation, or client setup command was executed. The capture process rejected state-changing API requests and scans; none were attempted during the final capture. Visible command and password blocks are masked if present.

Both existing clients were already configured. The setup screenshot therefore shows the real completed state instead of generating a new credential solely for documentation. The text explains the pending setup steps separately. The history screenshot shows the actual empty history instead of generating example traffic.

The existing `setup-select-mode.png`, `setup-proxy-port.png`, `setup-confirm.png`, and `tray-icon.png` captures are retained. They illustrate the terminal setup and tray, not the redesigned web interface. No installer or operating-system service was run to recapture them.

Browser capture and validation scripts for this refresh are in `/tmp/wakezilla-docs-refresh-A72FNi/`. These temporary files are local evidence, not a required part of the build. The live interface was the primary reference; related behavior was also checked in the `design-improvements` product worktree at `/home/doggao/code/wakezilla.feature-casaos-design/`. The product's main worktree still contains the earlier interface.
