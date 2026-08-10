# Ulkar Aghayeva

A static Astro rebuild of [ulkaraghayeva.com](https://www.ulkaraghayeva.com), preserving the complete writing, projects, recordings, and photo archive in a piano-inspired editorial design.

## Development

```sh
npm install
npm run dev
```

Use `npm run build` for the production build and `npm run verify` for route, metadata, content, and asset checks. The migration snapshot can be refreshed from the live Squarespace source with `npm run migrate`.

## Editing previews

Each blog post and project lives in its own Markdown file under `src/content/blog` or `src/content/projects`. Add a short, custom archive summary to any entry with:

```yaml
previewDescription: "A concise preview written specifically for the archive."
```

Until that field is supplied, the archive uses a shortened version of the imported `description`. Projects also carry an `order` number in their frontmatter, so adding or rearranging a project does not require editing the page templates.

GitHub Pages deployment is prepared in `.github/workflows/deploy.yml`. The custom domain and DNS are intentionally not changed by this repository.
