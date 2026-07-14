import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://wakezilla.dev',
  base: '/docs',
  outDir: '../dist/docs',
  integrations: [
    starlight({
      title: 'Wakezilla',
      description: 'Wake, route, and power down your machines automatically.',
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
          label: 'Configuration',
          items: [
            { label: 'Machines', slug: 'configuration/machines' },
            { label: 'Port Forwarding', slug: 'configuration/port-forwarding' },
            { label: 'Inactivity Timeout', slug: 'configuration/inactivity-timeout' },
          ],
        },
        {
          label: 'Help',
          items: [{ label: 'Troubleshooting', slug: 'help/troubleshooting' }],
        },
      ],
    }),
  ],
});
