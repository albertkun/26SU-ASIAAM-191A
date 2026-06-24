import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { visit, SKIP } from 'unist-util-visit';

// ── rehype: ==text== → <mark>text</mark> ──────────────────────────────────
function rehypeMarkHighlight() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre')) return SKIP;
      if (node.type !== 'text' || !node.value.includes('==')) return;

      const regex = /==(.*?)==/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        parts.push({ type: 'element', tagName: 'mark', properties: {}, children: [{ type: 'text', value: match[1] }] });
        lastIndex = regex.lastIndex;
      }

      if (parts.length === 0) return;
      if (lastIndex < node.value.length) parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      }
    });
  };
}

// ── rehype: :icon-name: → <iconify-icon> (Octicons / MDI / FA Brands) ─────
// Keys use hyphens; underscores in source text are normalised on lookup.
// Icon names follow Iconify's naming: set-name:icon-name
const ICON_MAP = {
  'octicons-broadcast-16':             { icon: 'octicon:broadcast-16',                title: 'Go Live' },
  'octicons-plus-16':                  { icon: 'octicon:plus-16',                     title: 'New' },
  'octicons-copy-16':                  { icon: 'octicon:copy-16',                     title: 'Copy' },
  'material-microsoft-visual-studio-code': { icon: 'mdi:microsoft-visual-studio-code', title: 'VS Code' },
  'material-file-multiple':            { icon: 'mdi:file-multiple',                   title: 'Explorer' },
  'material-folder-plus':              { icon: 'mdi:folder-plus',                     title: 'New Folder' },
  'material-file-plus':                { icon: 'mdi:file-plus',                       title: 'New File' },
  'fontawesome-brands-firefox-browser':{ icon: 'fa6-brands:firefox-browser',          title: 'Firefox' },
  'smile':                             { icon: 'twemoji:slightly-smiling-face',       title: '' },
  'man-facepalming-tone1':             { icon: 'twemoji:person-facepalming',          title: '' },
};

function rehypeIcons() {
  const ICON_RE = /:([\w-]+):/g;
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre')) return SKIP;
      if (node.type !== 'text' || !node.value.includes(':')) return;

      const rx = new RegExp(ICON_RE.source, 'g');
      const parts = [];
      let lastIndex = 0;
      let hadMatch = false;
      let match;

      while ((match = rx.exec(node.value)) !== null) {
        const key = match[1].replace(/_/g, '-');
        const icon = ICON_MAP[key];
        if (!icon) continue;

        hadMatch = true;
        if (match.index > lastIndex) parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });

        // <iconify-icon> is a custom element — HAST passes unknown properties
        // through as HTML attributes, so `icon` becomes icon="..." in output.
        parts.push({
          type: 'element',
          tagName: 'iconify-icon',
          properties: {
            icon: icon.icon,
            title: icon.title || undefined,
            className: ['doc-icon'],
          },
          children: [],
        });
        lastIndex = rx.lastIndex;
      }

      if (!hadMatch) return;
      if (lastIndex < node.value.length) parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      }
    });
  };
}

// ── rehype: ++key+combo++ → <kbd> elements ───────────────────────────────
const KEY_LABELS = {
  ctrl: 'Ctrl', cmd: '⌘', alt: 'Alt', shift: 'Shift',
  enter: 'Enter', escape: 'Esc', tab: 'Tab',
  s: 'S', v: 'V', c: 'C', z: 'Z', a: 'A',
};

function rehypeKbd() {
  const KBD_RE = /\+\+(\w+(?:\+\w+)*)\+\+/g;
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre')) return SKIP;
      if (node.type !== 'text' || !node.value.includes('++')) return;

      const rx = new RegExp(KBD_RE.source, 'g');
      const parts = [];
      let lastIndex = 0;
      let hadMatch = false;
      let match;

      while ((match = rx.exec(node.value)) !== null) {
        hadMatch = true;
        if (match.index > lastIndex) parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });

        const keys = match[1].split('+').map(k => k.trim().toLowerCase());
        const kbdChildren = [];
        keys.forEach((k, i) => {
          const label = KEY_LABELS[k] ?? (k.charAt(0).toUpperCase() + k.slice(1));
          kbdChildren.push({ type: 'element', tagName: 'kbd', properties: {}, children: [{ type: 'text', value: label }] });
          if (i < keys.length - 1) kbdChildren.push({ type: 'text', value: ' + ' });
        });

        parts.push({ type: 'element', tagName: 'span', properties: { className: ['kbd-combo'] }, children: kbdChildren });
        lastIndex = rx.lastIndex;
      }

      if (!hadMatch) return;
      if (lastIndex < node.value.length) parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      }
    });
  };
}

// ── rehype: strip {: style="..."} MkDocs attribute syntax ─────────────────
function rehypeMkDocsAttrs() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const match = node.value.match(/^\s*\{:\s*style="([^"]+)"\}\s*$/);
      if (!match) return;
      const prev = parent.children[index - 1];
      if (prev && prev.type === 'element') {
        prev.properties = prev.properties ?? {};
        prev.properties.style = (prev.properties.style ? prev.properties.style + ';' : '') + match[1];
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}

export default defineConfig({
  site: 'https://albertkun.github.io',
  base: '/26SU-ASIAAM-191A',
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 500,
        ignored: ['**/node_modules/**', '**/.git/**'],
      },
    },
  },
  markdown: {
    rehypePlugins: [
      rehypeMarkHighlight,
      rehypeIcons,
      rehypeKbd,
      rehypeMkDocsAttrs,
    ],
  },
  integrations: [
    starlight({
      title: 'AA191A',
      tagline: 'Web Development & GIS for Social Change',
      logo: {
        src: './src/assets/favicon.png',
      },
      // Load Iconify web component — renders :octicons-x:, :material-x:, :fa6-brands-x: icons
      head: [
        {
          tag: 'script',
          attrs: {
            src: 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js',
            defer: true,
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Header: './src/components/Header.astro',
        Sidebar: './src/components/Sidebar.astro',
        TwoColumnContent: './src/components/TwoColumnContent.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/albertkun/26SU-ASIAAM-191A' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/TdXbxxpqs' },
      ],
      editLink: {
        baseUrl: 'https://github.com/albertkun/26SU-ASIAAM-191A/edit/main/',
      },
      pagination: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      sidebar: [
        { label: 'Weekly Materials', autogenerate: { directory: 'weekly_materials' } },
        { label: 'Labs', autogenerate: { directory: 'labs' } },
        {
          label: 'Assignments',
          items: [
            { label: 'Week 0', link: '/assignments/week0/' },
            {
              label: 'Week 1',
              items: [
                { label: 'Pre-Lab #1', link: '/assignments/week1/prelab/' },
                { label: 'Weekly Reading #1', link: '/assignments/week1/reading/' },
                { label: 'Thinking Cap #1', link: '/assignments/week1/thinking_cap/' },
              ],
            },
          ],
        },
        { label: 'Help', autogenerate: { directory: 'help' } },
      ],
    }),
  ],
});
