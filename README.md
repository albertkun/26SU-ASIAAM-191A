# 26SU-ASIAAM-191A Class Repository

[![Discord](https://img.shields.io/badge/Discord-Chat-blue.svg?logo=discord&logoColor=white)](https://discord.gg/TdXbxxpqs)

Welcome to the AA191A — Web Development & GIS for Social Change class repository!

This site is built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Staging upcoming content

Content for weeks that haven't been released yet lives in `_docs_upcoming/`,
which mirrors the layout of `src/content/docs/` (e.g.
`_docs_upcoming/weekly_materials/week02.md` previews at `/weekly_materials/week02/`).

- **Local dev (`npm run dev`)** loads `_docs_upcoming/` so you can preview staged
  pages before they go live.
- **Production (`npm run build`, which is what the GitHub Pages deploy runs)**
  ignores `_docs_upcoming/` entirely — staged pages never reach the live site.

This is wired up in [`src/content/config.ts`](src/content/config.ts): the staged
folder is only loaded when `import.meta.env.DEV` is true. When a week is ready to
publish, move its folder from `_docs_upcoming/` into `src/content/docs/`. If a
slug exists in both places, the live `src/content/docs/` version wins.

Note: while the dev server is running, *deleting* a staged file won't disappear
from the preview until you restart `npm run dev` (adds and edits hot-reload fine).
