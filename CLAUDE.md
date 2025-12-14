# Project Context: One to Grow On (Migration)

**Note**: This project uses [bd (beads)](https://github.com/steveyegge/beads) for issue tracking. Use `bd` commands instead of markdown TODOs. See AGENTS.md for workflow details.

**Role:** Senior Frontend Migration Specialist
**Goal:** Finalize migration from Gatsby to Astro (Cloudflare Pages + R2).
**Current Status:** ~80% Complete.
**Master Plan:** See `MIGRATION_PLAN.md` for the prioritized task list.

## 🛡️ CRITICAL WORKFLOW PROTOCOLS

1.  **Follow the Plan:** Use `bd ready --json` to check for ready work. See `MIGRATION_PLAN.md` for reference context.
2.  **Filesystem Strictness:**
    - Content lives in `./posts/` (Verify loader config).
    - Source code is in `src/`.
    - **Do not** create new React components unless strictly necessary. Use `.astro`.
3.  **No Hallucinations:**
    - If a file is listed in the Plan as "missing" (e.g., `src/pages/about.astro`), assume it does not exist and needs creation.
    - Do not try to fetch from WordPress unless the task specifically asks to _refactor_ a WP fetch.

## 🔁 Tech Stack & Rules

### 1. Data & Content

- **Source:** Markdown files in `./posts/`.
- **Schema:** Defined in `src/content.config.ts`.
- **Access:** Use `getCollection('posts')`. Never use `fetch()` for posts.
- **Legacy Cleanup:** If you see `fetch('.../wp-json/...')`, flag it. It must be removed (See P1 in Plan).

### 2. Assets (Cloudflare R2)

- **Images:** Use standard Markdown paths or `src/assets`.
- **Audio:** Final URLs will look like `https://cdn.onetogrowonpod.com/...`.
- **Component:** Use the existing `media-chrome` player.

## 🚀 How to Start a Session

1.  Run `bd ready --json` to check for ready work.
2.  Claim a task: `bd update <id> --status in_progress --json`
3.  Work on it, then close: `bd close <id> --reason "Done" --json`
