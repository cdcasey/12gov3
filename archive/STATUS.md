Here's the status against the migration plan:

  Done (based on git history + current state)

  - ✅ P0: astro.config.mjs — site set, sitemap integration added
  - ✅ P0: Verify markdown posts — posts exist, build works
  - ✅ P0: Cloudflare Pages deployment — implied by PRs being merged
  - ✅ P1: FooterTags — no more WP fetch in components
  - ✅ P1: /about page — exists (but still has WP image URLs)
  - ✅ P1: /transcripts page — exists (with dirty uncommitted changes)
  - ✅ P1: /collaborations page — exists
  - ✅ P2: Sitemap — integrated (#26)
  - ✅ P2: OG/Twitter images — fixed (#25), no WP URLs in layouts
  - ✅ P2: Audio hosting on R2 — audio on R2 (#27, #29)
  - ✅ P3: Gatsby files removed — no .jsx pages or gatsby-config.js

  Remaining

  ┌────────────────────────────┬──────────┬───────────────────────────────────────────────────────┐
  │            Task            │ Priority │                         Issue                         │
  ├────────────────────────────┼──────────┼───────────────────────────────────────────────────────┤
  │ About page images          │ P2       │ 4 WP image URLs in about.astro                        │
  ├────────────────────────────┼──────────┼───────────────────────────────────────────────────────┤
  │ Podcast feed image         │ P2       │ 1 WP URL in feed/podcast/index.xml.ts                 │
  ├────────────────────────────┼──────────┼───────────────────────────────────────────────────────┤
  │ RSS feed redirect verify   │ P3       │ static/_redirects — needs manual verification on prod │
  ├────────────────────────────┼──────────┼───────────────────────────────────────────────────────┤
  │ Finalize markdown content  │ P3       │ Final review of all post frontmatter                  │
  ├────────────────────────────┼──────────┼───────────────────────────────────────────────────────┤
  │ Clean up transcripts.astro │ —        │ Dead variables + quote noise in uncommitted diff      │
  └────────────────────────────┴──────────┴───────────────────────────────────────────────────────┘

  The commented-out WP fetch in [slug].astro is dead code — minor cleanup.

  Bottom line: You're closer to 95% than 80%. The remaining work is asset URL migration (about page images, feed image)
  and final content review. The heavy lifting is done.

  What do you want to tackle first — the WP image URLs, or something else?