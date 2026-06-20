import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://albertkun.github.io',
  base: '/26SU-ASIAAM-191A',
  vite: {
    server: {
      watch: {
        // Use polling to avoid EMFILE (too many open files) on systems with low inotify limits
        usePolling: true,
        interval: 500,
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
  },
  integrations: [
    starlight({
      title: 'AA191A',
      tagline: 'Web Development & GIS for Social Change',
      logo: {
        src: './src/assets/favicon.png',
      },
      customCss: ['./src/styles/custom.css'],
      components: {
        // Adds the horizontal top navigation bar (class-site style).
        Header: './src/components/Header.astro',
        // Left sidebar shows the page table of contents instead of site nav.
        Sidebar: './src/components/Sidebar.astro',
        // Removes the right-hand "On this page" panel (TOC moved to the left).
        TwoColumnContent: './src/components/TwoColumnContent.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/albertkun/26SU-ASIAAM-191A' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/TdXbxxpqs' },
      ],
      editLink: {
        baseUrl: 'https://github.com/albertkun/26SU-ASIAAM-191A/edit/main/',
      },
      // No site-nav sidebar: the main sections live in the top navigation bar
      // (Header.astro) and the left sidebar shows the page's table of contents
      // (Sidebar.astro).
      sidebar: [],
    }),
  ],
});
