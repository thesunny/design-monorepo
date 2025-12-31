"use client";

import { useState, useEffect, useMemo } from "react";
import { Slider } from "@mantine/core";
import { IconHeading, IconAlignLeft, IconCode, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/convex/convex/_generated/api";
import type {
  EnrichedCategory,
  EnrichedSubcategory,
  Font,
} from "../data/types";
import { CategorySidebar } from "./CategorySidebar";
import { FavoritesColumn } from "./FavoritesColumn";
import { useFontLoader } from "./hooks/useFontLoader";
import { FontWeightRow } from "./FontWeightRow";

type PageClientProps = {
  fontCategories: EnrichedCategory[];
};

export default function PageClient({ fontCategories }: PageClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<EnrichedSubcategory | null>(fontCategories[0]?.subcategories[0] ?? null);
  const [hoveredSubcategory, setHoveredSubcategory] =
    useState<EnrichedSubcategory | null>(null);
  const [selectedWeight, setSelectedWeight] = useState(400);
  const [showAllWeights, setShowAllWeights] = useState(false);
  const [showItalics, setShowItalics] = useState(false);
  const [previewText, setPreviewText] = useState("The Quick Brown Fox Jumps");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [previewMode, setPreviewMode] = useState<"headings" | "paragraphs" | "code">(
    "headings"
  );
  const [filterBold, setFilterBold] = useState(false);
  const [filterItalic, setFilterItalic] = useState(false);
  const [filterVariable, setFilterVariable] = useState(false);
  const [headingsFontSize, setHeadingsFontSize] = useState(36);
  const [textFontSize, setTextFontSize] = useState(16);
  const [previewWidth, setPreviewWidth] = useState(640);

  // Fixed font size for favorites column (not affected by slider)
  const FAVORITES_FONT_SIZE = 24;
  const [favoritesPreviewWidth, setFavoritesPreviewWidth] = useState(400);

  // Use headings font size for headings tab, text font size for paragraphs/code
  const fontSize = previewMode === "headings" ? headingsFontSize : textFontSize;
  const setFontSize = previewMode === "headings" ? setHeadingsFontSize : setTextFontSize;

  // Fetch favorites for Column 3
  const favorites = useQuery(api.favorites.getFavorites);

  // The subcategory to display: hovered takes priority, then selected
  const displayedSubcategory = hoveredSubcategory || selectedSubcategory;

  // Create a map of all fonts for quick lookup (used for favorites)
  const fontMap = useMemo(() => {
    const map = new Map<string, Font>();
    for (const category of fontCategories) {
      for (const subcategory of category.subcategories) {
        for (const font of subcategory.fonts) {
          map.set(font.id, font);
        }
      }
    }
    return map;
  }, [fontCategories]);

  // Compute all fonts that need to be loaded (category + favorites)
  const fontsToLoad = useMemo(() => {
    const fonts: Font[] = [];
    const seenIds = new Set<string>();

    // Add fonts from displayed subcategory
    if (displayedSubcategory) {
      for (const font of displayedSubcategory.fonts) {
        if (!seenIds.has(font.id)) {
          seenIds.add(font.id);
          fonts.push(font);
        }
      }
    }

    // Add fonts from favorites (look up full Font object)
    if (favorites) {
      for (const fav of favorites) {
        if (!seenIds.has(fav.fontId)) {
          const font = fontMap.get(fav.fontId);
          if (font) {
            seenIds.add(fav.fontId);
            fonts.push(font);
          }
        }
      }
    }

    return fonts;
  }, [displayedSubcategory, favorites, fontMap]);

  // Load fonts using the optimized hook (one link per font)
  const { loadedFonts, failedFonts } = useFontLoader(fontsToLoad);

  // Filter fonts based on active filters
  const filteredFonts = displayedSubcategory?.fonts.filter((font) => {
    if (filterBold) {
      const hasNormal = font.weights.some((w) => w >= 400 && w <= 500);
      const hasBold = font.weights.some((w) => w >= 600);
      if (!hasNormal || !hasBold) return false;
    }
    if (filterItalic && !font.styles.includes("italic")) return false;
    if (filterVariable && !font.variable) return false;
    return true;
  }) ?? [];

  // Measure preview text width using Arial 400 at the selected font size to normalize all font previews
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = `400 ${fontSize}px Arial`;
      const metrics = ctx.measureText(previewText);
      setPreviewWidth(metrics.width);
    }
  }, [previewText, fontSize]);

  // Measure preview width for favorites column using fixed 24px Arial
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = `400 ${FAVORITES_FONT_SIZE}px Arial`;
      const metrics = ctx.measureText(previewText);
      setFavoritesPreviewWidth(metrics.width);
    }
  }, [previewText, FAVORITES_FONT_SIZE]);

  return (
    <main className="flex h-screen bg-white">
      <CategorySidebar
        fontCategories={fontCategories}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        onHoverSubcategory={setHoveredSubcategory}
      />

      {/* Column 2: Font List */}
      <div className="flex-1 min-w-0 border-r border-neutral-200 flex flex-col">
        {displayedSubcategory ? (
          <>
            {/* Tabs and Filters */}
            <div className="flex border-b border-neutral-200 pl-4 pr-4 h-12">
              <button
                onClick={() => setPreviewMode("headings")}
                style={{ fontSize: 13 }}
                className={`px-3 h-full flex items-center font-medium transition-colors cursor-pointer mb-[-1px] border-b-2 ${
                  previewMode === "headings"
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700 border-transparent"
                }`}
              >
                <IconHeading size={16} className="mr-1.5" />
                Headings
              </button>
              <button
                onClick={() => setPreviewMode("paragraphs")}
                style={{ fontSize: 13 }}
                className={`px-3 h-full flex items-center font-medium transition-colors cursor-pointer mb-[-1px] border-b-2 ${
                  previewMode === "paragraphs"
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700 border-transparent"
                }`}
              >
                <IconAlignLeft size={16} className="mr-1.5" />
                Paragraphs
              </button>
              <button
                onClick={() => setPreviewMode("code")}
                style={{ fontSize: 13 }}
                className={`px-3 h-full flex items-center font-medium transition-colors cursor-pointer mb-[-1px] border-b-2 ${
                  previewMode === "code"
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700 border-transparent"
                }`}
              >
                <IconCode size={16} className="mr-1.5" />
                Code
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setFilterBold(!filterBold)}
                  style={{ fontSize: 12 }}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    filterBold
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Bold
                </button>
                <button
                  onClick={() => setFilterItalic(!filterItalic)}
                  style={{ fontSize: 12 }}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    filterItalic
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Italic
                </button>
                <button
                  onClick={() => setFilterVariable(!filterVariable)}
                  style={{ fontSize: 12 }}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    filterVariable
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  Variable
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {previewMode === "headings" && (
                <div className="divide-y divide-neutral-200">
                  {filteredFonts.map((font) => (
                    <FontPreview
                      key={font.id}
                      font={font}
                      isLoaded={loadedFonts.has(font.id)}
                      isFailed={failedFonts.has(font.id)}
                      selectedWeight={selectedWeight}
                      showAllWeights={showAllWeights}
                      showItalics={showItalics}
                      previewText={previewText}
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      previewWidth={previewWidth}
                      fontSize={fontSize}
                    />
                  ))}
                </div>
              )}
              {previewMode === "paragraphs" && (
                <div
                  className="grid gap-4 p-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                  }}
                >
                  {filteredFonts.map((font) => (
                    <ParagraphPreview
                      key={font.id}
                      font={font}
                      isLoaded={loadedFonts.has(font.id)}
                      selectedWeight={selectedWeight}
                      showItalics={showItalics}
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      fontSize={fontSize}
                    />
                  ))}
                </div>
              )}
              {previewMode === "code" && (
                <div
                  className="grid gap-4 p-4"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                  }}
                >
                  {filteredFonts.map((font) => (
                    <CodePreview
                      key={font.id}
                      font={font}
                      isLoaded={loadedFonts.has(font.id)}
                      selectedWeight={selectedWeight}
                      showItalics={showItalics}
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      fontSize={fontSize}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white border-t border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-6 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    role="switch"
                    aria-checked={showItalics}
                    onClick={() => setShowItalics(!showItalics)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showItalics ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showItalics ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-neutral-500">Italics</span>
                </label>
              </div>
              {/* Sliders grid: label | slider | optional toggle */}
              <div
                className="grid gap-x-3 gap-y-6 mb-8 items-center"
                style={{ gridTemplateColumns: "5rem 1fr auto" }}
              >
                {/* Weight row */}
                <span className="text-xs text-neutral-500">Weight</span>
                <Slider
                  value={selectedWeight}
                  onChange={setSelectedWeight}
                  min={100}
                  max={900}
                  step={100}
                  marks={[
                    { value: 100, label: "100" },
                    { value: 200, label: "200" },
                    { value: 300, label: "300" },
                    { value: 400, label: "400" },
                    { value: 500, label: "500" },
                    { value: 600, label: "600" },
                    { value: 700, label: "700" },
                    { value: 800, label: "800" },
                    { value: 900, label: "900" },
                  ]}
                  size="sm"
                  color="dark"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
                <label className="flex items-center gap-2 cursor-pointer ml-3">
                  <button
                    role="switch"
                    aria-checked={showAllWeights}
                    onClick={() => setShowAllWeights(!showAllWeights)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showAllWeights ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showAllWeights ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <span className="text-xs text-neutral-500 whitespace-nowrap">All Weights</span>
                </label>

                {/* Size row */}
                <span className="text-xs text-neutral-500">Size</span>
                <Slider
                  value={fontSize}
                  onChange={setFontSize}
                  min={12}
                  max={72}
                  step={1}
                  marks={[
                    { value: 12, label: "12" },
                    { value: 24, label: "24" },
                    { value: 36, label: "36" },
                    { value: 48, label: "48" },
                    { value: 60, label: "60" },
                    { value: 72, label: "72" },
                  ]}
                  size="sm"
                  color="dark"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
                <div /> {/* Empty cell for grid alignment */}

                {/* Tracking row */}
                <span className="text-xs text-neutral-500">Tracking</span>
                <Slider
                  value={letterSpacing}
                  onChange={setLetterSpacing}
                  min={-0.1}
                  max={0.3}
                  step={0.01}
                  marks={[
                    { value: -0.1, label: "-0.1" },
                    { value: 0, label: "0" },
                    { value: 0.1, label: "0.1" },
                    { value: 0.2, label: "0.2" },
                    { value: 0.3, label: "0.3" },
                  ]}
                  size="sm"
                  color="dark"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
                <div /> {/* Empty cell for grid alignment */}

                {/* Line Height row */}
                <span className="text-xs text-neutral-500">Line Height</span>
                <Slider
                  value={lineHeight}
                  onChange={setLineHeight}
                  min={0.8}
                  max={2.5}
                  step={0.1}
                  marks={[
                    { value: 0.8, label: "0.8" },
                    { value: 1.0, label: "1.0" },
                    { value: 1.2, label: "1.2" },
                    { value: 1.5, label: "1.5" },
                    { value: 2.0, label: "2.0" },
                    { value: 2.5, label: "2.5" },
                  ]}
                  size="sm"
                  color="dark"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
                <div /> {/* Empty cell for grid alignment */}
              </div>
              <textarea
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Enter preview text..."
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
                rows={2}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
            Select a category to view fonts
          </div>
        )}
      </div>

      <FavoritesColumn
        favorites={favorites}
        loadedFonts={loadedFonts}
        failedFonts={failedFonts}
        previewText={previewText}
        previewWidth={favoritesPreviewWidth}
        fontSize={FAVORITES_FONT_SIZE}
        fontCategories={fontCategories}
      />
    </main>
  );
}

function getAllAvailableWeights(weights: number[]): number[] {
  // Return all weights from 100-900 in increments of 100 that are available
  const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return standardWeights.filter((w) => weights.includes(w));
}

export function formatWeights(weights: number[], isVariable: boolean): string {
  if (isVariable && weights.length > 1) {
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    return `${min} - ${max}`;
  }
  return weights.join(" ");
}

function getClosestWeight(
  weights: number[],
  target: number
): { weight: number; isExact: boolean } {
  if (weights.includes(target)) {
    return { weight: target, isExact: true };
  }

  const closest = weights.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );

  return { weight: closest, isExact: false };
}

function FontPreview({
  font,
  isLoaded,
  isFailed,
  selectedWeight,
  showAllWeights,
  showItalics,
  previewText,
  lineHeight,
  letterSpacing,
  previewWidth,
  fontSize,
}: {
  font: Font;
  isLoaded: boolean;
  isFailed?: boolean;
  selectedWeight: number;
  showAllWeights: boolean;
  showItalics: boolean;
  previewText: string;
  lineHeight: number;
  letterSpacing: number;
  previewWidth: number;
  fontSize: number;
}) {
  const { isSignedIn } = useAuth();
  const favorites = useQuery(api.favorites.getFavorites);
  const addFavorite = useMutation(api.favorites.addFavorite);
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  const displayWeights = showAllWeights
    ? getAllAvailableWeights(font.weights)
    : [];

  // For single weight view: get the closest weight to selected
  const singleWeight = !showAllWeights
    ? getClosestWeight(font.weights, selectedWeight).weight
    : null;

  // Check if a specific weight is favorited
  const isWeightFavorited = (weight: number) =>
    favorites?.some(
      (fav) =>
        fav.fontId === font.id &&
        fav.weight === weight &&
        fav.lineHeight === lineHeight &&
        fav.letterSpacing === letterSpacing &&
        (fav.type === "heading" || fav.type === undefined)
    ) ?? false;

  // For specific weight selection (when not showing all weights)
  const specificWeight = !showAllWeights
    ? getClosestWeight(font.weights, selectedWeight)
    : null;

  const isInexactMatch = specificWeight && !specificWeight.isExact;

  // Check if italic is available
  const hasItalic = font.styles.includes("italic");

  // Weights to display: either all available weights or just the selected one
  const weightsToDisplay = showAllWeights
    ? displayWeights
    : [specificWeight?.weight ?? 400];

  return (
    <div
      className={`px-8 py-4 ${
        isInexactMatch ? "bg-neutral-100" : ""
      }`}
    >
      <div className="space-y-2">
        {weightsToDisplay.map((weight) => (
          <FontWeightRow
            key={weight}
            fontName={font.name}
            weight={weight}
            lineHeight={lineHeight}
            letterSpacing={letterSpacing}
            previewText={previewText}
            previewWidth={previewWidth}
            fontSize={fontSize}
            isLoaded={isLoaded}
            isFailed={isFailed}
            showItalics={showItalics}
            hasItalic={hasItalic}
            showStar={isSignedIn}
            isFavorited={isWeightFavorited(weight)}
            onStarClick={() => {
              if (isWeightFavorited(weight)) {
                removeFavorite({
                  fontId: font.id,
                  weight,
                  lineHeight,
                  letterSpacing,
                  type: "heading",
                });
              } else {
                addFavorite({
                  fontId: font.id,
                  fontName: font.name,
                  weight,
                  lineHeight,
                  letterSpacing,
                  type: "heading",
                });
              }
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isFailed ? "text-red-400" : "text-neutral-400"}`}>{font.name}</span>
          {isFailed && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
              Not Found
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasItalic && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
            {formatWeights(font.weights, font.variable)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ParagraphPreview({
  font,
  isLoaded,
  selectedWeight,
  showItalics,
  lineHeight,
  letterSpacing,
  fontSize,
}: {
  font: Font;
  isLoaded: boolean;
  selectedWeight: number;
  showItalics: boolean;
  lineHeight: number;
  letterSpacing: number;
  fontSize: number;
}) {
  const { weight } = getClosestWeight(font.weights, selectedWeight);
  const hasItalic = font.styles.includes("italic");
  const italicUnavailable = showItalics && !hasItalic;

  return (
    <div className="border rounded-lg p-4 border-neutral-200">
      <p
        className={`leading-relaxed transition-opacity ${
          !isLoaded || italicUnavailable ? "opacity-30" : "opacity-100"
        }`}
        style={{
          fontFamily: `"${font.name}", sans-serif`,
          fontWeight: weight,
          fontStyle: showItalics && hasItalic ? "italic" : "normal",
          fontSize,
          lineHeight,
          letterSpacing: `${letterSpacing}em`,
        }}
      >
        Typography is the art and technique of arranging type to make written
        language legible, readable, and appealing when displayed. The
        arrangement of type involves selecting typefaces, point sizes, line
        lengths, and letter-spacing.
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <span className="text-sm text-neutral-500">{font.name}</span>
        <div className="flex items-center gap-2">
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
            {formatWeights(font.weights, font.variable)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CodePreview({
  font,
  isLoaded,
  selectedWeight,
  showItalics,
  lineHeight,
  letterSpacing,
  fontSize,
}: {
  font: Font;
  isLoaded: boolean;
  selectedWeight: number;
  showItalics: boolean;
  lineHeight: number;
  letterSpacing: number;
  fontSize: number;
}) {
  const { weight } = getClosestWeight(font.weights, selectedWeight);
  const hasItalic = font.styles.includes("italic");
  const italicUnavailable = showItalics && !hasItalic;

  return (
    <div className="border rounded-lg p-4 border-neutral-200">
      <pre
        className={`leading-relaxed transition-opacity overflow-x-auto ${
          !isLoaded || italicUnavailable ? "opacity-30" : "opacity-100"
        }`}
        style={{
          fontFamily: `"${font.name}", monospace`,
          fontWeight: weight,
          fontStyle: showItalics && hasItalic ? "italic" : "normal",
          fontSize,
          lineHeight,
          letterSpacing: `${letterSpacing}em`,
        }}
      >
        <code
          style={{
            fontFamily: "inherit",
            fontWeight: "inherit",
          }}
        >{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result); // 55`}</code>
      </pre>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <span className="text-sm text-neutral-500">{font.name}</span>
        <div className="flex items-center gap-2">
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
            {formatWeights(font.weights, font.variable)}
          </span>
        </div>
      </div>
    </div>
  );
}

