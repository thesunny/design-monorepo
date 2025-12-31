"use client";

import { useMemo } from "react";
import { Textfit } from "react-textfit";
import { IconStarFilled } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { api } from "@repo/convex/convex/_generated/api";
import type { EnrichedCategory } from "../data/types";

type Favorite = {
  _id: string;
  fontId: string;
  fontName: string;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  type?: "heading" | "paragraph" | "code";
  createdAt: number;
};

// Group favorites by fontId
type GroupedFavorite = {
  fontId: string;
  fontName: string;
  weights: { weight: number; lineHeight: number; letterSpacing: number; _id: string }[];
};

type FavoritesColumnProps = {
  favorites: Favorite[] | undefined;
  loadedFonts: Set<string>;
  failedFonts: Set<string>;
  previewText: string;
  previewWidth: number;
  fontSize: number;
  fontCategories: EnrichedCategory[];
};

export function FavoritesColumn({
  favorites,
  loadedFonts,
  failedFonts,
  previewText,
  previewWidth,
  fontSize,
  fontCategories,
}: FavoritesColumnProps) {
  // Group favorites by fontId
  const groupedFavorites = useMemo(() => {
    if (!favorites) return [];

    const groups = new Map<string, GroupedFavorite>();

    for (const fav of favorites) {
      const existing = groups.get(fav.fontId);
      if (existing) {
        existing.weights.push({
          weight: fav.weight,
          lineHeight: fav.lineHeight,
          letterSpacing: fav.letterSpacing,
          _id: fav._id,
        });
      } else {
        groups.set(fav.fontId, {
          fontId: fav.fontId,
          fontName: fav.fontName,
          weights: [{
            weight: fav.weight,
            lineHeight: fav.lineHeight,
            letterSpacing: fav.letterSpacing,
            _id: fav._id,
          }],
        });
      }
    }

    // Sort weights within each group
    for (const group of groups.values()) {
      group.weights.sort((a, b) => a.weight - b.weight);
    }

    return Array.from(groups.values());
  }, [favorites]);

  return (
    <div className="w-[480px] flex-shrink-0 overflow-y-auto p-8">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Favorites</h2>
      {groupedFavorites.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No favorites yet. Click the star on a font to add it.
        </p>
      ) : (
        <div className="space-y-4">
          {groupedFavorites.map((group) => (
            <GroupedFavoriteItem
              key={group.fontId}
              group={group}
              isLoaded={loadedFonts.has(group.fontId)}
              isFailed={failedFonts.has(group.fontId)}
              previewText={previewText}
              previewWidth={previewWidth}
              fontSize={fontSize}
              fontCategories={fontCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupedFavoriteItem({
  group,
  isLoaded,
  isFailed,
  previewText,
  previewWidth,
  fontSize,
  fontCategories,
}: {
  group: GroupedFavorite;
  isLoaded: boolean;
  isFailed?: boolean;
  previewText: string;
  previewWidth: number;
  fontSize: number;
  fontCategories: EnrichedCategory[];
}) {
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  // Look up font data from fontCategories
  const fontData = fontCategories
    .flatMap((cat) => cat.subcategories)
    .flatMap((sub) => sub.fonts)
    .find((f) => f.id === group.fontId);

  const handleRemoveWeight = async (weightData: { weight: number; lineHeight: number; letterSpacing: number }) => {
    await removeFavorite({
      fontId: group.fontId,
      weight: weightData.weight,
      lineHeight: weightData.lineHeight,
      letterSpacing: weightData.letterSpacing,
      type: "heading",
    });
  };

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
    <div className="border border-neutral-200 rounded-lg px-8 py-4 overflow-hidden">
      <div className="space-y-2">
        {group.weights.map((weightData) => (
          <div key={weightData._id} className="flex items-center gap-3">
            <div className="overflow-hidden" style={{ width: previewWidth }}>
              {isLoaded ? (
                <Textfit
                  key={`${group.fontName}-${weightData.weight}`}
                  mode="single"
                  max={200}
                  style={{
                    fontFamily: `"${group.fontName}", sans-serif`,
                    fontWeight: weightData.weight,
                    lineHeight: weightData.lineHeight,
                    letterSpacing: `${weightData.letterSpacing}em`,
                  }}
                >
                  {renderText(previewText)}
                </Textfit>
              ) : (
                <div
                  className="opacity-30 truncate"
                  style={{
                    fontFamily: `"${group.fontName}", sans-serif`,
                    fontWeight: weightData.weight,
                    lineHeight: weightData.lineHeight,
                    letterSpacing: `${weightData.letterSpacing}em`,
                    fontSize,
                  }}
                >
                  {renderText(previewText)}
                </div>
              )}
            </div>
            <span className={`text-xs w-8 text-right flex-shrink-0 ${isFailed ? "text-red-400" : "text-neutral-400"}`}>
              {weightData.weight}
            </span>
            <button
              onClick={() => handleRemoveWeight(weightData)}
              className="p-1 rounded hover:bg-neutral-100 transition-colors flex-shrink-0"
              title="Remove from favorites"
            >
              <IconStarFilled size={16} className="text-yellow-500" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isFailed ? "text-red-400" : "text-neutral-400"}`}>
            {group.fontName}
          </span>
          {isFailed && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
              Not Found
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fontData?.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          {fontData && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              {fontData.variable && fontData.weights.length > 1
                ? `${Math.min(...fontData.weights)} - ${Math.max(...fontData.weights)}`
                : fontData.weights.join(" ")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
