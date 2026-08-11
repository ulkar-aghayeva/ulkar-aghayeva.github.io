# Repository instructions

This is Ulkar Aghayeva’s static Astro website. Preserve its editorial piano design, migrated writing, existing URLs, and accessibility behavior.

## Before changing anything

- Read `CONTENT_GUIDE.md` before editing posts or projects.
- Sync the latest remote work before editing. Ulkar may update content directly through GitHub, so never overwrite newer frontmatter or article text.
- Treat `src/content` as authored material. Keep wording verbatim unless the request explicitly changes it.
- Do not run `npm run migrate` unless the user specifically asks to refresh the archive from the old Squarespace site.

## Architecture and content

- Astro produces static HTML for GitHub Pages.
- Pages and components live under `src/pages`, `src/components`, and `src/layouts`.
- Shared navigation, gallery data, dates, and legacy-content helpers live in `src/data/site.ts`.
- Global design and responsive behavior live in `src/styles/global.css`.
- Blog posts and projects live in `src/content/blog` and `src/content/projects`.
- New content should use `format: "markdown"`. Imported content without that field intentionally remains legacy HTML.
- Blog descriptions are metadata only and are not shown in the Blog archive. Project descriptions or `previewDescription` values appear in the Projects archive.
- Store new images in `public/images/uploads`, use root-relative paths, and write useful alt text for article images.
- Preserve every existing slug. Do not rename content files without adding a compatible route.

## Design and interaction

- Reuse the established black, ivory, paper, graphite, and oxblood palette and the Libre Baskerville/Source Sans 3 pairing.
- Keep the piano navigation keyboard accessible. Black keys are decorative and must not cover labels.
- Prefer typography, borders, and restrained color changes over shadows or generic cards.
- Keep motion brief and subtle, and maintain the `prefers-reduced-motion` fallback.
- Do not add autoplay, novelty sounds, scroll hijacking, tracking, or hotlinked images.
- Keep touch targets at least 44px and preserve visible keyboard focus.

## Verification

- Run `npm run build` and `npm run verify` before committing.
- Check `git diff --check` and inspect the generated HTML when changing content rendering.
- For layout work, check 1440×900 and 390×844; also confirm there is no horizontal overflow at 320px.
- Do not edit or commit generated `dist` files.

## GitHub workflow

- Unless the user explicitly requests a direct push to `main`, create a descriptive branch from the latest `origin/main`.
- After verification, commit the intended changes, push the branch, and open a pull request automatically. Include a concise summary and the checks run.
- If the user explicitly asks for separate commits, keep each commit independently buildable and push it after validation.
- Never change DNS, the custom domain, repository visibility, or GitHub Pages settings without explicit authorization.
