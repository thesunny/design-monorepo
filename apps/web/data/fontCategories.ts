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
    id: "sans-serif",
    name: "Sans Serif",
    subcategories: [
      {
        id: "modern-sans",
        name: "Modern",
        fonts: [
          { id: "roboto", name: "Roboto", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "inter", name: "Inter", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "open-sans", name: "Open Sans", weights: [300,400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "noto-sans", name: "Noto Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "source-sans-3", name: "Source Sans 3", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "ibm-plex-sans", name: "IBM Plex Sans", weights: [100,200,300,400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "arimo", name: "Arimo", weights: [400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "libre-franklin", name: "Libre Franklin", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "pt-sans", name: "PT Sans", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "assistant", name: "Assistant", weights: [200,300,400,500,600,700,800], styles: ["normal"], variable: false },
          { id: "barlow", name: "Barlow", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "archivo", name: "Archivo", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", weights: [200,300,400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "figtree", name: "Figtree", weights: [300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "red-hat-display", name: "Red Hat Display", weights: [300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "red-hat-text", name: "Red Hat Text", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "urbanist", name: "Urbanist", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "josefin-sans", name: "Josefin Sans", weights: [100,200,300,400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "raleway", name: "Raleway", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
        ],
      },
      {
        id: "geometric-sans",
        name: "Geometric",
        fonts: [
          { id: "montserrat", name: "Montserrat", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "poppins", name: "Poppins", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "lato", name: "Lato", weights: [100,300,400,700,900], styles: ["normal","italic"], variable: false },
          { id: "nunito", name: "Nunito", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "rubik", name: "Rubik", weights: [300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "manrope", name: "Manrope", weights: [200,300,400,500,600,700,800], styles: ["normal"], variable: true },
          { id: "work-sans", name: "Work Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "mulish", name: "Mulish", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "outfit", name: "Outfit", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "jost", name: "Jost", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "epilogue", name: "Epilogue", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "space-grotesk", name: "Space Grotesk", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "sora", name: "Sora", weights: [100,200,300,400,500,600,700,800], styles: ["normal"], variable: true },
          { id: "prompt", name: "Prompt", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "rubik-mono-one", name: "Rubik Mono One", weights: [400], styles: ["normal"], variable: false },
          { id: "questrial", name: "Questrial", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "humanist-sans",
        name: "Friendly",
        fonts: [
          { id: "dm-sans", name: "DM Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "nunito-sans", name: "Nunito Sans", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "karla", name: "Karla", weights: [200,300,400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "cabin", name: "Cabin", weights: [400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "asap", name: "Asap", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "public-sans", name: "Public Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "overpass", name: "Overpass", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "hind", name: "Hind", weights: [300,400,500,600,700], styles: ["normal"], variable: false },
          { id: "oxygen", name: "Oxygen", weights: [300,400,700], styles: ["normal"], variable: false },
          { id: "merriweather-sans", name: "Merriweather Sans", weights: [300,400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "pt-sans-caption", name: "PT Sans Caption", weights: [400,700], styles: ["normal"], variable: false },
          { id: "heebo", name: "Heebo", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: false },
          { id: "albert-sans", name: "Albert Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "news-cycle", name: "News Cycle", weights: [400,700], styles: ["normal"], variable: false },
          { id: "noto-sans-display", name: "Noto Sans Display", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "fira-sans", name: "Fira Sans", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "ubuntu", name: "Ubuntu", weights: [300,400,500,700], styles: ["normal","italic"], variable: false },
        ],
      },
      {
        id: "condensed-sans",
        name: "Condensed",
        fonts: [
          { id: "roboto-condensed", name: "Roboto Condensed", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "oswald", name: "Oswald", weights: [200,300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "archivo-narrow", name: "Archivo Narrow", weights: [400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "barlow-condensed", name: "Barlow Condensed", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false },
          { id: "assistant", name: "Assistant", weights: [200,300,400,500,600,700,800], styles: ["normal"], variable: false },
          { id: "cabin-condensed", name: "Cabin Condensed", weights: [400,500,600,700], styles: ["normal"], variable: false },
          { id: "yantramanav", name: "Yantramanav", weights: [100,300,400,500,700,900], styles: ["normal"], variable: false },
          { id: "rajdhani", name: "Rajdhani", weights: [300,400,500,600,700], styles: ["normal"], variable: false },
          { id: "teko", name: "Teko", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "noto-sans-condensed", name: "Noto Sans Condensed", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
        ],
      },
      {
        id: "display-sans",
        name: "Display",
        fonts: [
          { id: "anton", name: "Anton", weights: [400], styles: ["normal"], variable: false },
          { id: "bebas-neue", name: "Bebas Neue", weights: [400], styles: ["normal"], variable: false },
          { id: "league-spartan", name: "League Spartan", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "lexend", name: "Lexend", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "archivo-black", name: "Archivo Black", weights: [400], styles: ["normal"], variable: false },
          { id: "staatliches", name: "Staatliches", weights: [400], styles: ["normal"], variable: false },
          { id: "bungee", name: "Bungee", weights: [400], styles: ["normal"], variable: false },
          { id: "righteous", name: "Righteous", weights: [400], styles: ["normal"], variable: false },
          { id: "fredoka", name: "Fredoka", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "comfortaa", name: "Comfortaa", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "archivo", name: "Archivo", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "cinzel", name: "Cinzel", weights: [400,500,600,700,800,900], styles: ["normal"], variable: false },
          { id: "poiret-one", name: "Poiret One", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },

  {
    id: "serif",
    name: "Serif",
    subcategories: [
      {
        id: "classic",
        name: "Classic",
        fonts: [
          { id: "lora", name: "Lora", weights: [400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "vollkorn", name: "Vollkorn", weights: [400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "crimson-text", name: "Crimson Text", weights: [400,600,700], styles: ["normal","italic"], variable: false },
          { id: "crimson-pro", name: "Crimson Pro", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "eb-garamond", name: "EB Garamond", weights: [400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "alegreya", name: "Alegreya", weights: [400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "gentium-book-plus", name: "Gentium Book Plus", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "cardo", name: "Cardo", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "neuton", name: "Neuton", weights: [200,300,400,700,800], styles: ["normal","italic"], variable: false },
          { id: "domine", name: "Domine", weights: [400,500,600,700], styles: ["normal"], variable: true },
          { id: "spectral", name: "Spectral", weights: [200,300,400,500,600,700,800], styles: ["normal","italic"], variable: false },
          { id: "source-serif-4", name: "Source Serif 4", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "libre-caslon-text", name: "Libre Caslon Text", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "cormorant", name: "Cormorant", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "cormorant-garamond", name: "Cormorant Garamond", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "pt-serif", name: "PT Serif", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "kalam", name: "Kalam", weights: [300,400,700], styles: ["normal"], variable: false }, // (kept here? remove if you want handwriting-only)
        ],
      },
      {
        id: "transitional",
        name: "Modern",
        fonts: [
          { id: "merriweather", name: "Merriweather", weights: [300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "libre-baskerville", name: "Libre Baskerville", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "noto-serif", name: "Noto Serif", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "baskervville", name: "Baskervville", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "gentium-plus", name: "Gentium Plus", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "crete-round", name: "Crete Round", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "literata", name: "Literata", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "old-standard-tt", name: "Old Standard TT", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "alegreya-serif", name: "Alegreya Serif", weights: [400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "cormorant-infant", name: "Cormorant Infant", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: false },
        ],
      },
      {
        id: "thin-serif",
        name: "Thin",
        fonts: [
          { id: "playfair-display", name: "Playfair Display", weights: [400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "bodoni-moda", name: "Bodoni Moda", weights: [400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "prata", name: "Prata", weights: [400], styles: ["normal"], variable: false },
          { id: "dm-serif-display", name: "DM Serif Display", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "dm-serif-text", name: "DM Serif Text", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "fanwood-text", name: "Fanwood Text", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "gfs-didot", name: "GFS Didot", weights: [400], styles: ["normal"], variable: false },
          { id: "orpheus-pro", name: "Orpheus Pro", weights: [400,500,600,700], styles: ["normal","italic"], variable: false },
        ],
      },
      {
        id: "slab-serif",
        name: "Slab",
        fonts: [
          { id: "roboto-slab", name: "Roboto Slab", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "bitter", name: "Bitter", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "arvo", name: "Arvo", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "zilla-slab", name: "Zilla Slab", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "rokkitt", name: "Rokkitt", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "aleo", name: "Aleo", weights: [300,400,700], styles: ["normal","italic"], variable: true },
          { id: "bree-serif", name: "Bree Serif", weights: [400], styles: ["normal"], variable: false },
          { id: "poppins", name: "Poppins", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: false }, // (remove if you want no cross-category repeats)
          { id: "courier-prime", name: "Courier Prime", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "alfa-slab-one", name: "Alfa Slab One", weights: [400], styles: ["normal"], variable: false },
          { id: "ultra", name: "Ultra", weights: [400], styles: ["normal"], variable: false },
          { id: "bevan", name: "Bevan", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "josefin-slab", name: "Josefin Slab", weights: [100,200,300,400,500,600,700], styles: ["normal","italic"], variable: true },
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
        name: "Code",
        fonts: [
          { id: "jetbrains-mono", name: "JetBrains Mono", weights: [100,200,300,400,500,600,700,800], styles: ["normal","italic"], variable: true },
          { id: "fira-code", name: "Fira Code", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
          { id: "source-code-pro", name: "Source Code Pro", weights: [200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true, axes: [{ tag: "wght", min: 200, max: 900 }] },
          { id: "roboto-mono", name: "Roboto Mono", weights: [100,200,300,400,500,600,700], styles: ["normal","italic"], variable: true, axes: [{ tag: "wght", min: 100, max: 700 }] },
          { id: "inconsolata", name: "Inconsolata", weights: [200,300,400,500,600,700,800,900], styles: ["normal"], variable: true, axes: [{ tag: "wdth", min: 50, max: 200 }, { tag: "wght", min: 200, max: 900 }] },
          { id: "ibm-plex-mono", name: "IBM Plex Mono", weights: [100,200,300,400,500,600,700], styles: ["normal","italic"], variable: false },
          { id: "ubuntu-mono", name: "Ubuntu Mono", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "space-mono", name: "Space Mono", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "dm-mono", name: "DM Mono", weights: [300,400,500], styles: ["normal","italic"], variable: false },
          { id: "cousine", name: "Cousine", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "anonymous-pro", name: "Anonymous Pro", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "pt-mono", name: "PT Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "share-tech-mono", name: "Share Tech Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "red-hat-mono", name: "Red Hat Mono", weights: [300,400,500,600,700], styles: ["normal","italic"], variable: true },
          { id: "azeret-mono", name: "Azeret Mono", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true },
          { id: "sono", name: "Sono", weights: [200,300,400,500,600,700,800], styles: ["normal"], variable: true },
          { id: "chivo-mono", name: "Chivo Mono", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal"], variable: true },
          { id: "fragment-mono", name: "Fragment Mono", weights: [400], styles: ["normal","italic"], variable: false },
          { id: "martian-mono", name: "Martian Mono", weights: [100,200,300,400,500,600,700,800], styles: ["normal"], variable: true },
          { id: "spline-sans-mono", name: "Spline Sans Mono", weights: [300,400,500,600,700], styles: ["normal"], variable: true },
        ],
      },
      {
        id: "retro-monospace",
        name: "Retro",
        fonts: [
          { id: "vt323", name: "VT323", weights: [400], styles: ["normal"], variable: false },
          { id: "press-start-2p", name: "Press Start 2P", weights: [400], styles: ["normal"], variable: false },
          { id: "major-mono-display", name: "Major Mono Display", weights: [400], styles: ["normal"], variable: false },
          { id: "syne-mono", name: "Syne Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "nova-mono", name: "Nova Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "overpass-mono", name: "Overpass Mono", weights: [300,400,500,600,700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 300, max: 700 }] },
          { id: "cutive-mono", name: "Cutive Mono", weights: [400], styles: ["normal"], variable: false },
          { id: "special-elite", name: "Special Elite", weights: [400], styles: ["normal"], variable: false },
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
          { id: "caveat", name: "Caveat", weights: [400,500,600,700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 400, max: 700 }] },
          { id: "kalam", name: "Kalam", weights: [300,400,700], styles: ["normal"], variable: false },
          { id: "patrick-hand", name: "Patrick Hand", weights: [400], styles: ["normal"], variable: false },
          { id: "indie-flower", name: "Indie Flower", weights: [400], styles: ["normal"], variable: false },
          { id: "architects-daughter", name: "Architects Daughter", weights: [400], styles: ["normal"], variable: false },
          { id: "gloria-hallelujah", name: "Gloria Hallelujah", weights: [400], styles: ["normal"], variable: false },
          { id: "shadows-into-light", name: "Shadows Into Light", weights: [400], styles: ["normal"], variable: false },
          { id: "handlee", name: "Handlee", weights: [400], styles: ["normal"], variable: false },
          { id: "reenie-beanie", name: "Reenie Beanie", weights: [400], styles: ["normal"], variable: false },
          { id: "covered-by-your-grace", name: "Covered By Your Grace", weights: [400], styles: ["normal"], variable: false },
          { id: "waiting-for-the-sunrise", name: "Waiting for the Sunrise", weights: [400], styles: ["normal"], variable: false },
          { id: "just-another-hand", name: "Just Another Hand", weights: [400], styles: ["normal"], variable: false },
          { id: "coming-soon", name: "Coming Soon", weights: [400], styles: ["normal"], variable: false },
          { id: "gowun-batang", name: "Gowun Batang", weights: [400,700], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "marker-comic",
        name: "Marker",
        fonts: [
          { id: "permanent-marker", name: "Permanent Marker", weights: [400], styles: ["normal"], variable: false },
          { id: "rock-salt", name: "Rock Salt", weights: [400], styles: ["normal"], variable: false },
          { id: "bangers", name: "Bangers", weights: [400], styles: ["normal"], variable: false },
          { id: "luckiest-guy", name: "Luckiest Guy", weights: [400], styles: ["normal"], variable: false },
          { id: "chewy", name: "Chewy", weights: [400], styles: ["normal"], variable: false },
          { id: "itim", name: "Itim", weights: [400], styles: ["normal"], variable: false },
          { id: "comic-neue", name: "Comic Neue", weights: [300,400,700], styles: ["normal","italic"], variable: false },
        ],
      },
      {
        id: "brush",
        name: "Brush",
        fonts: [
          { id: "pacifico", name: "Pacifico", weights: [400], styles: ["normal"], variable: false },
          { id: "lobster", name: "Lobster", weights: [400], styles: ["normal"], variable: false },
          { id: "lobster-two", name: "Lobster Two", weights: [400,700], styles: ["normal","italic"], variable: false },
          { id: "kaushan-script", name: "Kaushan Script", weights: [400], styles: ["normal"], variable: false },
          { id: "yellowtail", name: "Yellowtail", weights: [400], styles: ["normal"], variable: false },
          { id: "satisfy", name: "Satisfy", weights: [400], styles: ["normal"], variable: false },
          { id: "grand-hotel", name: "Grand Hotel", weights: [400], styles: ["normal"], variable: false },
          { id: "norican", name: "Norican", weights: [400], styles: ["normal"], variable: false },
          { id: "sacramento", name: "Sacramento", weights: [400], styles: ["normal"], variable: false },
          { id: "allura", name: "Allura", weights: [400], styles: ["normal"], variable: false },
          { id: "yesteryear", name: "Yesteryear", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "calligraphic",
        name: "Calligraphy",
        fonts: [
          { id: "dancing-script", name: "Dancing Script", weights: [400,500,600,700], styles: ["normal"], variable: true, axes: [{ tag: "wght", min: 400, max: 700 }] },
          { id: "great-vibes", name: "Great Vibes", weights: [400], styles: ["normal"], variable: false },
          { id: "alex-brush", name: "Alex Brush", weights: [400], styles: ["normal"], variable: false },
          { id: "parisienne", name: "Parisienne", weights: [400], styles: ["normal"], variable: false },
          { id: "tangerine", name: "Tangerine", weights: [400,700], styles: ["normal"], variable: false },
          { id: "pinyon-script", name: "Pinyon Script", weights: [400], styles: ["normal"], variable: false },
          { id: "herr-von-muellerhoff", name: "Herr Von Muellerhoff", weights: [400], styles: ["normal"], variable: false },
          { id: "rouge-script", name: "Rouge Script", weights: [400], styles: ["normal"], variable: false },
          { id: "italianno", name: "Italianno", weights: [400], styles: ["normal"], variable: false },
          { id: "marck-script", name: "Marck Script", weights: [400], styles: ["normal"], variable: false },
          { id: "bad-script", name: "Bad Script", weights: [400], styles: ["normal"], variable: false },
          { id: "cookie", name: "Cookie", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },

  {
    id: "display-decorative",
    name: "Display",
    subcategories: [
      {
        id: "modern-display",
        name: "Modern",
        fonts: [
          { id: "abril-fatface", name: "Abril Fatface", weights: [400], styles: ["normal"], variable: false },
          { id: "exo", name: "Exo", weights: [100,200,300,400,500,600,700,800,900], styles: ["normal","italic"], variable: true, axes: [{ tag: "wght", min: 100, max: 900 }] },
          { id: "orbitron", name: "Orbitron", weights: [400,500,600,700,800,900], styles: ["normal"], variable: false },
          { id: "audiowide", name: "Audiowide", weights: [400], styles: ["normal"], variable: false },
          { id: "syncopate", name: "Syncopate", weights: [400,700], styles: ["normal"], variable: false },
          { id: "black-ops-one", name: "Black Ops One", weights: [400], styles: ["normal"], variable: false },
          { id: "titan-one", name: "Titan One", weights: [400], styles: ["normal"], variable: false },
          { id: "righteous", name: "Righteous", weights: [400], styles: ["normal"], variable: false },
          { id: "bungee", name: "Bungee", weights: [400], styles: ["normal"], variable: false },
          { id: "staatliches", name: "Staatliches", weights: [400], styles: ["normal"], variable: false },
          { id: "anton", name: "Anton", weights: [400], styles: ["normal"], variable: false },
          { id: "fredoka-one", name: "Fredoka One", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "retro-vintage",
        name: "Retro",
        fonts: [
          { id: "limelight", name: "Limelight", weights: [400], styles: ["normal"], variable: false },
          { id: "bowlby-one", name: "Bowlby One", weights: [400], styles: ["normal"], variable: false },
          { id: "bowlby-one-sc", name: "Bowlby One SC", weights: [400], styles: ["normal"], variable: false },
          { id: "bungee-shade", name: "Bungee Shade", weights: [400], styles: ["normal"], variable: false },
          { id: "bebas-neue", name: "Bebas Neue", weights: [400], styles: ["normal"], variable: false },
          { id: "alfa-slab-one", name: "Alfa Slab One", weights: [400], styles: ["normal"], variable: false },
          { id: "monoton", name: "Monoton", weights: [400], styles: ["normal"], variable: false },
          { id: "fascinate", name: "Fascinate", weights: [400], styles: ["normal"], variable: false },
          { id: "rye", name: "Rye", weights: [400], styles: ["normal"], variable: false },
          { id: "jomhuria", name: "Jomhuria", weights: [400], styles: ["normal"], variable: false },
          { id: "luckiest-guy", name: "Luckiest Guy", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "gothic",
        name: "Gothic",
        fonts: [
          { id: "unifrakturmaguntia", name: "UnifrakturMaguntia", weights: [400], styles: ["normal"], variable: false },
          { id: "unifrakturcook", name: "UnifrakturCook", weights: [700], styles: ["normal"], variable: false },
          { id: "pirata-one", name: "Pirata One", weights: [400], styles: ["normal"], variable: false },
          { id: "engravers-old-english", name: "Engravers Old English", weights: [400], styles: ["normal"], variable: false },
        ],
      },
      {
        id: "experimental",
        name: "Experimental",
        fonts: [
          { id: "fascinate-inline", name: "Fascinate Inline", weights: [400], styles: ["normal"], variable: false },
          { id: "creepster", name: "Creepster", weights: [400], styles: ["normal"], variable: false },
          { id: "blaka", name: "Blaka", weights: [400], styles: ["normal"], variable: false },
          { id: "fredericka-the-great", name: "Fredericka the Great", weights: [400], styles: ["normal"], variable: false },
          { id: "snowburst-one", name: "Snowburst One", weights: [400], styles: ["normal"], variable: false },
          { id: "megrim", name: "Megrim", weights: [400], styles: ["normal"], variable: false },
          { id: "wallpoet", name: "Wallpoet", weights: [400], styles: ["normal"], variable: false },
          { id: "ribeye-marrow", name: "Ribeye Marrow", weights: [400], styles: ["normal"], variable: false },
          { id: "rubik-beastly", name: "Rubik Beastly", weights: [400], styles: ["normal"], variable: false },
          { id: "rubik-glitch", name: "Rubik Glitch", weights: [400], styles: ["normal"], variable: false },
          { id: "rubik-bubbles", name: "Rubik Bubbles", weights: [400], styles: ["normal"], variable: false },
        ],
      },
    ],
  },
];