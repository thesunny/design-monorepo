"use client";

import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { NormalizedText } from "./components/NormalizedText";

type FontWeightRowProps = {
  fontName: string;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  previewText: string;
  fontSize: number;
  isMonospace?: boolean;
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
  fontSize,
  isMonospace,
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
      {/* Font preview with normalization and fade-out overflow */}
      <div
        className="flex-1 min-w-0 overflow-hidden whitespace-nowrap"
        style={{
          maskImage: "linear-gradient(to right, black calc(100% - 40px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black calc(100% - 40px), transparent 100%)",
        }}
      >
        <NormalizedText
          fontFamily={fontName}
          fontWeight={weight}
          fontStyle={fontStyle}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          normalizedFontSize={fontSize}
          normalizationText={previewText}
          isMonospace={isMonospace}
          className={italicUnavailable ? "opacity-30" : ""}
        >
          {renderText(previewText)}
        </NormalizedText>
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
              <IconStarFilled size={18} className="text-yellow-500" />
            ) : (
              <IconStar size={18} className="text-neutral-400" stroke={1.25} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
