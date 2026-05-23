# Rules for AI Agents

Every agent working on this repository MUST strictly adhere to the following rules.
Each rule includes an **evidence requirement**: when an agent claims compliance, it must
state the specific tool command, file path, URL, or observation that proves the claim.
A compliance claim without cited evidence is functionally a lie.

1. **Mandatory Visual Verification**
   * Never claim a frontend, layout, or visual change is "verified" or "complete"
     without running the development server and visually inspecting the rendered pages
     in the browser.
   * A successful production build or type check is not evidence of correct rendering.
   * **Evidence**: Cite the URL loaded, the exact visual element checked (text, layout,
     image), and what tool rendered it (browser, Playwright trace, etc.). "Tests pass"
     is not evidence.

2. **Strict Markdown Purity**
   * Content files compiled by the Pandoc pipeline (`src/content/blog/posts/*.md`) must
     contain **only** standard, clean Markdown syntax.
   * Injecting raw block-level HTML tags (such as `<ul>` or `<li>`) inside these
     Markdown files is strictly prohibited.
     The compiler is responsible for HTML generation.
   * **Evidence**: Cite the glob or grep command used to inspect the relevant `.md`
     files and confirm no raw block-level HTML was injected.

3. **Zero Hardcoded Environment Paths**
   * Absolute local paths (e.g. starting with `/home/dzack/...`) must never be hardcoded
     into scripts or configuration files.
   * Use relative paths and dynamic directory resolution (e.g.
     `path.join(__dirname, ...)`).
   * **Evidence**: Cite the search tool and pattern used (e.g.
     `rg '/home/dzack' src/ scripts/`), the directory scope, and the result (zero
     matches or a list of found violations).

4. **Absolute Epistemic Honesty**
   * Never report checklist items or tasks as verified/successful unless you have
     personally executed and audited the visual or programmatic results.
   * If a rendering has not been visually inspected, explicitly state it.
   * **Evidence**: Every compliance claim must name the specific command output, log
     excerpt, or observation that proves the claim.
     A claim without a cited source is invalid and will be treated as a lie.

5. **Absolute Separation of Content, Structure, and Application Code**
   * **Content Purity**: All content MUST be controlled exclusively by plain Markdown
     files. The React application code must contain zero hardcoded content, zero
     content-specific lists, and zero metadata arrays (such as Table of Contents lists).
   * **Structure via Templates**: All document structure (including headers, sections,
     and structural layouts) MUST be controlled by simple Pandoc templates, completely
     separate from all React application source code.
   * **App as a Shell**: The React app itself handles purely the integration and
     injection of the raw compiled HTML output.
     The application must have zero knowledge of the document's inner contents or
     specific headings, acting solely as a container/shell.
   * **Evidence**: Cite which React component files were checked (glob or specific
     paths), what was searched for (e.g. hardcoded heading strings, inline content), and
     the confirmation that no violations were found.
