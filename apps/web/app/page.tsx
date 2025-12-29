import { fontCategories } from "../data/fontCategories";
import { googleFontsMetadata } from "../data/googleFontsMetadata";
import type { EnrichedCategory, Font, FamilyMetadata } from "../data/types";
import PageClient from "./PageClient";

// Create a lookup map for fast font metadata access
const fontMetadataMap = new Map<string, FamilyMetadata>(
  googleFontsMetadata.familyMetadataList.map((font) => [font.family, font])
);

// Helper to extract weights from FamilyMetadata.fonts record
function extractWeights(fonts: Record<string, unknown>): number[] {
  const weights = new Set<number>();
  for (const key of Object.keys(fonts)) {
    // Keys are like "400", "400i", "700", "700i"
    const weight = parseInt(key, 10);
    if (!isNaN(weight)) {
      weights.add(weight);
    }
  }
  return Array.from(weights).sort((a, b) => a - b);
}

// Helper to extract styles from FamilyMetadata.fonts record
function extractStyles(fonts: Record<string, unknown>): ("normal" | "italic")[] {
  const styles = new Set<"normal" | "italic">();
  for (const key of Object.keys(fonts)) {
    if (key.endsWith("i")) {
      styles.add("italic");
    } else {
      styles.add("normal");
    }
  }
  return Array.from(styles);
}

// Helper to check if font is variable (has wght axis)
function isVariable(axes: { tag: string }[]): boolean {
  return axes.some((axis) => axis.tag === "wght");
}

// Helper to create font ID from name
function createFontId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// Process a font name into a full Font object
function processFont(fontName: string): Font | null {
  const metadata = fontMetadataMap.get(fontName);
  if (!metadata) {
    console.warn(`Font "${fontName}" not found in Google Fonts metadata`);
    return null;
  }

  return {
    id: createFontId(fontName),
    name: fontName,
    weights: extractWeights(metadata.fonts),
    styles: extractStyles(metadata.fonts),
    variable: isVariable(metadata.axes),
    metadata,
  };
}

// Build enriched categories with full font data
const enrichedFontCategories: EnrichedCategory[] = fontCategories.map((category) => ({
  id: category.id,
  name: category.name,
  subcategories: category.subcategories.map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    fonts: subcategory.fonts
      .map(processFont)
      .filter((font): font is Font => font !== null),
  })),
}));

export default function Page() {
  return <PageClient fontCategories={enrichedFontCategories} />;
}
