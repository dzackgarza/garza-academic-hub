# Garza Academic Hub Core

D. Zack Garza's academic profile and blog. Structured as a dynamic React SPA that parses compiled Markdown documents for blogs and static resources.

## System Map

- `src/`: Core React application logic.
  - `src/pages/`: Frontend routes (`Blog.tsx`, `BlogPost.tsx`, `Teaching.tsx`, `Activities.tsx`, `Writing.tsx`, `Gallery.tsx`).
  - `src/content/blog/posts/`: Source Markdown files for blog content.
  - `src/content/blog/compiled/`: Target directory for compiler script outputs.
- `scripts/compile-posts.js`: Bundled predev/prebuild script that runs Pandoc under the hood to output JSON metadata index and HTML fragments.
- `scratch/verify_all_pages.js`: Playwright automation script to ensure visual regression testing is executed via automated screenshot diffing.

## Key Invariants

1. Always compile blog posts before any dev environment startup or production build (`predev` and `prebuild` hooks).
2. Maintain absolute path portability. Never hardcode absolute system paths (e.g. `/home/dzack/`).
3. Standard Markdown purity is enforced. Any HTML inside blog sources is prohibited.

## Directory Graph Root

- For build environment information, packages, and engines: consult `mem:tech_stack`.
- For standard terminal operations and commands: consult `mem:suggested_commands`.
- For coding style, layout principles, and code structuring: consult `mem:conventions`.
- For completion verification, automated audits, and delivery steps: consult `mem:task_completion`.
