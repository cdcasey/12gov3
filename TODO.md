# One to Grow On — Remaining Migration Tasks

Site is ~99% complete. All local work is done and `pnpm build` passes.
What's left requires deployment / dashboard access / external services.

---

## P2 — Fix Remaining WordPress URLs

### [x] About page images
Originals recovered from the local WP uploads mirror (`~/dev/12goHelpers/wp-content/uploads/`),
copied to `src/assets/about/`, and swapped to `<Image />` components.

### [x] Podcast feed cover image
`<itunes:image>` now points to the site-hosted copy (`public/images/OTGO-1400.jpg`,
verified 1400×1400 JPEG) via `context.site` — resolves to
`https://www.onetogrowonpod.com/images/OTGO-1400.jpg`.

---

## P3 — Cleanup

### [x] Clean up transcripts.astro
Removed unused `PageLayout` import, normalized quotes. (The "uncommitted changes"
mentioned previously had already been committed.)

### [x] Feed URL routing (decided: self-hosted, no podcastmirror)
The old WP URL `/feed/podcast/` now 301s to the generated file at
`/feed/podcast/index.xml` — configured in both `astro.config.mjs` `redirects`
(dev server) and `public/_redirects` (Cloudflare Pages). The feed's
`atom:link rel="self"` points at the canonical index.xml URL. Verified locally:
both `/feed/podcast` and `/feed/podcast/` return 301 → index.xml, which serves
the XML. Post-deploy: confirm the 301 works in production and that any
directory (Apple/Spotify) listing the old URL follows it.

### [x] Remove dead code in [slug].astro
Commented-out WP fetch block deleted.

---

## P3 — Feed Validation

### [x] Validate new feed against original (local checks)
Validated `dist/feed/podcast/index.xml` against the `feed.xml` WP snapshot:
- **Item count:** 69 vs 72 — the 3 missing are the intentional no-audio FFP
  cross-promos. The "Coming Soon!" trailer is now included (category `promo`,
  emitted with `<itunes:episodeType>trailer</itunes:episodeType>`).
- **GUIDs:** original WP GUIDs (`?p=NNNN`) backfilled into frontmatter and emitted
  with `isPermaLink="false"` — all 69 match the old feed exactly, so podcast apps
  won't re-show episodes as new.
- **Summaries:** 37 empty excerpts backfilled from the old feed's subtitles; no
  empty `<itunes:summary>` remains.
- **Enclosures:** all point to R2; spot-checked URLs return 200 with byte-exact
  `Content-Length` matching `audioSize`.
- **pubDates:** all match the old feed (date-level).
- **Channel metadata:** restored subtitle, summary, explicit, all 3 iTunes category
  groups, `podcast:funding` (Patreon), and `atom:link rel="self"`.
- **Known deliberate deviations:** `itunes:explicit` is `false` instead of the
  deprecated `clean`; ~33 durations are 1s shorter than WP reported (our values
  measured from the actual files); episode 23 (Turfgrass) now has the correct
  enclosure — the old WP feed erroneously pointed it at the #AskOnetoGrowOn 3
  audio (that Ask episode has no post and was never in the feed).

### [ ] Post-deploy validation (blocked on deploy; WP site is currently down)
1. Run https://www.castfeedvalidator.com and https://podba.se/validate/ against
   the live `https://www.onetogrowonpod.com/feed/podcast/`.
2. Confirm `<itunes:image>` and enclosure URLs resolve from the live feed.
3. Resolve the feed-URL strategy above, then submit/confirm the feed URL with
   Apple Podcasts / Spotify if it changed.

---

## P3 — Content Review

### [x] Finalize markdown post frontmatter
Audited all 99 posts:
- `excerpt`: non-empty for every feed item (backfilled from old feed subtitles).
  26 transcript posts still have empty excerpts — intentional, they're not in the
  feed and never had excerpts.
- `audio`: 100% R2 URLs, zero WP/local paths.
- `audioSize`/`duration`: populated for every post with audio.
- `coverImage`: validated by the schema `image()` check at build time.
- `tags`: no capitalization duplicates.
- Bonus: rewrote 12 in-body links pointing at the dead `12go.onetogrowonpod.com`
  host to local relative URLs (4 required slug remapping to renamed posts).
