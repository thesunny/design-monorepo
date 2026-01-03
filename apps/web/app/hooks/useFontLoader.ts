import { useEffect, useRef, useState } from "react";
import FontFaceObserver from "fontfaceobserver";
import type { Font, FontAxis } from "../../data/types";

/**
 * Sorts axes according to Google Fonts API requirements:
 * - ital always comes first (if present)
 * - Then lowercase registered axes (opsz, slnt, wdth, wght) alphabetically
 * - Then uppercase custom axes (GRAD, XTRA, etc.) alphabetically
 */
function sortAxes(axes: FontAxis[]): FontAxis[] {
  return [...axes].sort((a, b) => {
    // ital always first
    if (a.tag === "ital") return -1;
    if (b.tag === "ital") return 1;

    const aIsUpper = a.tag[0]!.toUpperCase() === a.tag[0];
    const bIsUpper = b.tag[0]!.toUpperCase() === b.tag[0];

    // Lowercase (registered) axes come before uppercase (custom) axes
    if (!aIsUpper && bIsUpper) return -1;
    if (aIsUpper && !bIsUpper) return 1;

    // Within same case, sort alphabetically
    return a.tag.localeCompare(b.tag);
  });
}

/**
 * Builds a stable Google Fonts URL for a single font family.
 * The URL includes all weights, italic variants, and variable axes if available.
 */
function buildFontUrl(font: Font): string {
  const encodedName = font.name.replace(/ /g, "+");
  const hasItalic = font.styles.includes("italic");

  let familyParam: string;

  if (font.variable) {
    const axes = font.metadata.axes;
    const hasItalAxis = axes.some((a) => a.tag === "ital");

    // Sort axes according to Google Fonts requirements
    const sortedAxes = sortAxes(axes);

    if (hasItalAxis) {
      // Font has ital axis - use ranges for all axes including ital
      const axisTags = sortedAxes.map((a) => a.tag).join(",");
      const axisRanges = sortedAxes.map((a) => `${a.min}..${a.max}`).join(",");
      familyParam = `${encodedName}:${axisTags}@${axisRanges}`;
    } else if (hasItalic) {
      // Font has italic styles but no ital axis - enumerate 0 and 1 for ital
      const axisTags = ["ital", ...sortedAxes.map((a) => a.tag)].join(",");
      const axisRanges = sortedAxes.map((a) => `${a.min}..${a.max}`).join(",");
      const normalRanges = `0,${axisRanges}`;
      const italicRanges = `1,${axisRanges}`;
      familyParam = `${encodedName}:${axisTags}@${normalRanges};${italicRanges}`;
    } else {
      // No italic at all
      const axisTags = sortedAxes.map((a) => a.tag).join(",");
      const axisRanges = sortedAxes.map((a) => `${a.min}..${a.max}`).join(",");
      familyParam = `${encodedName}:${axisTags}@${axisRanges}`;
    }
  } else {
    if (hasItalic) {
      // Static font with italic: ital,wght@0,w1;0,w2;1,w1;1,w2
      const normalWeights = font.weights.map((w) => `0,${w}`).join(";");
      const italicWeights = font.weights.map((w) => `1,${w}`).join(";");
      familyParam = `${encodedName}:ital,wght@${normalWeights};${italicWeights}`;
    } else {
      familyParam = `${encodedName}:wght@${font.weights.join(";")}`;
    }
  }

  return `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
}

/**
 * Hook that manages font loading with one link element per font family.
 * This maximizes browser caching since each font has a stable URL.
 *
 * @param fonts - Array of Font objects to load
 * @returns loadedFonts and failedFonts Sets (by font ID)
 */
export function useFontLoader(fonts: Font[]) {
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [failedFonts, setFailedFonts] = useState<Set<string>>(new Set());

  // Track which fonts have link elements created (persists across renders)
  const createdLinksRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fontsToLoad = fonts.filter(
      (font) =>
        !loadedFonts.has(font.id) &&
        !failedFonts.has(font.id) &&
        !createdLinksRef.current.has(font.id)
    );

    if (fontsToLoad.length === 0) return;

    // Create one link element per font
    fontsToLoad.forEach((font) => {
      // Mark as having a link created (before async operations)
      createdLinksRef.current.add(font.id);

      // Create and append link element
      const link = document.createElement("link");
      link.href = buildFontUrl(font);
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // Use FontFaceObserver to detect when the font is rendered
      const weight = font.weights[0] || 400;
      const observer = new FontFaceObserver(font.name, { weight });

      observer
        .load(null, 10000)
        .then(() => {
          setLoadedFonts((prev) => new Set(prev).add(font.id));
        })
        .catch(() => {
          setFailedFonts((prev) => new Set(prev).add(font.id));
        });
    });
  }, [fonts, loadedFonts, failedFonts]);

  return { loadedFonts, failedFonts };
}
