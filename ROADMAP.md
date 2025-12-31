# Font Picker Feature Roadmap

A prioritized list of features to add to the font picker application, ordered by importance to a finished product.

---

## Critical (Core Functionality Gaps)

### 1. Search Input Box
Quick filter to search fonts by name. With 300+ fonts, scrolling through categories is inefficient.
- Fuzzy matching for typos
- Search across all categories simultaneously
- Keyboard shortcut (Cmd/Ctrl+K) to focus search
- Show category badge in results

### 2. Copy `<link>` / `@import` Code
One-click copy of the Google Fonts embed code for selected font(s).
- Generate `<link>` tag for HTML
- Generate `@import` for CSS
- Include only the weights/styles actually being used
- Support copying code for multiple fonts at once

### 3. Favorites for All Font Types
Currently favorites appear to be heading-focused. Extend to:
- Paragraph fonts with appropriate default settings
- Code/monospace fonts with coding-specific defaults
- Visual distinction between font types in favorites column
- Type filter in favorites column

### 4. Copy CSS `font-family` Declaration
Quick copy button for the `font-family` CSS property value.
- Include proper fallback stack (e.g., `'Inter', sans-serif`)
- Copy full shorthand (`font: 400 16px/1.5 'Inter', sans-serif`)

### 5. Font Pairing Suggestions
Show complementary fonts for heading/body combinations.
- Algorithm based on contrast (serif + sans-serif)
- Curated pairings from design best practices
- Preview heading + body together
- Save pairings as a unit

---

## High Priority (Expected in a Complete Product)

### 6. Recently Used Fonts
Track and display recently viewed/used fonts.
- Persist across sessions (localStorage or database)
- Quick access section at top of sidebar or as a category
- Clear history option

### 7. Font Comparison Mode
Side-by-side comparison of 2-4 fonts.
- Toggle fonts in/out of comparison
- Synchronized controls (size, weight, text)
- Diff highlighting for subtle differences

### 8. Variable Font Axis Controls
Full control over variable font axes beyond weight.
- Width (wdth)
- Slant (slnt)
- Optical size (opsz)
- Custom axes per font
- Reset to defaults

### 9. Filter by Language Support
Filter fonts by supported languages/scripts.
- Use existing `languages` metadata
- Multi-select for polyglot projects
- Show language coverage percentage

### 10. Keyboard Navigation
Full keyboard accessibility.
- Arrow keys to navigate font list
- Enter to select/preview
- Tab through controls
- Escape to close modals/reset

### 11. URL State / Shareable Links
Encode current state in URL for sharing.
- Selected font, weight, size, tracking
- Selected category
- Preview text
- Shareable "font configuration" links

### 12. Tailwind Config Export
Generate Tailwind CSS font configuration.
```js
fontFamily: {
  heading: ['Playfair Display', 'serif'],
  body: ['Inter', 'sans-serif'],
}
```

### 13. Dark Mode / Theme Toggle
UI theme preference.
- Light/dark/system modes
- Preview text on different backgrounds
- Test font legibility in both modes

### 14. Favorites Sorting & Organization
Better favorites management.
- Drag-and-drop reordering
- Custom groups/folders
- Sort by date added, name, type
- Bulk delete

---

## Medium Priority (Polish & Professional Features)

### 15. Designer/Foundry Information
Show font metadata in an info panel.
- Designer name and bio
- Foundry/source
- Release date and version
- Link to Google Fonts page

### 16. Popularity/Trending Indicators
Visual indicators of font popularity.
- Use existing `popularity` and `trending` scores
- Trending category or filter
- "Popular in your category" suggestions

### 17. OpenType Features Toggle
Control advanced typography features.
- Ligatures (liga, dlig, calt)
- Stylistic alternates (salt, ssXX)
- Numerals (onum, lnum, tnum, pnum)
- Small caps (smcp, c2sc)

### 18. Text Samples Library
Predefined text samples for different use cases.
- Headlines, subheadings, body copy
- UI text (buttons, labels, navigation)
- Numbers and currency
- Mixed case, all caps, small caps
- Lorem ipsum variants

### 19. Responsive Preview
See how fonts render at different viewport sizes.
- Mobile, tablet, desktop presets
- Custom viewport width
- Simulate different pixel densities

### 20. Export Favorites to JSON
Backup and restore favorites.
- Export all favorites as JSON
- Import from JSON file
- Sync across devices/accounts

### 21. Font Loading Performance Preview
Show font file sizes and load impact.
- File size per weight/style
- Total bundle size for selection
- Subsetting recommendations

### 22. Favorites Presets / Collections
Named collections beyond individual favorites.
- "Project A Typography"
- "Minimal Blog Stack"
- Duplicate and modify collections

### 23. Grid/List View Toggle
Alternative layout for font browsing.
- Compact list for scanning
- Large cards for visual comparison
- Adjustable preview size

### 24. Custom Preview Background
Test fonts on different backgrounds.
- Color picker for background
- Image/pattern backgrounds
- Simulate real design contexts

---

## Lower Priority (Nice to Have)

### 25. Font Classification Filters
Filter by design characteristics.
- Stroke style (sans, serif, slab, mono)
- Weight range available
- x-height (tall, medium, short)
- Width (condensed, normal, extended)

### 26. Figma Plugin / Integration
Export to design tools.
- Figma text style generation
- Sketch integration
- Adobe XD support

### 27. CSS Custom Properties Export
Generate CSS variables for fonts.
```css
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--font-size-base: 16px;
--line-height-base: 1.5;
```

### 28. Specimen Sheet Generator
Create printable/shareable font specimens.
- Full character set display
- All weights and styles
- Sample paragraphs at various sizes
- PDF export

### 29. Kerning Pair Tester
Advanced kerning visualization.
- Common problematic pairs (AV, To, etc.)
- Custom pair input
- Visual metrics overlay

### 30. Font Diff Tool
Compare two fonts in detail.
- Glyph-by-glyph comparison
- Metrics overlay (cap height, x-height, baseline)
- Side-by-side character sets

### 31. Self-Hosted Font Download
Download font files for self-hosting.
- Download selected weights/styles
- Generate @font-face CSS
- WOFF2 optimization

### 32. Accessibility Checker
Font legibility analysis.
- Minimum size recommendations
- Contrast checker integration
- Dyslexia-friendly font suggestions
- WCAG compliance hints

### 33. Animation/Transition Preview
See how fonts animate.
- Weight transitions (variable fonts)
- Size scaling behavior
- Letter-spacing animations

### 34. Team/Workspace Features
Collaboration support.
- Shared favorites/collections
- Comments on font choices
- Role-based permissions
- Activity feed

### 35. Local Font Support
Use system/local fonts alongside Google Fonts.
- Detect installed fonts
- Upload custom font files
- Preview local fonts in same UI

### 36. Browser Rendering Preview
Show how fonts render across browsers.
- Chrome, Firefox, Safari comparison
- Font smoothing differences
- Subpixel rendering preview

### 37. Historical Usage Tracking
Analytics on font usage.
- Most used fonts over time
- Export frequency
- Project associations

### 38. Batch Operations
Bulk actions on fonts.
- Add multiple to favorites at once
- Bulk export
- Compare selected fonts

### 39. Undo/Redo for Favorites
Reversible actions.
- Undo remove from favorites
- Undo bulk operations
- Action history

### 40. API / Embeddable Widget
External integration options.
- REST API for favorites
- Embeddable font picker component
- Webhook notifications

---

## Summary by Category

| Category | Count |
|----------|-------|
| Critical | 5 |
| High Priority | 9 |
| Medium Priority | 10 |
| Lower Priority | 16 |
| **Total** | **40** |

---

## Currently Implemented

For reference, features that already exist:
- Category-based font browsing (25 subcategories)
- Three preview modes (Headings, Paragraphs, Code)
- Weight, size, tracking, line height controls
- Italic toggle
- Custom preview text with presets
- Favorites with Convex backend storage
- Bold/Italic/Variable filters
- Font loading with FontFaceObserver
- Normalized text sizing for visual consistency
- Google Fonts metadata integration
- Clerk authentication
