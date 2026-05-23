# Conventions

Essential layout, design, and code patterns enforced in the project.

## Markdown Purity

Source files in `src/content/blog/posts/` must compile to HTML solely via standard Pandoc rendering.
- No HTML tags (`<ul>`, `<li>`, `<div>`, etc.) are permitted inside markdown files.
- Resource directory lists must use loose list syntax (i.e. empty lines between different book items, and indented description paragraphs rather than nested bullet points) to enable natural Tailwind-typography spacing and alignment.

## Path Portability

Absolute path referencing is prohibited.
- Always resolve paths dynamically using `path.join(__dirname, ...)` in NodeJS/Bun scripts.
- Ensure that code compiles and works seamlessly across multiple developer machines without manual configuration modifications.

## MathJax Integration

When loading raw HTML content dynamically in `BlogPost.tsx`, MathJax's typesetting queue must be explicitly triggered to prevent LaTeX equation formulas from rendering as plain text:
```typescript
if (window.MathJax) {
  window.MathJax.typesetPromise();
}
```
