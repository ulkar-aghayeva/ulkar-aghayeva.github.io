# Ulkar Aghayeva

A static Astro rebuild of [ulkaraghayeva.com](https://www.ulkaraghayeva.com), preserving the complete writing, projects, recordings, and photo archive in a piano-inspired editorial design.

## Development

```sh
npm install
npm run dev
```

Use `npm run build` for the production build and `npm run verify` for route, metadata, content, and asset checks. The migration snapshot can be refreshed from the live Squarespace source with `npm run migrate`.

## Adding and editing content

Posts and projects can be written in normal Markdown and added entirely through GitHub’s website. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the short step-by-step guide and copy one of the files in `content-templates` when starting something new.

Each blog post and project lives in its own Markdown file under `src/content/blog` or `src/content/projects`. Projects can include an optional custom archive summary:

```yaml
previewDescription: "A concise preview written specifically for the archive."
```

Until that field is supplied, the Projects archive uses a shortened version of the imported `description`. Blog archive entries show only their date, image, and title. Projects also carry an `order` number in their frontmatter, so adding or rearranging a project does not require editing the page templates.

GitHub Pages deployment is prepared in `.github/workflows/deploy.yml`. The custom domain and DNS are intentionally not changed by this repository.
