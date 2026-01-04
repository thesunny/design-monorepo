"use client";

import { useMemo } from "react";
import { useMutation } from "convex/react";
import { IconStarFilled } from "@tabler/icons-react";
import { api } from "@repo/convex/convex/_generated/api";
import type { Font } from "../data/types";
import { FontWeightRow } from "./FontWeightRow";
import { NormalizedText } from "./components/NormalizedText";
import { isMonospaceFont } from "./utils";

type Favorite = {
  _id: string;
  fontName: string;
  weight: number;
  type?: "heading" | "text";
};

type FavoriteWeight = {
  weight: number;
  _id: string;
  type: "heading" | "text";
};

// Group favorites by fontName, with separate headings and texts
type GroupedFavorite = {
  fontName: string;
  headings: FavoriteWeight[];
  texts: FavoriteWeight[];
};

type FavoritesColumnProps = {
  favorites: Favorite[] | undefined;
  failedFonts: Set<string>;
  previewText: string;
  fontSize: number;
  fontByNameMap: Map<string, Font>;
};

const TEXT_PREVIEW_TEXT = "Typography gives language a visual form, shaping how we experience text.";
const TEXT_NORMALIZATION_TEXT = "this is a simple sample text that represents average spacing and letter frequency";

export function FavoritesColumn({
  favorites,
  failedFonts,
  previewText,
  fontSize,
  fontByNameMap,
}: FavoritesColumnProps) {
  // Group favorites by fontName, separating headings and texts
  const groupedFavorites = useMemo(() => {
    if (!favorites) return [];

    const groups = new Map<string, GroupedFavorite>();

    for (const fav of favorites) {
      const favType = fav.type || "heading";
      const weightData: FavoriteWeight = {
        weight: fav.weight,
        _id: fav._id,
        type: favType,
      };

      const existing = groups.get(fav.fontName);
      if (existing) {
        if (favType === "text") {
          existing.texts.push(weightData);
        } else {
          existing.headings.push(weightData);
        }
      } else {
        groups.set(fav.fontName, {
          fontName: fav.fontName,
          headings: favType === "heading" ? [weightData] : [],
          texts: favType === "text" ? [weightData] : [],
        });
      }
    }

    // Sort weights within each group
    for (const group of groups.values()) {
      group.headings.sort((a, b) => a.weight - b.weight);
      group.texts.sort((a, b) => a.weight - b.weight);
    }

    return Array.from(groups.values());
  }, [favorites]);

  return (
    <div className="w-[480px] flex-shrink-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center border-b border-neutral-200 px-8 h-12">
        <span className="text-sm font-medium text-neutral-900">Favorites</span>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {groupedFavorites.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            No favorites yet. Click the star on a font to add it.
          </p>
        ) : (
          <div className="space-y-2">
            {groupedFavorites.map((group) => {
              const fontData = fontByNameMap.get(group.fontName);
              return (
                <GroupedFavoriteItem
                  key={group.fontName}
                  group={group}
                  isFailed={fontData ? failedFonts.has(fontData.id) : false}
                  previewText={previewText}
                  fontSize={fontSize}
                  fontByNameMap={fontByNameMap}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function GroupedFavoriteItem({
  group,
  isFailed,
  previewText,
  fontSize,
  fontByNameMap,
}: {
  group: GroupedFavorite;
  isFailed?: boolean;
  previewText: string;
  fontSize: number;
  fontByNameMap: Map<string, Font>;
}) {
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  // Look up font data from the map
  const fontData = fontByNameMap.get(group.fontName);

  const handleRemoveHeading = (weightData: FavoriteWeight) => {
    removeFavorite({
      fontName: group.fontName,
      weight: weightData.weight,
      type: "heading",
    });
  };

  const handleRemoveText = (weightData: FavoriteWeight) => {
    removeFavorite({
      fontName: group.fontName,
      weight: weightData.weight,
      type: "text",
    });
  };

  return (
    <div className="border border-neutral-200 rounded-lg px-4 py-4 overflow-hidden">
      <div className="space-y-2">
        {/* Headings first */}
        {group.headings.map((weightData) => (
          <FontWeightRow
            key={weightData._id}
            fontName={group.fontName}
            weight={weightData.weight}
            previewText={previewText}
            fontSize={fontSize}
            isMonospace={isMonospaceFont(fontData)}
            isFailed={isFailed}
            showStar={true}
            isFavorited={true}
            onStarClick={() => handleRemoveHeading(weightData)}
          />
        ))}
        {/* Texts below headings */}
        {group.texts.map((weightData) => (
          <TextFavoriteRow
            key={weightData._id}
            fontName={group.fontName}
            weight={weightData.weight}
            isMonospace={isMonospaceFont(fontData)}
            isFailed={isFailed}
            onRemove={() => handleRemoveText(weightData)}
          />
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

function TextFavoriteRow({
  fontName,
  weight,
  isMonospace,
  isFailed,
  onRemove,
}: {
  fontName: string;
  weight: number;
  isMonospace?: boolean;
  isFailed?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Text preview with multiline text */}
      <div className="flex-1 min-w-0">
        <NormalizedText
          fontFamily={fontName}
          fontWeight={weight}
          fontStyle="normal"
          lineHeight={1.4}
          letterSpacing={0}
          normalizedFontSize={16}
          normalizationText={TEXT_NORMALIZATION_TEXT}
          isMonospace={isMonospace}
        >
          {TEXT_PREVIEW_TEXT}
        </NormalizedText>
      </div>

      {/* Weight and star grouped on the right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-xs w-8 text-right ${isFailed ? "text-red-400" : "text-neutral-400"}`}>
          {weight}
        </span>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-neutral-200 transition-colors"
          title="Remove from favorites"
        >
          <IconStarFilled size={16} className="text-yellow-500" />
        </button>
      </div>
    </div>
  );
}
