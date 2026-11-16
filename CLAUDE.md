# Project Context: One to Grow On (Migration)

**Role:** Senior Frontend Migration Specialist
**Goal:** Finalize migration from Gatsby to Astro (Cloudflare Pages + R2).
**Current Status:** ~95% Complete. See `TODO.md` for remaining work.

## 🛡️ CRITICAL WORKFLOW PROTOCOLS

1.  **Filesystem Strictness:**
    - Content lives in `./posts/` (verified, glob loader configured).
    - Source code is in `src/`.
    - **Do not** create new React components unless strictly necessary. Use `.astro`.
2.  **No Hallucinations:**
    - Read the relevant file before editing it. Don't assume structure.
    - Do not fetch from WordPress. The WP backend is being retired.
3.  **Always verify the build passes** after making changes: `pnpm build`

## 🔁 Tech Stack & Rules

### 1. Data & Content

- **Source:** Markdown files in `./posts/`.
- **Schema:** Defined in `src/content.config.ts`.
- **Access:** Use `getCollection('posts')`. Never use `fetch()` for posts.
- **Legacy Cleanup:** If you see `fetch('.../wp-json/...')`, flag it and remove it.

### 2. Assets (Cloudflare R2)

- **Audio (dev):** `https://pub-95244d2d82644d35bb2d737bd39a6f4f.r2.dev/`
- **Audio (prod):** `https://cdn.onetogrowonpod.com/...` (custom domain on R2)
- **Player:** Use the existing `media-chrome` player component.

### 3. RSS Feed

- **Path:** `/feed/podcast/` (`src/pages/feed/podcast/index.xml.ts`)
- **Schema fields used:** `date`, `excerpt`, `audio`, `audioSize`, `duration`, `categories`, `slug`, `guid`
- **GUID stability:** each post's `guid` frontmatter holds the original WP GUID (`?p=NNNN`),
  emitted with `isPermaLink="false"`. Never change these — podcast apps use them to
  dedupe episodes.
- **Reference snapshot:** `feed.xml` in the project root is the final WP feed for diffing.

### 4. Posts Without Audio (Intentional)

These 5 posts are categorized as "episodes" but have no audio file — this is expected:

- `conservation-reserve-program-green-new-deal-follow-up` — blog post follow-up
- `amaranth-to-zinnias-with-gretchen-o-neil-hothouse` — FFP cross-promo
- `native-farmers-in-new-mexico-toasted-sister` — FFP cross-promo
- `oysters-real-oyster-cult-american-folk-revival-sourceress` — FFP cross-promo
- `39-good-food-and-supply-chains-transcript-with-familyfarmed` — transcript edge case

## 🚀 How to Start a Session

1. Read `TODO.md` to find the next open task.
2. Read the target file(s) before writing any code.
3. Make the change, run `pnpm build`, confirm no errors.
4. Mark the task done in `TODO.md`.

## File Locations Reference

| Purpose              | Path                                          |
| -------------------- | --------------------------------------------- |
| Content schema       | `src/content.config.ts`                       |
| Markdown posts       | `./posts/*.md`                                |
| Base layout          | `src/layouts/BaseLayout.astro`                |
| Page layout          | `src/layouts/PageLayout.astro`                |
| Post list component  | `src/components/Posts.astro`                  |
| Single post page     | `src/pages/[slug].astro`                      |
| Tag pages            | `src/pages/tag/[tag].astro`                   |
| About page           | `src/pages/about.astro`                       |
| Transcripts page     | `src/pages/transcripts.astro`                 |
| Collaborations page  | `src/pages/collaborations.astro`              |
| RSS feed             | `src/pages/feed/podcast/index.xml.ts`         |
| Redirects            | `public/_redirects` (does not exist yet — see `TODO.md`) |
| Site metadata        | `src/constants/metadata.ts`                   |
| Astro config         | `astro.config.mjs`                            |
