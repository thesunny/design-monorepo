export interface Subcategory {
  id: string;
  name: string;
  fonts: string[];
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
          "Lora", "Cardo", "Vollkorn", "Neuton", "Domine",
          "Gentium Book Basic", "Caudex", "Alice", "Averia Serif Libre", "Kameron"
        ],
      },
      {
        id: "transitional-modern",
        name: "Transitional / Modern",
        fonts: [
          "Merriweather", "Playfair Display", "Libre Baskerville", "Prata", "Cormorant",
          "Spectral", "Baskervville", "Crimson Text", "Cormorant Garamond", "Noto Serif"
        ],
      },
      {
        id: "slab-serif",
        name: "Slab Serif",
        fonts: [
          "Roboto Slab", "Arvo", "Slabo 27px", "Zilla Slab", "Bitter",
          "Ultra", "Alfa Slab One", "Bevan", "Vidaloka", "Josefin Slab"
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
          "Roboto", "Open Sans", "Inter", "Noto Sans", "Roboto Condensed",
          "PT Sans", "Hind", "Muli", "Work Sans", "Source Sans Pro"
        ],
      },
      {
        id: "geometric-sans",
        name: "Geometric Sans",
        fonts: [
          "Montserrat", "Poppins", "Lato", "Questrial", "Nunito",
          "Rubik", "Manrope", "Epilogue", "Outfit", "Jost"
        ],
      },
      {
        id: "humanist-sans",
        name: "Humanist Sans",
        fonts: [
          "Nunito Sans", "DM Sans", "Cabin", "Karla", "Ubuntu",
          "Asap", "Fira Sans", "Public Sans", "Overpass", "Source Sans 3"
        ],
      },
      {
        id: "display-sans",
        name: "Display Sans",
        fonts: [
          "Oswald", "Bebas Neue", "Anton", "Lexend", "Teko",
          "Archivo Black", "Barlow Condensed", "Staatliches", "League Spartan", "Bungee"
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
          "Source Code Pro", "IBM Plex Mono", "Ubuntu Mono", "Cousine", "Inconsolata",
          "Share Tech Mono", "Roboto Mono", "Cutive Mono", "Space Mono", "DM Mono"
        ],
      },
      {
        id: "retro-monospace",
        name: "Retro Monospace",
        fonts: [
          "VT323", "Major Mono Display", "Space Mono", "Press Start 2P", "Syne Mono",
          "Anonymous Pro", "Overpass Mono", "PT Mono", "Nova Mono", "DM Mono"
        ],
      },
    ],
  },
  {
    id: "handwriting-script",
    name: "Handwriting & Script",
    subcategories: [
      {
        id: "casual",
        name: "Casual",
        fonts: [
          "Caveat", "Patrick Hand", "Gloria Hallelujah", "Shadows Into Light", "Short Stack",
          "Covered By Your Grace", "Handlee", "Reenie Beanie", "Waiting for the Sunrise", "Kalam"
        ],
      },
      {
        id: "brush",
        name: "Brush",
        fonts: [
          "Pacifico", "Kaushan Script", "Yellowtail", "Satisfy", "Grand Hotel",
          "Norican", "Delius Swash Caps", "Sacramento", "Allura", "Yesteryear"
        ],
      },
      {
        id: "calligraphic",
        name: "Calligraphic",
        fonts: [
          "Great Vibes", "Dancing Script", "Parisienne", "Tangerine", "Alex Brush",
          "Marck Script", "Italianno", "Rouge Script", "Pinyon Script", "Herr Von Muellerhoff"
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
          "Abril Fatface", "Exo", "Bungee", "Staatliches", "Anton",
          "Titan One", "Black Ops One", "Syncopate", "Righteous", "Fredoka One"
        ],
      },
      {
        id: "retro-vintage",
        name: "Retro / Vintage",
        fonts: [
          "Limelight", "Righteous", "Bowlby One", "Bungee Shade", "Bebas Neue",
          "Alfa Slab One", "Monoton", "Fascinate", "Rye", "Jomhuria"
        ],
      },
      {
        id: "experimental",
        name: "Experimental",
        fonts: [
          "UnifrakturMaguntia", "UnifrakturCook", "Fascinate Inline", "Creepster", "Blaka",
          "Fredericka the Great", "Snowburst One", "Megrim", "Wallpoet", "Ribeye Marrow"
        ],
      },
    ],
  },
];
