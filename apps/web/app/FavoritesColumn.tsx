"use client";

import { useMemo } from "react";
import { useMutation } from "convex/react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { api } from "@repo/convex/convex/_generated/api";
import type { Font } from "../data/types";
import { FontWeightRow } from "./FontWeightRow";
import { NormalizedText } from "./components/NormalizedText";

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

type FavoriteWeight = {
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  _id: string;
  type: "heading" | "paragraph" | "code";
};

// Group favorites by fontId, with separate headings and paragraphs
type GroupedFavorite = {
  fontId: string;
  fontName: string;
  headings: FavoriteWeight[];
  paragraphs: FavoriteWeight[];
};

type FavoritesColumnProps = {
  favorites: Favorite[] | undefined;
  failedFonts: Set<string>;
  previewText: string;
  fontSize: number;
  fontByIdMap: Map<string, Font>;
};

const PARAGRAPH_PREVIEW_TEXT = "Typography gives language a visual form, shaping how we experience text.";
const PARAGRAPH_NORMALIZATION_TEXT = "this is a simple sample text that represents average spacing and letter frequency";

export function FavoritesColumn({
  favorites,
  failedFonts,
  previewText,
  fontSize,
  fontByIdMap,
}: FavoritesColumnProps) {
  // Group favorites by fontId, separating headings and paragraphs
  const groupedFavorites = useMemo(() => {
    if (!favorites) return [];

    const groups = new Map<string, GroupedFavorite>();

    for (const fav of favorites) {
      const favType = fav.type || "heading";
      const weightData: FavoriteWeight = {
        weight: fav.weight,
        lineHeight: fav.lineHeight,
        letterSpacing: fav.letterSpacing,
        _id: fav._id,
        type: favType,
      };

      const existing = groups.get(fav.fontId);
      if (existing) {
        if (favType === "paragraph") {
          existing.paragraphs.push(weightData);
        } else {
          existing.headings.push(weightData);
        }
      } else {
        groups.set(fav.fontId, {
          fontId: fav.fontId,
          fontName: fav.fontName,
          headings: favType === "heading" || favType === "code" ? [weightData] : [],
          paragraphs: favType === "paragraph" ? [weightData] : [],
        });
      }
    }

    // Sort weights within each group
    for (const group of groups.values()) {
      group.headings.sort((a, b) => a.weight - b.weight);
      group.paragraphs.sort((a, b) => a.weight - b.weight);
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
            {groupedFavorites.map((group) => (
              <GroupedFavoriteItem
                key={group.fontId}
                group={group}
                isFailed={failedFonts.has(group.fontId)}
                previewText={previewText}
                fontSize={fontSize}
                fontByIdMap={fontByIdMap}
              />
            ))}
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
  fontByIdMap,
}: {
  group: GroupedFavorite;
  isFailed?: boolean;
  previewText: string;
  fontSize: number;
  fontByIdMap: Map<string, Font>;
}) {
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  // Look up font data from the map
  const fontData = fontByIdMap.get(group.fontId);

  const handleRemoveHeading = (weightData: FavoriteWeight) => {
    removeFavorite({
      fontId: group.fontId,
      weight: weightData.weight,
      lineHeight: weightData.lineHeight,
      letterSpacing: weightData.letterSpacing,
      type: "heading",
    });
  };

  const handleRemoveParagraph = (weightData: FavoriteWeight) => {
    removeFavorite({
      fontId: group.fontId,
      weight: weightData.weight,
      lineHeight: weightData.lineHeight,
      letterSpacing: weightData.letterSpacing,
      type: "paragraph",
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
            lineHeight={weightData.lineHeight}
            letterSpacing={weightData.letterSpacing}
            previewText={previewText}
            fontSize={fontSize}
            isFailed={isFailed}
            showStar={true}
            isFavorited={true}
            onStarClick={() => handleRemoveHeading(weightData)}
          />
        ))}
        {/* Paragraphs below headings */}
        {group.paragraphs.map((weightData) => (
          <ParagraphFavoriteRow
            key={weightData._id}
            fontName={group.fontName}
            weight={weightData.weight}
            isFailed={isFailed}
            onRemove={() => handleRemoveParagraph(weightData)}
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

function ParagraphFavoriteRow({
  fontName,
  weight,
  isFailed,
  onRemove,
}: {
  fontName: string;
  weight: number;
  isFailed?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* Paragraph preview with multiline text */}
      <div className="flex-1 min-w-0">
        <NormalizedText
          fontFamily={fontName}
          fontWeight={weight}
          fontStyle="normal"
          lineHeight={1.4}
          letterSpacing={0}
          normalizedFontSize={16}
          normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
        >
          {PARAGRAPH_PREVIEW_TEXT}
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
