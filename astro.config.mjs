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
        // Left sidebar shows weekly navigation.
        Sidebar: './src/components/Sidebar.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/albertkun/26SU-ASIAAM-191A' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/TdXbxxpqs' },
      ],
      editLink: {
        baseUrl: 'https://github.com/albertkun/26SU-ASIAAM-191A/edit/main/',
      },
      pagination: false,
      sidebar: [
        {
          label: 'Weekly Materials',
          autogenerate: { directory: 'weekly_materials' },
        },
        {
          label: 'Assignments',
          autogenerate: { directory: 'assignments' },
        },
        {
          label: 'Labs',
          autogenerate: { directory: 'labs' },
        },
        {
          label: 'Help',
          autogenerate: { directory: 'help' },
        },
        {
          label: 'Syllabus',
          items: [{ label: 'Syllabus', link: '/syllabus/' }],
        },
      ],
    }),
  ],
});
