import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';
import type { Loader, LoaderContext } from 'astro/loaders';

// Markdown/MDX extensions Starlight's docs collection recognizes.
const docsExtensions = ['markdown', 'mdown', 'mkdn', 'mkd', 'mdwn', 'md', 'mdx'];

/**
 * Folder at the repo root where not-yet-released content is staged. It mirrors
 * the layout of `src/content/docs/`, e.g. `_docs_upcoming/weekly_materials/week02.md`
 * is previewed at `/weekly_materials/week02/`.
 */
const UPCOMING_DIR = '_docs_upcoming';

/**
 * Wraps the loader store so the upcoming-content glob can be layered on top of
 * the real docs without clobbering them:
 *   - `keys()` returns nothing, so the glob never treats already-loaded docs
 *     entries as "untouched" and deletes them at the end of its pass.
 *   - `set()` refuses to overwrite a slug that already exists, so anything that
 *     is already live in `src/content/docs/` always wins over a staged duplicate
 *     (e.g. once Week 1 ships, the staged `_docs_upcoming/.../week1` is ignored).
 */
function overlayStore(store: LoaderContext['store']): LoaderContext['store'] {
  return new Proxy(store, {
    get(target, prop) {
      if (prop === 'keys') return () => [];
      if (prop === 'set') {
        return (entry: Parameters<LoaderContext['store']['set']>[0]) =>
          target.has(entry.id) ? false : target.set(entry);
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });
}

/**
 * Builds the context for the staged-content pass: the overlay store above, plus
 * a logger that swallows the glob loader's "Duplicate id … will overwrite"
 * warning. That warning is misleading here — `overlayStore` keeps the live entry,
 * so a staged duplicate never wins — and printing it on every dev start would
 * suggest the opposite.
 */
function overlayContext(context: LoaderContext): LoaderContext {
  return {
    ...context,
    store: overlayStore(context.store),
    logger: new Proxy(context.logger, {
      get(target, prop) {
        if (prop === 'warn') {
          return (message: string) =>
            message.includes('Duplicate id') ? undefined : target.warn(message);
        }
        const value = Reflect.get(target, prop, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    }),
  };
}

/**
 * Loader for the Starlight `docs` collection.
 *
 * Production builds (`astro build`, which is what the GitHub Pages workflow
 * runs) use Starlight's stock loader, so ONLY `src/content/docs/` is published.
 *
 * The dev server (`astro dev`) additionally layers in `_docs_upcoming/` so you
 * can preview staged content locally. Because those files live outside
 * `src/content/docs/` and are only loaded when `import.meta.env.DEV` is true,
 * there is no code path that can leak them onto the live site.
 */
function docsWithUpcomingLoader(): Loader {
  const base = docsLoader();
  if (!import.meta.env.DEV) return base;

  const upcoming = glob({
    base: UPCOMING_DIR,
    pattern: `**/[^_]*.{${docsExtensions.join(',')}}`,
  });

  return {
    name: 'starlight-docs-loader-with-upcoming',
    load: async (context: LoaderContext) => {
      await base.load(context);
      await upcoming.load(overlayContext(context));
    },
  };
}

export const collections = {
  docs: defineCollection({ loader: docsWithUpcomingLoader(), schema: docsSchema() }),
};
