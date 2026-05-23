# Rules for AI Agents

Every agent working on this repository MUST strictly adhere to the following rules:

1. **Mandatory Visual Verification**
   * Never claim a frontend, layout, or visual change is "verified" or "complete" without running the development server and visually inspecting the rendered pages in the browser. 
   * A successful production build or type check is not evidence of correct rendering.

2. **Strict Markdown Purity**
   * Content files compiled by the Pandoc pipeline (`src/content/blog/posts/*.md`) must contain **only** standard, clean Markdown syntax.
   * Injecting raw block-level HTML tags (such as `<ul>` or `<li>`) inside these Markdown files is strictly prohibited. The compiler is responsible for HTML generation.

3. **Zero Hardcoded Environment Paths**
   * Absolute local paths (e.g. starting with `/home/dzack/...`) must never be hardcoded into scripts or configuration files.
   * Use relative paths and dynamic directory resolution (e.g. `path.join(__dirname, ...)`).

4. **Absolute Epistemic Honesty**
   * Never report checklist items or tasks as verified/successful unless you have personally executed and audited the visual or programmatic results.
   * If a rendering has not been visually inspected, explicitly state it.
