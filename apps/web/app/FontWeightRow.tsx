"use client";

import { Textfit } from "react-textfit";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

type FontWeightRowProps = {
  fontName: string;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  previewText: string;
  previewWidth: number;
  fontSize: number;
  isLoaded: boolean;
  isFailed?: boolean;
  showItalics?: boolean;
  hasItalic?: boolean;
  // Star button props
  showStar?: boolean;
  isFavorited?: boolean;
  onStarClick?: () => void;
};

export function FontWeightRow({
  fontName,
  weight,
  lineHeight,
  letterSpacing,
  previewText,
  previewWidth,
  fontSize,
  isLoaded,
  isFailed,
  showItalics,
  hasItalic,
  showStar,
  isFavorited,
  onStarClick,
}: FontWeightRowProps) {
  const italicUnavailable = showItalics && !hasItalic;
  const fontStyle = showItalics && hasItalic ? "italic" : "normal";

  // Convert newlines to <br> elements
  const renderText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => (
      <span key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex items-center">
      {/*
        Font preview with normalization and fade-out overflow.

        FONT NORMALIZATION: Do not remove Textfit!
        Textfit normalizes the font size so all fonts appear at a consistent visual width
        based on the previewWidth (which is calculated from Arial at the selected size).
        This ensures fonts with different natural widths look comparable.

        The outer container clips overflow with a fade effect when the screen is narrow.
      */}
      <div
        className="flex-1 min-w-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, black calc(100% - 40px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black calc(100% - 40px), transparent 100%)",
        }}
      >
        <div style={{ width: previewWidth }}>
          {isLoaded ? (
            <Textfit
              key={`${fontName}-${weight}-${showItalics}`}
              mode="single"
              max={200}
              className={italicUnavailable ? "opacity-30" : ""}
              style={{
                fontFamily: `"${fontName}", sans-serif`,
                fontWeight: weight,
                fontStyle,
                lineHeight,
                letterSpacing: `${letterSpacing}em`,
              }}
            >
              {renderText(previewText)}
            </Textfit>
          ) : (
            <div
              className="opacity-30 whitespace-nowrap"
              style={{
                fontFamily: `"${fontName}", sans-serif`,
                fontWeight: weight,
                fontStyle,
                lineHeight,
                letterSpacing: `${letterSpacing}em`,
                fontSize,
              }}
            >
              {renderText(previewText)}
            </div>
          )}
        </div>
      </div>

      {/* Weight and star grouped on the right */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className={`text-xs w-8 text-right ${isFailed ? "text-red-400" : "text-neutral-400"}`}>
          {weight}
        </span>
        {showStar && (
          <button
            onClick={onStarClick}
            className="p-1 rounded hover:bg-neutral-200 transition-colors"
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? (
              <IconStarFilled size={16} className="text-yellow-500" />
            ) : (
              <IconStar size={16} className="text-neutral-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
