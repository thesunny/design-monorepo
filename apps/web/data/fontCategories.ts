import { googleFontsMetadata } from "./googleFontsMetadata";

export type Subcategory = {
  id: string;
  name: string;
  fonts: string[];
};

export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

const baseFontCategories: Category[] = [
  {
    id: "sans-serif",
    name: "Sans Serif",
    subcategories: [
      {
        id: "modern-sans",
        name: "Modern",
        fonts: [
          "Roboto",
          "Inter",
          "Open Sans",
          "Noto Sans",
          "Source Sans 3",
          "IBM Plex Sans",
          "Arimo",
          "Libre Franklin",
          "PT Sans",
          "Assistant",
          "Barlow",
          "Archivo",
          "Plus Jakarta Sans",
          "Figtree",
          "Red Hat Display",
          "Red Hat Text",
          "Urbanist",
          "Josefin Sans",
          "Raleway",
        ],
      },
      {
        id: "geometric-sans",
        name: "Geometric",
        fonts: [
          "Montserrat",
          "Poppins",
          "Lato",
          "Nunito",
          "Rubik",
          "Manrope",
          "Work Sans",
          "Mulish",
          "Outfit",
          "Jost",
          "Epilogue",
          "Space Grotesk",
          "Sora",
          "Prompt",
          "Rubik Mono One",
          "Questrial",
        ],
      },
      {
        id: "humanist-sans",
        name: "Friendly",
        fonts: [
          "DM Sans",
          "Nunito Sans",
          "Karla",
          "Cabin",
          "Asap",
          "Public Sans",
          "Overpass",
          "Hind",
          "Oxygen",
          "Merriweather Sans",
          "PT Sans Caption",
          "Heebo",
          "Albert Sans",
          "News Cycle",
          "Noto Sans Display",
          "Fira Sans",
          "Ubuntu",
        ],
      },
      {
        id: "condensed-sans",
        name: "Condensed",
        fonts: [
          "Roboto Condensed",
          "Oswald",
          "Archivo Narrow",
          "Barlow Condensed",
          "Assistant",
          "Cabin Condensed",
          "Yantramanav",
          "Rajdhani",
          "Teko",
        ],
      },
      {
        id: "display-sans",
        name: "Display",
        fonts: [
          "Anton",
          "Bebas Neue",
          "League Spartan",
          "Lexend",
          "Archivo Black",
          "Staatliches",
          "Bungee",
          "Righteous",
          "Fredoka",
          "Comfortaa",
          "Archivo",
          "Cinzel",
          "Poiret One",
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
          "Lora",
          "Vollkorn",
          "Crimson Text",
          "Crimson Pro",
          "EB Garamond",
          "Alegreya",
          "Gentium Book Plus",
          "Cardo",
          "Neuton",
          "Domine",
          "Spectral",
          "Source Serif 4",
          "Libre Caslon Text",
          "Cormorant",
          "Cormorant Garamond",
          "PT Serif",
          "Kalam",
        ],
      },
      {
        id: "transitional",
        name: "Modern",
        fonts: [
          "Merriweather",
          "Libre Baskerville",
          "Noto Serif",
          "Baskervville",
          "Gentium Plus",
          "Crete Round",
          "Literata",
          "Old Standard TT",
          "Cormorant Infant",
        ],
      },
      {
        id: "thin-serif",
        name: "Thin",
        fonts: [
          "Playfair Display",
          "Bodoni Moda",
          "Prata",
          "DM Serif Display",
          "DM Serif Text",
          "Fanwood Text",
          "GFS Didot",
        ],
      },
      {
        id: "slab-serif",
        name: "Slab",
        fonts: [
          "Roboto Slab",
          "Bitter",
          "Arvo",
          "Zilla Slab",
          "Rokkitt",
          "Aleo",
          "Bree Serif",
          "Poppins",
          "Courier Prime",
          "Alfa Slab One",
          "Ultra",
          "Bevan",
          "Josefin Slab",
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
          "JetBrains Mono",
          "Fira Code",
          "Source Code Pro",
          "Roboto Mono",
          "Inconsolata",
          "IBM Plex Mono",
          "Ubuntu Mono",
          "Space Mono",
          "DM Mono",
          "Cousine",
          "Anonymous Pro",
          "PT Mono",
          "Share Tech Mono",
          "Red Hat Mono",
          "Azeret Mono",
          "Sono",
          "Chivo Mono",
          "Fragment Mono",
          "Martian Mono",
          "Spline Sans Mono",
        ],
      },
      {
        id: "retro-monospace",
        name: "Retro",
        fonts: [
          "VT323",
          "Press Start 2P",
          "Major Mono Display",
          "Syne Mono",
          "Nova Mono",
          "Overpass Mono",
          "Cutive Mono",
          "Special Elite",
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
          "Caveat",
          "Kalam",
          "Patrick Hand",
          "Indie Flower",
          "Architects Daughter",
          "Gloria Hallelujah",
          "Shadows Into Light",
          "Handlee",
          "Reenie Beanie",
          "Covered By Your Grace",
          "Waiting for the Sunrise",
          "Just Another Hand",
          "Coming Soon",
          "Gowun Batang",
        ],
      },
      {
        id: "marker-comic",
        name: "Marker",
        fonts: [
          "Permanent Marker",
          "Rock Salt",
          "Bangers",
          "Luckiest Guy",
          "Chewy",
          "Itim",
          "Comic Neue",
        ],
      },
      {
        id: "brush",
        name: "Brush",
        fonts: [
          "Pacifico",
          "Lobster",
          "Lobster Two",
          "Kaushan Script",
          "Yellowtail",
          "Satisfy",
          "Grand Hotel",
          "Norican",
          "Sacramento",
          "Allura",
          "Yesteryear",
        ],
      },
      {
        id: "calligraphic",
        name: "Calligraphy",
        fonts: [
          "Dancing Script",
          "Great Vibes",
          "Alex Brush",
          "Parisienne",
          "Tangerine",
          "Pinyon Script",
          "Herr Von Muellerhoff",
          "Rouge Script",
          "Italianno",
          "Marck Script",
          "Bad Script",
          "Cookie",
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
          "Abril Fatface",
          "Exo",
          "Orbitron",
          "Audiowide",
          "Syncopate",
          "Black Ops One",
          "Titan One",
          "Righteous",
          "Bungee",
          "Staatliches",
          "Anton",
          "Fredoka One",
        ],
      },
      {
        id: "retro-vintage",
        name: "Retro",
        fonts: [
          "Limelight",
          "Bowlby One",
          "Bowlby One SC",
          "Bungee Shade",
          "Bebas Neue",
          "Alfa Slab One",
          "Monoton",
          "Fascinate",
          "Rye",
          "Jomhuria",
          "Luckiest Guy",
        ],
      },
      {
        id: "gothic",
        name: "Gothic",
        fonts: [
          "UnifrakturMaguntia",
          "UnifrakturCook",
          "Pirata One",
        ],
      },
      {
        id: "experimental",
        name: "Experimental",
        fonts: [
          "Fascinate Inline",
          "Creepster",
          "Blaka",
          "Fredericka the Great",
          "Snowburst One",
          "Megrim",
          "Wallpoet",
          "Ribeye Marrow",
          "Rubik Beastly",
          "Rubik Glitch",
          "Rubik Bubbles",
        ],
      },
    ],
  },
];

// Extract all fonts already used in baseFontCategories
const usedFonts = new Set<string>(
  baseFontCategories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) => subcategory.fonts)
  )
);

// Create a map of font name to popularity for sorting
const fontPopularity = new Map<string, number>(
  googleFontsMetadata.familyMetadataList.map((font) => [font.family, font.popularity])
);

// Sort fonts by popularity (lower number = more popular)
const sortByPopularity = (fonts: string[]): string[] =>
  [...fonts].sort((a, b) => (fontPopularity.get(a) ?? Infinity) - (fontPopularity.get(b) ?? Infinity));

// Group fonts by category and sort by popularity
const fontsByCategory = new Map<string, string[]>();
const sortedFonts = [...googleFontsMetadata.familyMetadataList].sort(
  (a, b) => a.popularity - b.popularity
);
for (const font of sortedFonts) {
  if (!fontsByCategory.has(font.category)) {
    fontsByCategory.set(font.category, []);
  }
  fontsByCategory.get(font.category)!.push(font.family);
}

// Get fonts for a category, filtering out already used fonts
const getMoreFonts = (categoryName: string): string[] => {
  const fonts = fontsByCategory.get(categoryName) || [];
  return fonts.filter((font) => !usedFonts.has(font));
};

// Extend baseFontCategories with "More..." subcategory and sort all fonts by popularity
export const fontCategories: Category[] = baseFontCategories.map((category) => ({
  ...category,
  subcategories: [
    ...category.subcategories.map((subcategory) => ({
      ...subcategory,
      fonts: sortByPopularity(subcategory.fonts),
    })),
    {
      id: `${category.id}-more`,
      name: "More...",
      fonts: getMoreFonts(category.name),
    },
  ],
}));
