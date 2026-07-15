import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://wakezilla.dev',
  base: '/docs',
  outDir: '../dist/docs',
  integrations: [
    starlight({
      title: 'Wakezilla',
      description: 'Wake machines on demand, proxy TCP traffic, and return them to a low-power state after inactivity.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      components: {
        SiteTitle: './src/components/SiteTitle.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/guibeira/wakezilla',
        },
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Introduction', slug: '' },
            { label: 'How Wakezilla Works', slug: 'getting-started/how-it-works' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Web Dashboard', slug: 'guides/web-dashboard' },
            { label: 'Secure Shutdown', slug: 'guides/secure-shutdown' },
            { label: 'Machines', slug: 'configuration/machines' },
            { label: 'Port Forwarding', slug: 'configuration/port-forwarding' },
            { label: 'Inactivity Timeout', slug: 'configuration/inactivity-timeout' },
            { label: 'Network Scanner', slug: 'guides/network-scanner' },
            { label: 'System Services', slug: 'guides/system-services' },
            { label: 'Terminal UI', slug: 'guides/terminal-ui' },
            { label: 'Desktop Tray', slug: 'guides/desktop-tray' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'CLI', slug: 'reference/cli' },
            { label: 'Configuration', slug: 'reference/configuration' },
            { label: 'Storage and Backups', slug: 'reference/storage' },
            { label: 'HTTP API', slug: 'reference/http-api' },
            { label: 'Platform Behavior', slug: 'reference/platform-behavior' },
            { label: 'Security', slug: 'reference/security' },
          ],
        },
        {
          label: 'Help',
          items: [
            { label: 'Logs', slug: 'help/logs' },
            { label: 'Updates and Uninstall', slug: 'help/updates-uninstall' },
            { label: 'Known Limitations', slug: 'help/known-limitations' },
            { label: 'Troubleshooting', slug: 'help/troubleshooting' },
          ],
        },
      ],
    }),
  ],
});
