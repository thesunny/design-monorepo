# Font Picker Application PRD

## Overview

A multi-column font picker application for browsing and previewing Google Fonts. The application allows users to explore fonts by category, preview them with customizable text samples, and fine-tune typographic properties including support for variable fonts.

**Location:** `apps/web`

---

## Architecture

### Layout Structure

The application uses a multi-column layout where each column scrolls independently:

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Category Browser | Font List + Controls | Font Preview |

---

## Column 1: Category Browser

### Font Taxonomy

Categories are organized into top-level groups, each containing subcategories:

```
Serif
├── Old Style / Humanist
├── Transitional / Modern
└── Slab Serif

Sans Serif
├── Neo-Grotesque
├── Geometric Sans
├── Humanist Sans
└── Display Sans

Monospace
├── Coding Monospace
└── Retro Monospace

Handwriting & Script
├── Casual
├── Brush
└── Calligraphic

Display & Decorative
├── Modern Display
├── Retro / Vintage
└── Experimental
```

### Font Data

<details>
<summary>Complete font categorization (click to expand)</summary>

```json
{
  "Serif": {
    "OldStyleHumanist": [
      "Lora", "Cardo", "Vollkorn", "Neuton", "Domine",
      "Gentium Book Basic", "Caudex", "Alice", "Averia Serif Libre", "Kameron"
    ],
    "TransitionalModern": [
      "Merriweather", "Playfair Display", "Libre Baskerville", "Prata", "Cormorant",
      "Spectral", "Baskervville", "Crimson Text", "Cormorant Garamond", "Noto Serif"
    ],
    "SlabSerif": [
      "Roboto Slab", "Arvo", "Slabo 27px", "Zilla Slab", "Bitter",
      "Ultra", "Alfa Slab One", "Bevan", "Vidaloka", "Josefin Slab"
    ]
  },
  "SansSerif": {
    "NeoGrotesque": [
      "Roboto", "Open Sans", "Inter", "Noto Sans", "Roboto Condensed",
      "PT Sans", "Hind", "Muli", "Work Sans", "Source Sans Pro"
    ],
    "GeometricSans": [
      "Montserrat", "Poppins", "Lato", "Questrial", "Nunito",
      "Rubik", "Manrope", "Epilogue", "Outfit", "Jost"
    ],
    "HumanistSans": [
      "Nunito Sans", "DM Sans", "Cabin", "Karla", "Ubuntu",
      "Asap", "Fira Sans", "Public Sans", "Overpass", "Source Sans 3"
    ],
    "DisplaySans": [
      "Oswald", "Bebas Neue", "Anton", "Lexend", "Teko",
      "Archivo Black", "Barlow Condensed", "Staatliches", "League Spartan", "Bungee"
    ]
  },
  "Monospace": {
    "CodingMonospace": [
      "Source Code Pro", "IBM Plex Mono", "Ubuntu Mono", "Cousine", "Inconsolata",
      "Share Tech Mono", "Roboto Mono", "Cutive Mono", "Space Mono", "DM Mono"
    ],
    "RetroMonospace": [
      "VT323", "Major Mono Display", "Space Mono", "Press Start 2P", "Syne Mono",
      "Anonymous Pro", "Overpass Mono", "PT Mono", "Nova Mono", "DM Mono"
    ]
  },
  "HandwritingScript": {
    "Casual": [
      "Caveat", "Patrick Hand", "Gloria Hallelujah", "Shadows Into Light", "Short Stack",
      "Covered By Your Grace", "Handlee", "Reenie Beanie", "Waiting for the Sunrise", "Kalam"
    ],
    "Brush": [
      "Pacifico", "Kaushan Script", "Yellowtail", "Satisfy", "Grand Hotel",
      "Norican", "Delius Swash Caps", "Sacramento", "Allura", "Yesteryear"
    ],
    "Calligraphic": [
      "Great Vibes", "Dancing Script", "Parisienne", "Tangerine", "Alex Brush",
      "Marck Script", "Italianno", "Rouge Script", "Pinyon Script", "Herr Von Muellerhoff"
    ]
  },
  "DisplayDecorative": {
    "ModernDisplay": [
      "Abril Fatface", "Exo", "Bungee", "Staatliches", "Anton",
      "Titan One", "Black Ops One", "Syncopate", "Righteous", "Fredoka One"
    ],
    "RetroVintage": [
      "Limelight", "Righteous", "Bowlby One", "Bungee Shade", "Bebas Neue",
      "Alfa Slab One", "Monoton", "Fascinate", "Rye", "Jomhuria"
    ],
    "Experimental": [
      "UnifrakturMaguntia", "UnifrakturCook", "Fascinate Inline", "Creepster", "Blaka",
      "Fredericka the Great", "Snowburst One", "Megrim", "Wallpoet", "Ribeye Marrow"
    ]
  }
}
```

</details>

### Interaction

- Clicking a subcategory populates Column 2 with fonts from that category
- Visual indication of currently selected category
- Groups should be collapsible or always visible (TBD)

---

## Column 2: Font List

### Controls (Top of Column)

#### Font Size Slider
- Adjusts preview size for all fonts in the list
- Range: 12px – 72px (suggested)
- Default: 24px

#### Text Preset Selector

Three preset text samples for different use cases:

| Preset | Purpose | Example Text |
|--------|---------|--------------|
| **Heading** | Headlines starting with "The" | "The Quick Brown Fox" |
| **Body** | Paragraph text | "The five boxing wizards jump quickly. Pack my box with five dozen liquor jugs." |
| **Label** | Form field titles, UI labels | "Email Address" |

User can toggle between presets to see how fonts perform in different contexts.

### Font List Display

Each font in the selected category appears as a list item showing:
- Font name
- Preview text (using selected preset)

#### Weight Variations

Fonts display multiple weight variations on **separate lines** (not inline). Rules for which weights to show:

1. **Always show** (if available):
   - Regular (400)
   - Bold (700)

2. **Conditionally show** (if font has many weights):
   - Lightest available (e.g., Thin 100, ExtraLight 200, Light 300)
   - Heaviest available (e.g., ExtraBold 800, Black 900)

3. **Never show**:
   - Italic variations (excluded from list)

4. **Smart limiting**:
   - If a font has 2-4 weights: show all
   - If a font has 5+ weights: show Regular, Bold, Lightest, Heaviest (4 max)

### Selection

- Clicking a font/weight combination selects it for detailed preview in Column 3

---

## Column 3: Font Preview

### Preview Display

- **Multiline text** display to show line spacing behavior
- Editable text area (user can type custom text)
- Large preview area that fills available space

### Typography Controls

All controls use sliders with carefully tuned ranges and step increments.

#### Font Size
- **Range:** 8px – 120px
- **Default:** 32px
- **Step:** 1px

#### Font Weight

**For Variable Fonts:**
- Continuous slider
- **Range:** 100 – 900 (or font's actual range from `wght` axis)
- **Step:** 1
- Real-time interpolation

**For Static Fonts:**
- **Segmented control** (button group) showing only available weights
- Each segment labeled with weight name (e.g., "Light", "Regular", "Bold", "Black")

#### Letter Spacing (Tracking)

Uses a **non-linear scale** for natural feeling adjustments:

| Range | Behavior |
|-------|----------|
| -0.05em to 0em | Fine increments (0.005em steps) |
| 0em to 0.1em | Small increments (0.01em steps) |
| 0.1em to 0.3em | Medium increments (0.02em steps) |
| 0.3em to 0.5em | Larger increments (0.05em steps) |

**Implementation approach:** Use a normalized slider (0-100) mapped to a custom easing function that provides fine control near zero and coarser control at extremes.

- **Range:** -0.05em to 0.5em
- **Default:** 0em
- Negative values limited to prevent letter overlap

#### Line Height (Leading)

- **Range:** 0.8 to 2.5 (unitless multiplier)
- **Default:** 1.5
- **Step:** 0.05
- Preview must show multiple lines to demonstrate effect

#### Additional Controls (Optional/Future)

- Word spacing
- Text transform (uppercase, lowercase, capitalize)
- Font feature settings (ligatures, small caps, etc. if supported)

---

## Variable Font Support

### Detection

Query Google Fonts API or font metadata to determine if font supports variable axes.

### Weight Axis (`wght`)

- Primary variable axis to support
- Replace segmented control with continuous slider
- Show current numeric weight value
- Snap-to-weight option (optional): subtle detents at standard weights (100, 200, ... 900)

### Future Variable Axes

Consider supporting additional axes in future iterations:
- Width (`wdth`)
- Slant (`slnt`)
- Optical size (`opsz`)

---

## Technical Considerations

### Font Loading

- Use Google Fonts API to load fonts on-demand
- Lazy load fonts as categories are browsed
- Cache loaded fonts for session
- Show loading state while fonts download

### Performance

- Virtualized lists for font categories with many entries
- Debounce slider inputs to prevent excessive re-renders
- Use CSS `font-display: swap` for better perceived performance

### State Management

Key application state:
- Selected category/subcategory
- Selected font + weight
- Preview text (custom or preset)
- All typography control values (size, weight, letter-spacing, line-height)

### Responsive Behavior

- On narrow screens, columns could stack or use tabs
- Minimum viable width for side-by-side columns: ~900px

---

## User Flow

```
1. User opens app
   └── Column 1 shows all categories

2. User clicks subcategory (e.g., "Geometric Sans")
   └── Column 2 populates with fonts + weight variations

3. User adjusts text preset to "Heading"
   └── All font previews update to heading text

4. User clicks "Montserrat Bold"
   └── Column 3 shows detailed preview

5. User adjusts letter spacing slider
   └── Preview updates in real-time

6. User types custom text in preview
   └── Preview updates with custom text
```

---

## Open Questions

1. Should the category groups in Column 1 be collapsible accordions or always expanded?
2. Should there be a search/filter function to find fonts by name?
3. Should users be able to compare multiple fonts side-by-side?
4. Should there be a "favorites" or "recently used" section?
5. What should happen when a user "selects" a font? (Copy CSS, export settings, etc.)
6. Should the text presets be user-customizable?

---

## Success Metrics

- User can browse and preview any font in under 3 seconds
- Typography controls feel responsive and natural
- Variable font weight slider provides smooth interpolation
- Application handles 100+ fonts without performance degradation
