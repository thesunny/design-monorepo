import { useEffect, useRef, useState } from "react";
import FontFaceObserver from "fontfaceobserver";
import type { Font } from "../../data/types";

/**
 * Builds a stable Google Fonts URL for a single font family.
 * The URL includes all weights and italic variants if available.
 */
function buildFontUrl(font: Font): string {
  const encodedName = font.name.replace(/ /g, "+");
  const hasItalic = font.styles.includes("italic");

  let familyParam: string;

  if (font.variable) {
    const min = Math.min(...font.weights);
    const max = Math.max(...font.weights);
    if (hasItalic) {
      // Variable font with italic: ital,wght@0,min..max;1,min..max
      familyParam = `${encodedName}:ital,wght@0,${min}..${max};1,${min}..${max}`;
    } else {
      familyParam = `${encodedName}:wght@${min}..${max}`;
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
