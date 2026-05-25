# Content Guide

This document describes every content type on the site, where its data lives, and what
fields are required.
Written for someone who edits content files but does not work on the React app.

* * *

## Quick Reference

| What you want to do | File to edit |
| --- | --- |
| Add a blog post | `content/blog/your-post.md` |
| Add/edit a page (home, teaching, etc.) | `content/pages/` |
| Add a paper, talk, or note card | `content/databases/items.toml` (add an `[[items]]` block) |
| Add photos to the Gallery page | `content/databases/galleries.toml` |
| Add a video to the Gallery page | `content/databases/galleries.toml` (see YouTube below) |
| Add links to the Writing page | `content/databases/links.toml` |
| Change the navbar | `content/databases/navigation.toml` |
| Update your profile/contact card | `content/databases/profile.toml` |

After editing any file, run `just compile` to regenerate the site artifacts. Use
`just preview path/to/file.md` for a single-page Pandoc preview.

* * *

## Blog Posts

Each `.md` file in `content/blog/` becomes a blog post.

**Required frontmatter:**

```yaml
---
title: "Your Post Title"
date: "Month Day, Year"
tags: ["Tag1", "Tag2"]
categories: ["CategoryName"]
---
```

**Optional frontmatter fields:**

| Field | Type | Purpose |
| --- | --- | --- |
| `updatedDate` | string | Shown as "Updated" on the post |
| `readMinutes` | number | Estimated reading time |
| `excerpt` | string | Short description (used in listings) |
| `legacyUrl` | string | Redirect from old site URL |

**Body**: Standard Markdown.
No raw HTML.

* * *

## Pages

Pages are Markdown files in `content/pages/` with optional **Pandoc component
declarations**. Each page requires frontmatter:

```yaml
---
title: "Page Title"
template: "page"
---
```

`content/pages/home.md` becomes `/`. Other page filenames become matching slug routes
unless `route` is explicitly set in frontmatter.

The site pipeline compiles Markdown to generated HTML with Pandoc defaults, templates,
metadata files, and Lua filters. The React app only loads the generated route manifest
and generated HTML.

### Component Declaration Syntax

Component declarations use Pandoc fenced divs with a `.component` class:

```markdown
:::{.component type="collection" source="databases/items.toml" layout="grid" filter="type=paper" columns="2"}
:::
```

Everything after `:::{.component` is an attribute validated during compile:

| Attribute | Required | Purpose |
| --- | --- | --- |
| `type` | yes | Which Pandoc component filter renderer to use |
| `source` | depends | TOML data source file in `content/databases/` |
| `layout` | no | `"grid"` or `"scroller"` |
| `filterable` | no | Reserved for runtime islands; ignored by static renderers |
| `filter` | no | Pre-filter items (e.g. `"type=paper"`) |
| `columns` | no | Number of grid columns |
| `rows` | no | Number of rows per scroller page |

### Component Types

| `type` | Data source | Purpose |
| --- | --- | --- |
| `collection` | `items.toml` | Academic items (papers, talks, notes) with filtering |
| `blog-listing` | (none) | Self-contained blog archive |
| `gallery-grid` | `galleries.toml` | Image gallery or YouTube section (by `gallery-id`) |
| `link-group` | `links.toml` | External link group (by `group-id`) |

Unknown component types, missing data sources, and missing group/gallery IDs fail the
compile. Do not add raw HTML to content files to work around a missing renderer.

* * *

## Items (Papers, Talks, Notes)

All academic items live in `content/databases/items.toml`.

### Types

Types are defined at the top of the file:

```toml
[[types]]
key = "paper"
label = "Papers"
icon = "paper"

[[types]]
key = "talk"
label = "Talks"
icon = "talk"

[[types]]
key = "notes"
label = "Notes"
icon = "notes"

[[types]]
key = "expository"
label = "Expository"
icon = "paper"
```

Each item references its type by `key`:

```toml
[[items]]
type = "paper"
image = "https://example.com/cover.jpg"
title = "Compact moduli of Enriques surfaces"
subtitle = "arxiv 2312.03638"            # optional
description = "Joint work with ..."       # optional
tags = ["Algebraic Geometry", "Moduli"]   # optional
links = [
  { label = "arXiv", href = "https://arxiv.org/abs/2312.03638" },
  { label = "Slides (PDF)", href = "#" },
]
```

**Item fields:**

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | string | One of the defined type keys |
| `title` | yes | string | The card heading |
| `image` | no | URL | Cover image |
| `subtitle` | no | string | Secondary heading |
| `description` | no | string | Short body text |
| `tags` | no | string[] | Filterable tags |
| `links` | no | array of { label, href } | Action links on the card |
| `icon` | no | string | Override the type's icon |

* * *

## Galleries (Images and YouTube)

All galleries live in `content/databases/galleries.toml`.

### Structure

Each `[[items]]` block is a gallery section:

```toml
[[items]]
id = "hand-drawn"           # used by gallery-id in the markdown slot
title = "Hand-Drawn"
description = "Sketches used in lecture notes and seminar talks."
```

### Adding Images

Add an `[[items.images]]` block inside a gallery section:

```toml
[[items.images]]
src = "https://example.com/image.jpg"
caption = "Description of the image."
```

**Fields:**

| Field | Required | Type |
| --- | --- | --- |
| `src` | yes | URL of the image |
| `caption` | yes | string (also used as alt text) |

### Adding YouTube Videos

Use `type = "youtube"` instead of `src`:

```toml
[[items.images]]
type = "youtube"
url = "https://www.youtube.com/watch?v=PuH5VKlhH_Y"
caption = "Talk title — Conference Name"
```

**Fields:**

| Field | Required | Type |
| --- | --- | --- |
| `type` | yes | Must be `"youtube"` |
| `url` | yes | Any YouTube URL (watch, youtu.be, shorts) |
| `caption` | yes | string (used as title attribute on the card) |

Both image and video items can appear in the same gallery section, in any order.

### Connecting a Gallery to a Page

In the page markdown, reference the gallery section by its `id`:

```markdown
:::{.component type="gallery-grid" source="databases/galleries.toml" gallery-id="hand-drawn" layout="scroller"}
:::
```

The `gallery-id` must match an `[[items]]` block's `id` in `galleries.toml`.

* * *

## Link Groups

Link groups live in `content/databases/links.toml` and appear on the Writing page.

```toml
[[groups]]
id = "notes-by-others"
title = "Notes by Others"
description = "Optional description."

[[groups.links]]
label = "Arun Debray"
href = "https://web.ma.utexas.edu/users/a.debray/lecture_notes/"
note = "Optional annotation"
```

**Group fields:**

| Field | Required |
| --- | --- |
| `id` | yes (used by `group-id` in the markdown slot) |
| `title` | yes |
| `description` | no |

**Link fields:**

| Field | Required |
| --- | --- |
| `label` | yes |
| `href` | yes |
| `note` | no |

### Connecting Link Groups to a Page

```markdown
:::{.component type="link-group" source="databases/links.toml" group-id="notes-by-others"}
:::
```

* * *

## Navigation

The navbar reads from `content/databases/navigation.toml`. Order in the file determines
display order.

```toml
[[items]]
label = "Teaching"
path = "/teaching"
```

**Fields:**

| Field | Required |
| --- | --- |
| `label` | yes |
| `path` | yes (must start with `/`) |

* * *

## Profile Card

The profile card (sidebar on every page) reads from `content/databases/profile.toml`.

```toml
name = "D. Zack Garza"
pronouns = "He/Him/His"
affiliation = "Mathematics, University of Georgia"
office = "Office: 438 Boyd"
email = "zack@uga.edu"
avatar_text = "DZG"   # initials shown in avatar circle

[[links]]
icon = "github"
label = "GitHub"
href = "https://github.com/dzackgarza"
```

Profile links support these icons (matching [Lucide](https://lucide.dev/) icon names):
`map-pin`, `graduation-cap`, `building`, `mail`, `github`, `youtube`, and any other
Lucide icon name.

* * *

## Accepted URL Formats

The YouTube video card accepts any standard YouTube URL:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- Any URL with a `v` query parameter on youtube.com

If the URL cannot be parsed, the card shows "Video unavailable" as a fallback.
