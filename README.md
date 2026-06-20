# 26SU-ASIAAM-191A Class Repository

[![Discord](https://img.shields.io/badge/Discord-Chat-blue.svg?logo=discord&logoColor=white)](https://discord.gg/TdXbxxpqs)

Welcome to the AA191A — Web Development & GIS for Social Change class repository!

This site is built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Local development

This project requires **Node.js 20.19+** (Astro will refuse to run on older versions).
The required version is pinned in [`.nvmrc`](./.nvmrc).

```bash
nvm use        # switches to Node 20 (run `nvm install 20` first if needed)
npm install    # first time only
npm run dev     # start the dev server at http://localhost:4321/26SU-ASIAAM-191A/
```

Other commands:

```bash
npm run build    # build the production site into ./dist
npm run preview  # preview the production build locally
```

## Content

Course content lives in `src/content/docs/`:

- `index.mdx` — home page
- `weekly_materials/` — weekly lecture + lab overviews
- `labs/` — lab walkthroughs
- `assignments/` — assignments (Week 0 onward)
- `help/` — how-to guides
- `syllabus.md` — course syllabus

Content for weeks that haven't started yet is staged in `_docs_upcoming/`
(kept out of the build) and moved into `src/content/docs/` as the course progresses.
