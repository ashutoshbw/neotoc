# neotoc

## 1.0.1

### Patch Changes

- 9752714: Fix broken banner image link in README.

## 1.0.0

### Major Changes

- 11d53e9: Made auto scrolling compulsory. Removed all icon options. Only kept fold all and unfold all buttons in the TOC header.
- cc3a95f: Remove breadcrumb and auto fold features due to high complexity and increasing bundle size.

### Patch Changes

- 0920f36: Fix bug(#15) in auto-scrolling.
- 2839e41: Append `btnGroup` to `headerDiv` only when needed (fixes #12).
- 7e5b015: Base plain style is updated. Light bar top and bottom indicators are now only visible when they are on a fold.

## 0.2.3

### Patch Changes

- b501802: Update `README.md`.

## 0.2.2

### Patch Changes

- 4db3aa4: Update package description.

## 0.2.1

### Patch Changes

- 4c621f9: Update `README.md`.

## 0.2.0

### Minor Changes

- a7a34e2: Added UMD build to improve support for a wider range of environments.
- 2665a18: Started exporting CSS files to provide ready-made base styles and colors 🎨
- 33714c3: Added support for breadcrumb. A new option method `onBreadcrumbChange` added to allow users make the breadcrumb according to their design preferences.
- dc963cb: Export default CSS.

### Patch Changes

- b097a48: If you scroll to the end of tocBody and then fold some section, then there was empty space created for no purpose. Now it's fixed.
- b097a48: In autoFold, while scrolling upward and a touch to folded section happens, if that section contains lots of items, then your hightlighted area can go out of the view unexpectedly. This is fixed!

## 0.1.3

### Patch Changes

- 2cd8eae:
  - Excluded unnecesary files in the published package.
  - Use `exports` field in `package.json` as the single source of truth for package entry points.

## 0.1.2

### Patch Changes

- a96b0c9: Update README.md

## 0.1.1

### Patch Changes

- e938fee: Updated README.md
