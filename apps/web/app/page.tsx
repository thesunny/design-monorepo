import { Suspense } from "react";
import { fontCategories } from "../data/fontCategories";
import { googleFontsMetadata } from "../data/googleFontsMetadata";
import type { Font, FamilyMetadata } from "../data/types";
import PageClient from "./PageClient";

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

// Process FamilyMetadata into a Font object
function processFontMetadata(metadata: FamilyMetadata): Font {
  return {
    id: createFontId(metadata.family),
    name: metadata.family,
    weights: extractWeights(metadata.fonts),
    styles: extractStyles(metadata.fonts),
    variable: isVariable(metadata.axes),
    metadata,
  };
}

// Process all fonts from Google Fonts metadata
const allFonts: Font[] = googleFontsMetadata.familyMetadataList.map(processFontMetadata);

// Check if we're in development mode (server-side)
const isDevelopment = process.env.NODE_ENV === "development";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageClient fontCategories={fontCategories} allFonts={allFonts} isDevelopment={isDevelopment} />
    </Suspense>
  );
}
