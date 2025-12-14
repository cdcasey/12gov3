# One to Grow On: Gatsby → Astro Migration Plan

## Project Overview

**Site:** onetogrowonpod.com
**Source:** Gatsby + WordPress backend
**Target:** Astro + Markdown/MDX + Cloudflare Pages
**Audio Hosting:** Cloudflare R2 (planned)

## Current State Summary

The Astro migration is approximately 80% complete. The core architecture is solid:

- ✅ Content Collections with Zod schema (`src/content.config.ts`)
- ✅ Dynamic routing (`[slug].astro`, `tag/[tag].astro`)
- ✅ Layouts (`BaseLayout.astro`, `PageLayout.astro`)
- ✅ Audio player component using `media-chrome`
- ✅ Navigation menu with `nanostores`
- ✅ SEO metadata in `src/constants/metadata.ts`
- ✅ Static pages: `contact.astro`, `press.astro`, `series-and-minisodes.astro`, `404.astro`

## Content Schema Reference

Posts are loaded from `./posts/*.md` with this frontmatter schema:

```yaml
---
title: string # Required
slug: string # Required - URL path
date: date # Required - ISO date
excerpt: string # Required - short description
category: enum # Optional - episodes | transcripts | promo
tags: string[] # Optional - for filtering
coverImage: image # Required - relative path to image
audio: string # Optional - URL to audio file
---
```

---

## Migration Tasks

<!--
BEADS PARSING NOTES:
- Each task uses format: ### [TYPE] TITLE
- Types: epic, task, bug, chore
- Priority indicated by P0-P4 in description
- Dependencies noted with "Blocks:" or "Depends on:"
- Labels in brackets after title
-->

### [epic] Deploy to Cloudflare Pages

**Priority:** P0
**Description:** Get the site deployed to Cloudflare Pages with a working baseline before making additional changes. This validates the build process and establishes the production environment.

**Acceptance Criteria:**

- Site builds successfully with `pnpm build`
- Cloudflare Pages deployment configured
- Custom domain configured (optional for initial deploy)
- Build completes without errors

---

### [task] Update astro.config.mjs for production [config]

**Priority:** P0
**Depends on:** None
**Labels:** config, cloudflare

**Description:** The Astro config is missing production settings needed for Cloudflare deployment.

**Current state:**

```javascript
export default defineConfig({
	prefetch: { prefetchAll: true },
});
```

**Required changes:**

```javascript
export default defineConfig({
	site: 'https://www.onetogrowonpod.com',
	prefetch: { prefetchAll: true },
});
```

**Files to modify:**

- `astro.config.mjs`

---

### [task] Verify markdown posts exist [content]

**Priority:** P0
**Depends on:** None
**Labels:** content, validation

**Description:** The build will fail if `getCollection('posts')` returns empty. Verify at least one markdown file exists in `./posts/` directory with valid frontmatter matching the schema.

**Validation steps:**

1. Check `./posts/` directory exists
2. Verify at least one `.md` file present
3. Validate frontmatter matches schema in `src/content.config.ts`
4. Run `pnpm build` to confirm no schema errors

---

### [task] Configure Cloudflare Pages deployment [cloudflare]

**Priority:** P0
**Depends on:** Update astro.config.mjs for production, Verify markdown posts exist
**Labels:** cloudflare, deployment

**Description:** Connect GitHub repo to Cloudflare Pages and configure build settings.

**Build configuration:**

- Build command: `pnpm build`
- Build output directory: `dist`
- Environment variable: `NODE_VERSION=24`

**Steps:**

1. Log into Cloudflare Dashboard
2. Navigate to Pages
3. Connect GitHub repository
4. Configure build settings as above
5. Deploy

---

### [epic] Remove WordPress API Dependencies

**Priority:** P1
**Description:** The site still has components that fetch from the WordPress API. These must be converted to use Content Collections or static data.

---

### [task] Fix FooterTags to derive from Content Collection [component, critical]

**Priority:** P1
**Depends on:** Deploy to Cloudflare Pages
**Labels:** component, wordpress-removal

**Description:** `src/components/FooterSections/FooterTags.astro` still fetches tags from WordPress API.

**Current problematic code:**

```typescript
const res = await fetch('https://12go.onetogrowonpod.com/wp-json/wp/v2/tags?per_page=100');
```

**Solution:** Derive tags from the posts collection:

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
const tagCounts = posts.reduce(
	(acc, post) => {
		post.data.tags?.forEach((tag) => {
			acc[tag] = (acc[tag] || 0) + 1;
		});
		return acc;
	},
	{} as Record<string, number>,
);

const tags = Object.entries(tagCounts)
	.map(([name, count]) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), count }))
	.sort((a, b) => b.count - a.count);
```

**Files to modify:**

- `src/components/FooterSections/FooterTags.astro`

---

### [epic] Create Missing Static Pages

**Priority:** P1
**Description:** The navigation menu references pages that don't have Astro versions yet.

---

### [task] Create /about page [page]

**Priority:** P1
**Depends on:** Deploy to Cloudflare Pages
**Labels:** page, content

**Description:** The `/about` page is referenced in the menu but no `src/pages/about.astro` file exists.

**Reference:** Check old Gatsby source for content structure.

**Files to create:**

- `src/pages/about.astro`

---

### [task] Create /transcripts page [page]

**Priority:** P1
**Depends on:** Deploy to Cloudflare Pages
**Labels:** page, content

**Description:** The `/transcripts` page is referenced in the menu but no `src/pages/transcripts.astro` file exists.

**Options:**

1. Static page listing transcript posts
2. Filter posts by `category: 'transcripts'`

**Files to create:**

- `src/pages/transcripts.astro`

---

### [task] Create /collaborations page [page]

**Priority:** P1
**Depends on:** Deploy to Cloudflare Pages
**Labels:** page, content

**Description:** The `/collaborations` page is referenced in the menu. Gatsby version exists at `src/pages/collaborations.jsx`.

**Reference:** `src/pages/collaborations.jsx` in Gatsby codebase

**Files to create:**

- `src/pages/collaborations.astro`

---

### [epic] Migrate Assets to Cloudflare

**Priority:** P2
**Description:** Images and audio files need to move from WordPress to Cloudflare R2 or local assets.

---

### [task] Migrate press page images [assets]

**Priority:** P2
**Depends on:** Deploy to Cloudflare Pages
**Labels:** assets, images

**Description:** `src/pages/press.astro` contains hardcoded WordPress image URLs.

**Current URLs (examples):**

- `https://12go.onetogrowonpod.com/wp-content/uploads/2018/09/IMG_5692_square-1024x1024.jpg`
- `https://12go.onetogrowonpod.com/wp-content/uploads/2019/04/OTGO_LogoFinal-1-1024x1024.png`

**Options:**

1. Download to `src/assets/press/` and use `astro:assets`
2. Upload to Cloudflare R2 and update URLs
3. Configure `astro.config.mjs` `image.domains` for optimization

**Files to modify:**

- `src/pages/press.astro`
- Potentially `astro.config.mjs` if using external domains

---

### [task] Update OG/Twitter image URLs [seo]

**Priority:** P2
**Depends on:** Migrate press page images
**Labels:** seo, metadata

**Description:** `src/layouts/BaseLayout.astro` has hardcoded WordPress URLs for social sharing images.

**Current:**

```html
<meta
	property="og:image"
	content="https://12go.onetogrowonpod.com/wp-content/uploads/2019/04/OTGO-1400.jpg"
/>
```

**Files to modify:**

- `src/layouts/BaseLayout.astro`

---

### [task] Plan audio file hosting on Cloudflare R2 [audio, planning]

**Priority:** P2
**Depends on:** Deploy to Cloudflare Pages
**Labels:** audio, cloudflare, planning

**Description:** Audio files are currently either local or on WordPress. Plan the migration to Cloudflare R2.

**Decisions needed:**

1. R2 bucket naming convention
2. URL structure (e.g., `https://cdn.onetogrowonpod.com/audio/ep001.mp3`)
3. Migration script for bulk upload
4. Update markdown frontmatter with new URLs

---

### [epic] SEO and Feed Configuration

**Priority:** P2
**Description:** Add sitemap generation and verify RSS feed handling.

---

### [task] Add @astrojs/sitemap integration [seo]

**Priority:** P2
**Depends on:** Update astro.config.mjs for production
**Labels:** seo, integration

**Description:** The old Gatsby site had `gatsby-plugin-sitemap`. Add the Astro equivalent.

**Installation:**

```bash
npx astro add sitemap
```

**Config update:**

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://www.onetogrowonpod.com',
	integrations: [sitemap()],
});
```

**Files to modify:**

- `astro.config.mjs`

---

### [task] Verify RSS feed redirect [seo]

**Priority:** P3
**Depends on:** Deploy to Cloudflare Pages
**Labels:** seo, redirect

**Description:** The `static/_redirects` file has a redirect for the podcast feed. Verify this works on Cloudflare Pages.

**Current redirect:**

```
https://www.onetogrowonpod.com/feed/podcast/   https://feeds.podcastmirror.com/onetogrowon 301
```

**Files to verify:**

- `static/_redirects`

---

### [epic] Cleanup and Polish

**Priority:** P3
**Description:** Remove old Gatsby files and clean up the codebase.

---

### [task] Remove old Gatsby files [cleanup]

**Priority:** P3
**Depends on:** All P0-P2 tasks complete
**Labels:** cleanup, chore

**Description:** Once migration is complete, remove legacy Gatsby files.

**Files to remove:**

- `gatsby-config.js`
- `gatsby-node.js`
- All `.jsx` files in `src/pages/`
- All `.jsx` files in `src/components/`
- `src/styles/globalStyles.js`
- Any other Gatsby-specific files

---

### [task] Finalize markdown post content [content, final]

**Priority:** P3
**Depends on:** Plan audio file hosting on Cloudflare R2
**Labels:** content, markdown

**Description:** Each markdown file needs final review:

1. Verify frontmatter matches schema
2. Update `audio` field with Cloudflare R2 URLs
3. Update any internal links
4. Verify `coverImage` paths are correct

**Note:** This is the final content task and should be done last.

---

## Dependency Graph

```
Deploy to Cloudflare Pages (P0)
├── Update astro.config.mjs (P0)
├── Verify markdown posts exist (P0)
└── Configure Cloudflare Pages deployment (P0)
    └── depends on: config + posts verification

Remove WordPress Dependencies (P1)
└── Fix FooterTags (P1)
    └── depends on: Deploy complete

Create Missing Pages (P1)
├── /about (P1)
├── /transcripts (P1)
└── /collaborations (P1)
    └── all depend on: Deploy complete

Migrate Assets (P2)
├── Press page images (P2)
├── OG/Twitter images (P2)
│   └── depends on: Press images
└── Audio hosting plan (P2)

SEO Configuration (P2)
├── Sitemap integration (P2)
└── RSS feed verification (P3)

Cleanup (P3)
├── Remove Gatsby files (P3)
└── Finalize markdown (P3)
    └── depends on: Audio hosting
```

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321
pnpm build            # Build for production
npm run preview          # Preview production build

# Cloudflare deployment (after setup)
# Automatic on push to main branch

# Content validation
npx astro check          # TypeScript/schema validation
```

---

## Notes for Claude Code

When working on this migration:

1. **Always verify the build passes** after making changes: `pnpm build`
2. **Content Collections are the source of truth** - never use `Astro.glob()`
3. **Check the schema** in `src/content.config.ts` before modifying post handling
4. **Test locally** before pushing to trigger Cloudflare deploy
5. **The `./posts/` directory** is at the project root, not in `src/content/`

## File Locations Reference

| Purpose                 | Path                                             |
| ----------------------- | ------------------------------------------------ |
| Content schema          | `src/content.config.ts`                          |
| Markdown posts          | `./posts/*.md`                                   |
| Base layout             | `src/layouts/BaseLayout.astro`                   |
| Page layout             | `src/layouts/PageLayout.astro`                   |
| Post list component     | `src/components/Posts.astro`                     |
| Single post page        | `src/pages/[slug].astro`                         |
| Tag pages               | `src/pages/tag/[tag].astro`                      |
| Footer tags (needs fix) | `src/components/FooterSections/FooterTags.astro` |
| Site metadata           | `src/constants/metadata.ts`                      |
| Astro config            | `astro.config.mjs`                               |
