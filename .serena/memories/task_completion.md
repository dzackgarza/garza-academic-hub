# Task Completion

Before claiming any task is completed or committing code changes, execute the following validation audit:

## 1. Local Code Compilation & Build
Verify that the project compiles cleanly with no typescript errors and no lints:
```bash
bun run build
```

## 2. Mandatory Visual Verification
Never claim a visual layout change is complete without inspecting rendered page outputs.
1. Make sure your local server is running.
2. Run the automated visual screenshot suite:
   ```bash
   bun scratch/verify_all_pages.js
   ```
3. Physically view the generated PNG files under `scratch/screenshots/` (using the `view_file` tool or image viewing mechanism) to inspect visual alignment, margins, text spacing, and page elements.
4. Verbally confirm to the user that you have audited these visual renders and that the page layout looks absolutely premium.

## 3. Git Checkpoint
Clean up any debug/scratch files and review modifications:
```bash
git diff
```
Ensure all files are perfectly formatted, with no absolute path names, and commit changes with descriptive, semantic commits.
