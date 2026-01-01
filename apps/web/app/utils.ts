import type { Font, FamilyMetadata } from "../data/types";

/**
 * Checks if a font is a monospace font based on its category metadata.
 */
export function isMonospaceFont(font: Font | undefined | null): boolean {
  return font?.metadata.category === "Monospace";
}

/**
 * Checks if font metadata indicates a monospace font.
 */
export function isMonospaceMetadata(metadata: FamilyMetadata | undefined | null): boolean {
  return metadata?.category === "Monospace";
}
