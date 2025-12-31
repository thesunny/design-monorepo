"use client";

import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from "react";
import FontFaceObserver from "fontfaceobserver";

type NormalizedTextProps = {
  fontFamily: string;
  fontWeight?: number;
  fontStyle?: "normal" | "italic";
  letterSpacing?: number;
  lineHeight?: number;
  normalizedFontSize: number;
  normalizationText: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const BASE_MEASURE_SIZE = 48;

/**
 * Measures the width of text using a canvas context.
 */
function measureTextWidth(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  fontStyle: "normal" | "italic"
): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return fontSize; // fallback

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  return ctx.measureText(text).width;
}

/**
 * NormalizedText renders text at a visually consistent size across different fonts.
 *
 * It works by measuring the width of a normalization text string in both Arial (reference)
 * and the target font, then scaling the font size so all fonts render at a consistent
 * visual width for the same normalizedFontSize value.
 *
 * Example: If Arial renders "Hello" at 100px width and the target font renders it at 125px,
 * the scale factor is 0.8. A normalizedFontSize of 32px becomes 25.6px actual.
 */
export function NormalizedText({
  fontFamily,
  fontWeight = 400,
  fontStyle = "normal",
  letterSpacing = 0,
  lineHeight,
  normalizedFontSize,
  normalizationText,
  children,
  className,
  style,
}: NormalizedTextProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);

  // Track the current font configuration to detect changes
  const fontKeyRef = useRef<string>("");

  // Wait for font to load and calculate scale
  useEffect(() => {
    const fontKey = `${fontFamily}-${fontWeight}-${fontStyle}-${normalizationText}`;

    // If font config changed, reset state
    if (fontKeyRef.current !== fontKey) {
      fontKeyRef.current = fontKey;
      setIsLoaded(false);
      setScale(1);
    }

    const observer = new FontFaceObserver(fontFamily, {
      weight: fontWeight,
      style: fontStyle,
    });

    let cancelled = false;

    observer
      .load(null, 10000)
      .then(() => {
        if (cancelled) return;

        // Measure Arial as the reference
        const arialWidth = measureTextWidth(
          normalizationText,
          "Arial",
          BASE_MEASURE_SIZE,
          fontWeight,
          fontStyle
        );

        // Measure the target font
        const targetWidth = measureTextWidth(
          normalizationText,
          `"${fontFamily}"`,
          BASE_MEASURE_SIZE,
          fontWeight,
          fontStyle
        );

        // Calculate scale factor (Arial / target)
        const newScale = targetWidth > 0 ? arialWidth / targetWidth : 1;
        setScale(newScale);
        setIsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Font failed to load, render at normal size
        setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fontFamily, fontWeight, fontStyle, normalizationText]);

  const actualFontSize = normalizedFontSize * scale;

  return (
    <span
      className={className}
      style={{
        fontFamily: `"${fontFamily}", sans-serif`,
        fontWeight,
        fontStyle,
        fontSize: actualFontSize,
        letterSpacing: letterSpacing !== 0 ? `${letterSpacing}em` : undefined,
        lineHeight,
        opacity: isLoaded ? 1 : 0.3,
        transition: "opacity 0.15s ease-in-out",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
