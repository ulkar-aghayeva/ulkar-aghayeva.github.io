# Updating Ulkar’s website

Everything below can be done from the GitHub website. You do not need to edit any page templates or run code locally.

## Change an existing post or project

1. Open [`src/content/blog`](https://github.com/ulkar-aghayeva/ulkar-aghayeva.github.io/tree/main/src/content/blog) or [`src/content/projects`](https://github.com/ulkar-aghayeva/ulkar-aghayeva.github.io/tree/main/src/content/projects).
2. Open the file you want to change.
3. Click the pencil icon labeled **Edit this file**.
4. Edit the text or the fields between the two `---` lines at the top.
5. Click **Commit changes**. The website will rebuild automatically and normally updates within a few minutes.

## Give an older entry a custom preview

Add this field between the `---` lines at the top of its file:

```yaml
previewDescription: "The short description that should appear on the Blog or Projects page."
```

Keep it to roughly one or two sentences. If the field is absent or blank, the site automatically uses a shortened version of `description`.

## Add a blog post

1. If the post needs new images, [upload them here](https://github.com/ulkar-aghayeva/ulkar-aghayeva.github.io/upload/main/public/images/uploads). Drag in the image files and click **Commit changes**.
2. Open the [blog-post template](content-templates/blog-post.md), click **Raw**, and copy everything.
3. [Create a new blog file](https://github.com/ulkar-aghayeva/ulkar-aghayeva.github.io/new/main/src/content/blog).
4. Name it with lowercase words separated by hyphens and end it in `.md`, for example `why-birds-sing.md`. This becomes the page address.
5. Paste the template, fill in the fields, and write the post underneath in normal Markdown.
6. Click **Commit changes**. Its page and Blog archive entry are created automatically.

Keep `format: "markdown"` in new files. It tells the site to use the simple Markdown editor while preserving the original imported articles exactly as they were.

## Add a project

Follow the same process using the [project template](content-templates/project.md) and [new project file page](https://github.com/ulkar-aghayeva/ulkar-aghayeva.github.io/new/main/src/content/projects). Set `order` to the position where the project should appear.

## Markdown basics

```md
## Section heading

Regular paragraph text with *italics*, **bold text**, and [a link](https://example.com).

- A list item
- Another list item

![A useful description of the image](/images/uploads/image-name.jpg)
```

The first image shown at the top and in the archive is controlled by `featuredImage`. Images placed in the article body use the final Markdown example above.

## Change gallery images or navigation

Those lists live in `src/data/site.ts`. They can be edited from GitHub in the same way, but their bracket-and-comma formatting should be preserved.
