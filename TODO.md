# TODO

Tracked from thermo-nuclear code quality review (2026-05-24).

Every item follows TDD: write a failing test first (RED), commit it, then implement the
fix (GREEN), commit it.

* * *

- [ ] **1. Remove duplicate `TypeDef` interface from `AcademicCollection.tsx`**
  - **RED**: write a test asserting that `TypeDef` imported from `FilterControls` is
    structurally identical to what `AcademicCollection` currently defines.
  - **GREEN**: delete the local `TypeDef` definition from
    `src/components/AcademicCollection.tsx` and import it from `FilterControls` instead.

- [ ] **2. Replace `grid-cols-${columns}` template literal with a literal lookup map**
  - **RED**: write a test that given a rendered `PaginatedScroller` or `CardScroller`,
    the grid container's class list contains exactly the expected Tailwind literal (e.g.
    `grid-cols-2` or `grid-cols-3`) and does NOT contain an unresolved template
    expression.
  - **GREEN**: introduce a `Record<number, string>` lookup map in
    `src/components/PaginatedScroller.tsx` (and/or `CardScroller.tsx`) so every rendered
    class name is a literal string.

- [ ] **3. Early-return in `FilterControls` when `filterable=false`**
  - **RED**: write a test rendering `FilterControls` with `filterable=false` that
    asserts no reactive filter state is maintained (the component should pass all items
    through unchanged).
  - **GREEN**: add an early `if (!filterable) return <>{children(items, 'all-')}</>;`
    guard at the top of the component body.

- [ ] **4. Decouple `FilterControls` from `AcademicCardProps`**
  - **RED**: write a test rendering `FilterControls` configured with an explicit
    `TypeDef` that uses a `string` icon — it should render without importing
    `AcademicCardProps`.
  - **GREEN**: replace `AcademicCardProps['icon']` with `string` in
    `FilterControls.tsx:TypeDef.icon`; also apply the same change to
    `src/content/items.ts:TypeDef.icon`.

- [ ] **5. Remove empty snap-start placeholder from `PaginatedScroller`**
  - **RED**: write a test rendering `PaginatedScroller` with an empty `items` array that
    asserts zero children are rendered inside the scroll container (i.e. no empty
    placeholder divs).
  - **GREEN**: replace the `pages.length === 0` branch in
    `src/components/PaginatedScroller.tsx` with `null` instead of an empty div.

- [ ] **6. Make `ImageGallery` scroller columns/rows configurable via props**
  - **RED**: write a test rendering `ImageGallery` with `layout="scroller"`,
    `columns={3}`, `rows={2}` and asserting the `PaginatedScroller` receives those
    values.
  - **GREEN**: add optional `columns` and `rows` props to `ImageGalleryProps`, pass them
    through to `PaginatedScroller`, with current values as defaults.

- [ ] **7. Type `resolveCollectionData` and REGISTRY slots with actual data shapes**
  - **RED**: write a type-level test (e.g. `expectTypeOf`) that a collection slot data
    object is rejected if it has unexpected fields beyond the known shape.
  - **GREEN**: introduce `CollectionSlotData` and `SlotItem` interfaces in
    `src/components/PageShell.tsx` and replace `any`/`Record<string, any>` usage
    accordingly.

- [ ] **8. Extract shared nav-link rendering in `NavBar`**
  - **RED**: write a test asserting that adding a nav item to the data source
    automatically renders it in both desktop and mobile nav menus.
  - **GREEN**: extract a shared `renderNavLinks` helper (or inline map) in
    `src/components/NavBar.tsx` and use it in both the desktop `<nav>` and mobile
    `<nav>`.
