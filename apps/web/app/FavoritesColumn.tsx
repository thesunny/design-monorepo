"use client";

import { IconStarFilled } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { api } from "@repo/convex/convex/_generated/api";
import type { EnrichedCategory } from "../data/types";
import { HeadingPreviewContent } from "./PageClient";

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
  return (
    <div className="w-[480px] flex-shrink-0 overflow-y-auto p-8">
      <h2 className="text-lg font-semibold text-neutral-800 mb-4">Favorites</h2>
      {!favorites || favorites.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No favorites yet. Click the star on a font to add it.
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((fav) => (
            <FavoriteItem
              key={fav._id}
              favorite={fav}
              isLoaded={loadedFonts.has(fav.fontId)}
              isFailed={failedFonts.has(fav.fontId)}
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

function FavoriteItem({
  favorite,
  isLoaded,
  isFailed,
  previewText,
  previewWidth,
  fontSize,
  fontCategories,
}: {
  favorite: Favorite;
  isLoaded: boolean;
  isFailed?: boolean;
  previewText: string;
  previewWidth: number;
  fontSize: number;
  fontCategories: EnrichedCategory[];
}) {
  const removeFavorite = useMutation(api.favorites.removeFavorite);
  const type = favorite.type ?? "heading";

  // Look up font data from fontCategories
  const fontData = fontCategories
    .flatMap((cat) => cat.subcategories)
    .flatMap((sub) => sub.fonts)
    .find((f) => f.id === favorite.fontId);

  const handleRemove = async () => {
    await removeFavorite({
      fontId: favorite.fontId,
      weight: favorite.weight,
      lineHeight: favorite.lineHeight,
      letterSpacing: favorite.letterSpacing,
      type,
    });
  };

  // Render based on type
  if (type === "heading") {
    return (
      <div className="border border-neutral-200 rounded-lg px-8 py-4 relative overflow-hidden">
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 p-1 rounded hover:bg-neutral-100 transition-colors"
          title="Remove from favorites"
        >
          <IconStarFilled size={18} className="text-yellow-500" />
        </button>
        <HeadingPreviewContent
          fontName={favorite.fontName}
          weight={favorite.weight}
          lineHeight={favorite.lineHeight}
          letterSpacing={favorite.letterSpacing}
          previewText={previewText}
          previewWidth={previewWidth}
          fontSize={fontSize}
          isLoaded={isLoaded}
          isFailed={isFailed}
          weights={fontData?.weights}
          variable={fontData?.variable}
          hasItalic={fontData?.styles.includes("italic")}
        />
      </div>
    );
  }

  // Placeholder for paragraph and code types (to be implemented later)
  return (
    <div className="border border-neutral-200 rounded-lg px-8 py-4 relative overflow-hidden">
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 p-1 rounded hover:bg-neutral-100 transition-colors"
        title="Remove from favorites"
      >
        <IconStarFilled size={18} className="text-yellow-500" />
      </button>
      <p
        className={`transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
        style={{
          fontFamily: `"${favorite.fontName}", sans-serif`,
          fontWeight: favorite.weight,
          lineHeight: favorite.lineHeight,
          letterSpacing: `${favorite.letterSpacing}em`,
        }}
      >
        {favorite.fontName} ({type})
      </p>
    </div>
  );
}
