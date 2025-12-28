export interface FontAxis {
  tag: string;
  min: number;
  max: number;
}

export interface Font {
  id: string;
  name: string;
  weights: number[];
  styles: ("normal" | "italic")[];
  variable: boolean;
  axes?: FontAxis[];
}

export interface Subcategory {
  id: string;
  name: string;
  fonts: Font[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const fontCategories: Category[] = [
  {
    id: "serif",
    name: "Serif",
    subcategories: [
      {
        id: "old-style-humanist",
        name: "Old Style / Humanist",
        fonts: [
          { id: "lora", name: "Lora", weights: [400, 500, 600, 700], styles: ["normal", "italic"], variable: true },
          { id: "cardo", name: "Cardo", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "vollkorn", name: "Vollkorn", weights: [400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "neuton", name: "Neuton", weights: [200, 300, 400, 700, 800], styles: ["normal", "italic"], variable: false },
          { id: "domine", name: "Domine", weights: [400, 500, 600, 700], styles: ["normal"], variable: true },
          { id: "gentium-book-basic", name: "Gentium Book Basic", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "caudex", name: "Caudex", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "alice", name: "Alice", weights: [400], styles: ["normal"], variable: false },
          { id: "averia-serif-libre", name: "Averia Serif Libre", weights: [300, 400, 700], styles: ["normal", "italic"], variable: false },
          { id: "kameron", name: "Kameron", weights: [400, 500, 600, 700], styles: ["normal"], variable: true },
        ],
      },
      {
        id: "transitional-modern",
        name: "Transitional / Modern",
        fonts: [
          { id: "merriweather", name: "Merriweather", weights: [300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "playfair-display", name: "Playfair Display", weights: [400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "libre-baskerville", name: "Libre Baskerville", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "prata", name: "Prata", weights: [400], styles: ["normal"], variable: false },
          { id: "cormorant", name: "Cormorant", weights: [300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: true },
          { id: "spectral", name: "Spectral", weights: [200, 300, 400, 500, 600, 700, 800], styles: ["normal", "italic"], variable: false },
          { id: "baskervville", name: "Baskervville", weights: [400], styles: ["normal", "italic"], variable: false },
          { id: "crimson-text", name: "Crimson Text", weights: [400, 600, 700], styles: ["normal", "italic"], variable: false },
          { id: "cormorant-garamond", name: "Cormorant Garamond", weights: [300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: false },
          { id: "noto-serif", name: "Noto Serif", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
        ],
      },
      {
        id: "slab-serif",
        name: "Slab Serif",
        fonts: [
          { id: "roboto-slab", name: "Roboto Slab", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal"], variable: true },
          { id: "arvo", name: "Arvo", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "slabo-27px", name: "Slabo 27px", weights: [400], styles: ["normal"], variable: false },
          { id: "zilla-slab", name: "Zilla Slab", weights: [300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: false },
          { id: "bitter", name: "Bitter", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "ultra", name: "Ultra", weights: [400], styles: ["normal"], variable: false },
          { id: "alfa-slab-one", name: "Alfa Slab One", weights: [400], styles: ["normal"], variable: false },
          { id: "bevan", name: "Bevan", weights: [400], styles: ["normal", "italic"], variable: false },
          { id: "vidaloka", name: "Vidaloka", weights: [400], styles: ["normal"], variable: false },
          { id: "josefin-slab", name: "Josefin Slab", weights: [100, 200, 300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: true },
        ],
      },
    ],
  },
  {
    id: "sans-serif",
    name: "Sans Serif",
    subcategories: [
      {
        id: "neo-grotesque",
        name: "Neo-Grotesque",
        fonts: [
          { id: "roboto", name: "Roboto", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "open-sans", name: "Open Sans", weights: [300, 400, 500, 600, 700, 800], styles: ["normal", "italic"], variable: true },
          { id: "inter", name: "Inter", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "noto-sans", name: "Noto Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "roboto-condensed", name: "Roboto Condensed", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "pt-sans", name: "PT Sans", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "hind", name: "Hind", weights: [300, 400, 500, 600, 700], styles: ["normal"], variable: false },
          { id: "mulish", name: "Mulish", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "work-sans", name: "Work Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "source-sans-pro", name: "Source Sans Pro", weights: [200, 300, 400, 600, 700, 900], styles: ["normal", "italic"], variable: false },
        ],
      },
      {
        id: "geometric-sans",
        name: "Geometric Sans",
        fonts: [
          { id: "montserrat", name: "Montserrat", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "poppins", name: "Poppins", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: false },
          { id: "lato", name: "Lato", weights: [100, 300, 400, 700, 900], styles: ["normal", "italic"], variable: false },
          { id: "questrial", name: "Questrial", weights: [400], styles: ["normal"], variable: false },
          { id: "nunito", name: "Nunito", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "rubik", name: "Rubik", weights: [300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "manrope", name: "Manrope", weights: [200, 300, 400, 500, 600, 700, 800], styles: ["normal"], variable: true },
          { id: "epilogue", name: "Epilogue", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "outfit", name: "Outfit", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal"], variable: true },
          { id: "jost", name: "Jost", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
        ],
      },
      {
        id: "humanist-sans",
        name: "Humanist Sans",
        fonts: [
          { id: "nunito-sans", name: "Nunito Sans", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "dm-sans", name: "DM Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "cabin", name: "Cabin", weights: [400, 500, 600, 700], styles: ["normal", "italic"], variable: true },
          { id: "karla", name: "Karla", weights: [200, 300, 400, 500, 600, 700, 800], styles: ["normal", "italic"], variable: true },
          { id: "ubuntu", name: "Ubuntu", weights: [300, 400, 500, 700], styles: ["normal", "italic"], variable: false },
          { id: "asap", name: "Asap", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "fira-sans", name: "Fira Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: false },
          { id: "public-sans", name: "Public Sans", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "overpass", name: "Overpass", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
          { id: "source-sans-3", name: "Source Sans 3", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true },
        ],
      },
      {
        id: "display-sans",
        name: "Display Sans",
        fonts: [
          { id: "oswald", name: "Oswald", weights: [200, 300, 400, 500, 600, 700], styles: ["normal"], variable: true },
          { id: "bebas-neue", name: "Bebas Neue", weights: [400], styles: ["normal"], variable: false },
          { id: "anton", name: "Anton", weights: [400], styles: ["normal"], variable: false },
          { id: "lexend", name: "Lexend", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal"], variable: true },
          { id: "teko", name: "Teko", weights: [300, 400, 500, 600, 700], styles: ["normal"], variable: true },
          { id: "archivo-black", name: "Archivo Black", weights: [400], styles: ["normal"], variable: false },
          { id: "barlow-condensed", name: "Barlow Condensed", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: false },
          { id: "staatliches", name: "Staatliches", weights: [400], styles: ["normal"], variable: false },
          { id: "league-spartan", name: "League Spartan", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal"], variable: true },
          { id: "bungee", name: "Bungee", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },
  {
    id: "monospace",
    name: "Monospace",
    subcategories: [
      {
        id: "coding-monospace",
        name: "Coding Monospace",
        fonts: [
          { id: "source-code-pro", name: "Source Code Pro", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true, axes: [{ tag: "wght", min: 200, max: 900 }] },
          { id: "ibm-plex-mono", name: "IBM Plex Mono", weights: [100, 200, 300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: false },
          { id: "ubuntu-mono", name: "Ubuntu Mono", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "cousine", name: "Cousine", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "inconsolata", name: "Inconsolata", weights: [200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal"], variable: true, axes: [{ tag: "wdth", min: 50, max: 200 }, { tag: "wght", min: 200, max: 900 }] },
          { id: "share-tech-mono", name: "Share Tech Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "roboto-mono", name: "Roboto Mono", weights: [100, 200, 300, 400, 500, 600, 700], styles: ["normal", "italic"], variable: true, axes: [{ tag: "wght", min: 100, max: 700 }] },
          { id: "cutive-mono", name: "Cutive Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "space-mono", name: "Space Mono", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "dm-mono", name: "DM Mono", weights: [300, 400, 500], styles: ["normal", "italic"], variable: false },
        ],
      },
      {
        id: "retro-monospace",
        name: "Retro Monospace",
        fonts: [
          { id: "vt323", name: "VT323", weights: [400], styles: ["normal"], variable: false },
          { id: "major-mono-display", name: "Major Mono Display", weights: [400], styles: ["normal"], variable: false },
          { id: "space-mono", name: "Space Mono", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "press-start-2p", name: "Press Start 2P", weights: [400], styles: ["normal"], variable: false },
          { id: "syne-mono", name: "Syne Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "anonymous-pro", name: "Anonymous Pro", weights: [400, 700], styles: ["normal", "italic"], variable: false },
          { id: "overpass-mono", name: "Overpass Mono", weights: [300, 400, 500, 600, 700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 300, max: 700 }] },
          { id: "pt-mono", name: "PT Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "nova-mono", name: "Nova Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "dm-mono", name: "DM Mono", weights: [300, 400, 500], styles: ["normal", "italic"], variable: false },
        ],
      },
    ],
  },
  {
    id: "handwriting-script",
    name: "Handwriting",
    subcategories: [
      {
        id: "casual",
        name: "Casual",
        fonts: [
          { id: "caveat", name: "Caveat", weights: [400, 500, 600, 700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 400, max: 700 }] },
          { id: "patrick-hand", name: "Patrick Hand", weights: [400], styles: ["normal"], variable: false },
          { id: "gloria-hallelujah", name: "Gloria Hallelujah", weights: [400], styles: ["normal"], variable: false },
          { id: "shadows-into-light", name: "Shadows Into Light", weights: [400], styles: ["normal"], variable: false },
          { id: "short-stack", name: "Short Stack", weights: [400], styles: ["normal"], variable: false },
          { id: "covered-by-your-grace", name: "Covered By Your Grace", weights: [400], styles: ["normal"], variable: false },
          { id: "handlee", name: "Handlee", weights: [400], styles: ["normal"], variable: false },
          { id: "reenie-beanie", name: "Reenie Beanie", weights: [400], styles: ["normal"], variable: false },
          { id: "waiting-for-the-sunrise", name: "Waiting for the Sunrise", weights: [400], styles: ["normal"], variable: false },
          { id: "kalam", name: "Kalam", weights: [300, 400, 700], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "brush",
        name: "Brush",
        fonts: [
          { id: "pacifico", name: "Pacifico", weights: [400], styles: ["normal"], variable: false },
          { id: "kaushan-script", name: "Kaushan Script", weights: [400], styles: ["normal"], variable: false },
          { id: "yellowtail", name: "Yellowtail", weights: [400], styles: ["normal"], variable: false },
          { id: "satisfy", name: "Satisfy", weights: [400], styles: ["normal"], variable: false },
          { id: "grand-hotel", name: "Grand Hotel", weights: [400], styles: ["normal"], variable: false },
          { id: "norican", name: "Norican", weights: [400], styles: ["normal"], variable: false },
          { id: "delius-swash-caps", name: "Delius Swash Caps", weights: [400], styles: ["normal"], variable: false },
          { id: "sacramento", name: "Sacramento", weights: [400], styles: ["normal"], variable: false },
          { id: "allura", name: "Allura", weights: [400], styles: ["normal"], variable: false },
          { id: "yesteryear", name: "Yesteryear", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "calligraphic",
        name: "Calligraphic",
        fonts: [
          { id: "great-vibes", name: "Great Vibes", weights: [400], styles: ["normal"], variable: false },
          { id: "dancing-script", name: "Dancing Script", weights: [400, 500, 600, 700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 400, max: 700 }] },
          { id: "parisienne", name: "Parisienne", weights: [400], styles: ["normal"], variable: false },
          { id: "tangerine", name: "Tangerine", weights: [400, 700], styles: ["normal"], variable: false },
          { id: "alex-brush", name: "Alex Brush", weights: [400], styles: ["normal"], variable: false },
          { id: "marck-script", name: "Marck Script", weights: [400], styles: ["normal"], variable: false },
          { id: "italianno", name: "Italianno", weights: [400], styles: ["normal"], variable: false },
          { id: "rouge-script", name: "Rouge Script", weights: [400], styles: ["normal"], variable: false },
          { id: "pinyon-script", name: "Pinyon Script", weights: [400], styles: ["normal"], variable: false },
          { id: "herr-von-muellerhoff", name: "Herr Von Muellerhoff", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },
  {
    id: "display-decorative",
    name: "Display & Decorative",
    subcategories: [
      {
        id: "modern-display",
        name: "Modern Display",
        fonts: [
          { id: "abril-fatface", name: "Abril Fatface", weights: [400], styles: ["normal"], variable: false },
          { id: "exo", name: "Exo", weights: [100, 200, 300, 400, 500, 600, 700, 800, 900], styles: ["normal", "italic"], variable: true, axes: [{ tag: "wght", min: 100, max: 900 }] },
          { id: "bungee", name: "Bungee", weights: [400], styles: ["normal"], variable: false },
          { id: "staatliches", name: "Staatliches", weights: [400], styles: ["normal"], variable: false },
          { id: "anton", name: "Anton", weights: [400], styles: ["normal"], variable: false },
          { id: "titan-one", name: "Titan One", weights: [400], styles: ["normal"], variable: false },
          { id: "black-ops-one", name: "Black Ops One", weights: [400], styles: ["normal"], variable: false },
          { id: "syncopate", name: "Syncopate", weights: [400, 700], styles: ["normal"], variable: false },
          { id: "righteous", name: "Righteous", weights: [400], styles: ["normal"], variable: false },
          { id: "fredoka-one", name: "Fredoka One", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "retro-vintage",
        name: "Retro / Vintage",
        fonts: [
          { id: "limelight", name: "Limelight", weights: [400], styles: ["normal"], variable: false },
          { id: "righteous", name: "Righteous", weights: [400], styles: ["normal"], variable: false },
          { id: "bowlby-one", name: "Bowlby One", weights: [400], styles: ["normal"], variable: false },
          { id: "bungee-shade", name: "Bungee Shade", weights: [400], styles: ["normal"], variable: false },
          { id: "bebas-neue", name: "Bebas Neue", weights: [400], styles: ["normal"], variable: false },
          { id: "alfa-slab-one", name: "Alfa Slab One", weights: [400], styles: ["normal"], variable: false },
          { id: "monoton", name: "Monoton", weights: [400], styles: ["normal"], variable: false },
          { id: "fascinate", name: "Fascinate", weights: [400], styles: ["normal"], variable: false },
          { id: "rye", name: "Rye", weights: [400], styles: ["normal"], variable: false },
          { id: "jomhuria", name: "Jomhuria", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "experimental",
        name: "Experimental",
        fonts: [
          { id: "unifrakturmaguntia", name: "UnifrakturMaguntia", weights: [400], styles: ["normal"], variable: false },
          { id: "unifrakturcook", name: "UnifrakturCook", weights: [700], styles: ["normal"], variable: false },
          { id: "fascinate-inline", name: "Fascinate Inline", weights: [400], styles: ["normal"], variable: false },
          { id: "creepster", name: "Creepster", weights: [400], styles: ["normal"], variable: false },
          { id: "blaka", name: "Blaka", weights: [400], styles: ["normal"], variable: false },
          { id: "fredericka-the-great", name: "Fredericka the Great", weights: [400], styles: ["normal"], variable: false },
          { id: "snowburst-one", name: "Snowburst One", weights: [400], styles: ["normal"], variable: false },
          { id: "megrim", name: "Megrim", weights: [400], styles: ["normal"], variable: false },
          { id: "wallpoet", name: "Wallpoet", weights: [400], styles: ["normal"], variable: false },
          { id: "ribeye-marrow", name: "Ribeye Marrow", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },
];
