# Project Context: One to Grow On

Static Astro site for the One to Grow On podcast, deployed on Cloudflare Pages with
audio in Cloudflare R2. The Gatsby/WordPress migration is finished; the site is in
maintenance mode. Remaining launch tasks are listed in `README.md`.

## Rules

1. **Read the file before editing it.** Don't assume structure.
2. **Run `pnpm build` after every change** and confirm it passes.
3. **Use `.astro` components.** Don't add React components unless strictly necessary.
4. **No WordPress.** The WP backend is retired. Never fetch from it. If you find a
   `wp-json` or `12go.onetogrowonpod.com` URL in `src/` or a post body, flag it and
   remove it. The `guid` frontmatter values are the one exception (see below).

## Content

- **Source:** one directory per post in `./posts/`, each with an `index.md`.
- **Schema:** `src/content.config.ts`.
- **Access:** `getCollection('posts')`. Never `fetch()` posts.
- **URLs come from the frontmatter `slug`,** not the directory name. The two differ
  for 29 posts. Changing a slug changes a public URL; no per-post redirects exist.

## Audio (Cloudflare R2)

- **Host:** `https://pub-95244d2d82644d35bb2d737bd39a6f4f.r2.dev/` for every post.
  Published feeds reference it, so keep it enabled even if a custom domain is added.
- **Planned, not set up:** `cdn.onetogrowonpod.com` as an R2 custom domain. It has no
  DNS record yet. Requires the DNS zone to be on Cloudflare.
- **Metadata:** `audioSize` and `duration` in frontmatter must match the actual file.
  `scripts/backfill-audio-meta.sh` populates them.
- **Player:** the existing `media-chrome` component, `src/components/AudioPlayer.astro`.

## RSS Feed

- **Source:** `src/pages/feed/podcast/index.xml.ts`, built to `/feed/podcast/index.xml`.
- **Old URL:** `/feed/podcast/` 301s to the file. Configured in `astro.config.mjs`
  `redirects` (dev) and `public/_redirects` (Cloudflare Pages). Keep both in sync.
- **Items:** posts categorized `episodes` or `promo` that have `audio` and whose slug
  does not end in `-transcript`. Currently 69.
- **GUID stability:** each post's `guid` holds the original WP GUID (`?p=NNNN`),
  emitted with `isPermaLink="false"`. Never change these. Podcast apps use them to
  dedupe episodes, and a changed GUID re-shows the episode as new.
- **Authors:** every item emits `itunes:author`, from the post's optional `author`
  frontmatter or the show default `Hallie Casey, Chris Casey`. 26 posts credit
  Catherine Arjet, backfilled from the old feed.
- **Show GUID:** `podcast:guid` is a constant in the feed source, derived from the
  canonical feed URL. Never change it, even if the feed URL changes.
- **Transcripts:** a `transcripts` post is linked from its episode as
  `podcast:transcript` (HTML), paired by leading episode number or by slug minus
  `-transcript`. The build fails if a transcript post matches no feed episode.
- **Reference snapshot:** `archive/feed.xml` is the final WP feed, kept for diffing GUIDs.

## Posts Without Audio (Intentional)

These 5 posts are categorized as `episodes` but have no audio file. This is expected:

- `conservation-reserve-program-green-new-deal-follow-up` — blog post follow-up
- `amaranth-to-zinnias-with-gretchen-o-neil-hothouse` — FFP cross-promo
- `native-farmers-in-new-mexico-toasted-sister` — FFP cross-promo
- `oysters-real-oyster-cult-american-folk-revival-sourceress` — FFP cross-promo
- `39-good-food-and-supply-chains-transcript-with-familyfarmed` — transcript edge case

## Gotchas

- **Never keep two byte-identical images in `src/assets/`.** They hash to the same
  output filename. If one copy is used only through `<Image />` and the other is
  linked by `.src` (as the press page download links are), Astro can prune the
  original from the build and the link 404s. It works in dev, and can be
  intermittent in builds. Import a single copy from both places.
- **Verify links against `dist/`, not the dev server,** for the reason above.

## File Locations

| Purpose             | Path                                  |
| ------------------- | ------------------------------------- |
| Content schema      | `src/content.config.ts`               |
| Markdown posts      | `./posts/*/index.md`                  |
| Base layout         | `src/layouts/BaseLayout.astro`        |
| Page layout         | `src/layouts/PageLayout.astro`        |
| Post list component | `src/components/Posts.astro`          |
| Single post page    | `src/pages/[slug].astro`              |
| Tag pages           | `src/pages/tag/[tag].astro`           |
| About page          | `src/pages/about.astro`               |
| Press page          | `src/pages/press.astro`               |
| Transcripts page    | `src/pages/transcripts.astro`         |
| Collaborations page | `src/pages/collaborations.astro`      |
| RSS feed            | `src/pages/feed/podcast/index.xml.ts` |
| Redirects           | `public/_redirects`                   |
| Site metadata       | `src/constants/metadata.ts`           |
| Astro config        | `astro.config.mjs`                    |
| Migration records   | `archive/` (historical, do not update) |
