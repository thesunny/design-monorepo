"use client";

import { useState, useEffect } from "react";
import { Textfit } from "react-textfit";
import { Slider } from "@mantine/core";
import FontFaceObserver from "fontfaceobserver";
import { IconHeading, IconAlignLeft, IconCode, IconStar, IconStarFilled } from "@tabler/icons-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/convex/convex/_generated/api";
import type {
  EnrichedCategory,
  EnrichedSubcategory,
  Font,
} from "../data/types";

type PageClientProps = {
  fontCategories: EnrichedCategory[];
};

export default function PageClient({ fontCategories }: PageClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<EnrichedSubcategory | null>(fontCategories[0]?.subcategories[0] ?? null);
  const [hoveredSubcategory, setHoveredSubcategory] =
    useState<EnrichedSubcategory | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [failedFonts, setFailedFonts] = useState<Set<string>>(new Set());
  const [selectedWeight, setSelectedWeight] = useState(400);
  const [showAllWeights, setShowAllWeights] = useState(false);
  const [previewText, setPreviewText] = useState("The Quick Brown Fox Jumps");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [selectedFont, setSelectedFont] = useState<Font | null>(null);
  const [previewMode, setPreviewMode] = useState<"headings" | "paragraphs" | "code">(
    "headings"
  );
  const [filterBold, setFilterBold] = useState(false);
  const [filterItalic, setFilterItalic] = useState(false);
  const [filterVariable, setFilterVariable] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(640);
  const [fontSize, setFontSize] = useState(36);

  // Fetch favorites for Column 3
  const favorites = useQuery(api.favorites.getFavorites);

  // The subcategory to display: hovered takes priority, then selected
  const displayedSubcategory = hoveredSubcategory || selectedSubcategory;

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

  // Load fonts from Google Fonts when a subcategory is displayed
  useEffect(() => {
    if (!displayedSubcategory) return;

    const fontsToLoad = displayedSubcategory.fonts.filter(
      (font) => !loadedFonts.has(font.id) && !failedFonts.has(font.id)
    );

    if (fontsToLoad.length === 0) return;

    // Build Google Fonts URL
    const fontFamilies = fontsToLoad.map((font) => {
      const weights = font.weights.join(";");
      return `${font.name.replace(/ /g, "+")}:wght@${weights}`;
    });

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies.map((f) => `family=${f}`).join("&")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Use FontFaceObserver to detect when fonts are actually rendered
    // Handle each font individually so one failure doesn't block others
    fontsToLoad.forEach((font) => {
      const weight = font.weights[0] || 400;
      const observer = new FontFaceObserver(font.name, { weight });
      observer.load(null, 10000).then(() => {
        setLoadedFonts((prev) => new Set(prev).add(font.id));
      }).catch(() => {
        setFailedFonts((prev) => new Set(prev).add(font.id));
      });
    });
  }, [displayedSubcategory, loadedFonts, failedFonts]);

  // Load fonts for favorites
  useEffect(() => {
    if (!favorites || favorites.length === 0) return;

    const fontsToLoad = favorites.filter((fav) => !loadedFonts.has(fav.fontId) && !failedFonts.has(fav.fontId));
    if (fontsToLoad.length === 0) return;

    const fontFamilies = fontsToLoad.map((fav) => {
      return `${fav.fontName.replace(/ /g, "+")}:wght@${fav.weight}`;
    });

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?${fontFamilies.map((f) => `family=${f}`).join("&")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Use FontFaceObserver to detect when fonts are actually rendered
    // Handle each font individually so one failure doesn't block others
    fontsToLoad.forEach((fav) => {
      const observer = new FontFaceObserver(fav.fontName, { weight: fav.weight });
      observer.load(null, 10000).then(() => {
        setLoadedFonts((prev) => new Set(prev).add(fav.fontId));
      }).catch(() => {
        setFailedFonts((prev) => new Set(prev).add(fav.fontId));
      });
    });
  }, [favorites, loadedFonts, failedFonts]);

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

  return (
    <main className="flex h-screen bg-white">
      {/* Column 1: Category Browser - Slack-style dark sidebar */}
      <div className="w-40 flex-shrink-0 bg-[#3F0E40] flex flex-col">
        <div className="h-12 flex items-center px-4">
          <span
            className="font-[family-name:var(--font-poppins)]"
            style={{ fontSize: 18, color: "#9A8A9B" }}
          >
            Font Picker
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {fontCategories.map((category) => (
            <div key={category.id} className="mb-6">
              <h2
                className="font-semibold text-[#C4B3C5] uppercase tracking-wide mb-2 px-2"
                style={{ fontSize: 13 }}
              >
                {category.name}
              </h2>
              <ul>
                {category.subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <button
                      onClick={() => setSelectedSubcategory(subcategory)}
                      onMouseEnter={() => setHoveredSubcategory(subcategory)}
                      onMouseLeave={() => setHoveredSubcategory(null)}
                      className={`w-full text-left px-2 py-1 rounded transition-colors ${
                        selectedSubcategory?.id === subcategory.id
                          ? "bg-[#E8DFE8] text-[#3F0E40] font-semibold"
                          : "text-[#BCB3BD] hover:bg-[#522653]"
                      }`}
                      style={{ fontSize: 15 }}
                    >
                      {subcategory.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* User Section */}
        <div className="mt-auto px-4 py-3 border-t border-[#522653]">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full px-3 py-2 text-sm text-[#E8DFE8] bg-[#522653] hover:bg-[#6B3A6D] rounded transition-colors">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
              <span className="text-sm text-[#C4B3C5] truncate">Logged in</span>
            </div>
          </SignedIn>
        </div>
      </div>

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
                      previewText={previewText}
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      previewWidth={previewWidth}
                      fontSize={fontSize}
                      isSelected={selectedFont?.id === font.id}
                      onClick={() => setSelectedFont(font)}
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
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      isSelected={selectedFont?.id === font.id}
                      onClick={() => setSelectedFont(font)}
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
                      lineHeight={lineHeight}
                      letterSpacing={letterSpacing}
                      isSelected={selectedFont?.id === font.id}
                      onClick={() => setSelectedFont(font)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white border-t border-neutral-200 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-500">
                  Show All Weights
                </span>
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
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-neutral-500 w-20">Weight</span>
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
                  className="flex-1"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-neutral-500 w-20">Size</span>
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
                  className="flex-1"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-neutral-500 w-20">Tracking</span>
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
                  className="flex-1"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs text-neutral-500 w-20">
                  Line Height
                </span>
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
                  className="flex-1"
                  styles={{ markLabel: { fontSize: "12px" } }}
                />
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

      {/* Column 3: Favorites */}
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
    </main>
  );
}

// Shared component for heading-style font preview
function HeadingPreviewContent({
  fontName,
  weight,
  lineHeight,
  letterSpacing,
  previewText,
  previewWidth,
  fontSize,
  isLoaded,
  isFailed,
  weights,
  variable,
  hasItalic,
}: {
  fontName: string;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
  previewText: string;
  previewWidth: number;
  fontSize: number;
  isLoaded: boolean;
  isFailed?: boolean;
  weights?: number[];
  variable?: boolean;
  hasItalic?: boolean;
}) {
  const renderText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => (
      <span key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  const getOpacityClass = () => {
    if (isFailed) return "opacity-30 line-through";
    if (isLoaded) return "opacity-100";
    return "opacity-30";
  };

  return (
    <>
      <div className="overflow-hidden" style={{ width: previewWidth }}>
        {isLoaded ? (
          <Textfit
            key={`${fontName}-${weight}`}
            mode="single"
            max={200}
            style={{
              fontFamily: `"${fontName}", sans-serif`,
              fontWeight: weight,
              lineHeight,
              letterSpacing: `${letterSpacing}em`,
            }}
          >
            {renderText(previewText)}
          </Textfit>
        ) : (
          <div
            className="opacity-30 truncate"
            style={{
              fontFamily: `"${fontName}", sans-serif`,
              fontWeight: weight,
              lineHeight,
              letterSpacing: `${letterSpacing}em`,
              fontSize,
            }}
          >
            {renderText(previewText)}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isFailed ? "text-red-400" : "text-neutral-400"}`}>{fontName}</span>
          {isFailed && (
            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
              Not Found
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {variable && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Variable
            </span>
          )}
          {hasItalic && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          {weights && (
            <span className="text-xs text-neutral-400">
              {weights.join(" ")}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function getAllAvailableWeights(weights: number[]): number[] {
  // Return all weights from 100-900 in increments of 100 that are available
  const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return standardWeights.filter((w) => weights.includes(w));
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
  previewText,
  lineHeight,
  letterSpacing,
  previewWidth,
  fontSize,
  isSelected,
  onClick,
}: {
  font: Font;
  isLoaded: boolean;
  isFailed?: boolean;
  selectedWeight: number;
  showAllWeights: boolean;
  previewText: string;
  lineHeight: number;
  letterSpacing: number;
  previewWidth: number;
  fontSize: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { isSignedIn } = useAuth();
  const favorites = useQuery(api.favorites.getFavorites);
  const addFavorite = useMutation(api.favorites.addFavorite);
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  const displayWeights = showAllWeights
    ? getAllAvailableWeights(font.weights)
    : [];

  // Check if this font with current settings is favorited as heading
  const currentWeight = showAllWeights ? selectedWeight : (getClosestWeight(font.weights, selectedWeight).weight);
  const isFavorited = favorites?.some(
    (fav) =>
      fav.fontId === font.id &&
      fav.weight === currentWeight &&
      fav.lineHeight === lineHeight &&
      fav.letterSpacing === letterSpacing &&
      (fav.type === "heading" || fav.type === undefined)
  ) ?? false;

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited) {
      await removeFavorite({
        fontId: font.id,
        weight: currentWeight,
        lineHeight,
        letterSpacing,
        type: "heading",
      });
    } else {
      await addFavorite({
        fontId: font.id,
        fontName: font.name,
        weight: currentWeight,
        lineHeight,
        letterSpacing,
        type: "heading",
      });
    }
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

  // For specific weight selection (when not showing all weights)
  const specificWeight = !showAllWeights
    ? getClosestWeight(font.weights, selectedWeight)
    : null;

  const isInexactMatch = specificWeight && !specificWeight.isExact;

  return (
    <div
      onClick={onClick}
      className={`px-8 py-4 transition-colors cursor-pointer relative ${
        isSelected
          ? "bg-blue-50 border-l-2 border-l-blue-500"
          : isInexactMatch
            ? "bg-neutral-100"
            : "hover:bg-neutral-50"
      }`}
    >
      {isSignedIn && (
        <button
          onClick={handleStarClick}
          className="absolute top-3 right-3 p-1 rounded hover:bg-neutral-200 transition-colors"
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? (
            <IconStarFilled size={18} className="text-yellow-500" />
          ) : (
            <IconStar size={18} className="text-neutral-400" />
          )}
        </button>
      )}
      {showAllWeights && displayWeights.length > 0 ? (
        <div className="space-y-2">
          {displayWeights.map((weight) => (
            <div key={weight} className="flex items-center gap-3">
              <div className="overflow-hidden" style={{ width: previewWidth }}>
                {isLoaded ? (
                  <Textfit
                    key={`${font.name}-${weight}`}
                    mode="single"
                    max={200}
                    style={{
                      fontFamily: `"${font.name}", sans-serif`,
                      fontWeight: weight,
                      lineHeight,
                      letterSpacing: `${letterSpacing}em`,
                    }}
                  >
                    {renderText(previewText)}
                  </Textfit>
                ) : (
                  <div
                    className="opacity-30 truncate"
                    style={{
                      fontFamily: `"${font.name}", sans-serif`,
                      fontWeight: weight,
                      lineHeight,
                      letterSpacing: `${letterSpacing}em`,
                      fontSize,
                    }}
                  >
                    {renderText(previewText)}
                  </div>
                )}
              </div>
              <span className={`text-xs w-8 text-right ${isFailed ? "text-red-400" : "text-neutral-400"}`}>
                {weight}
              </span>
            </div>
          ))}
          {isFailed && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-red-400">{font.name}</span>
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                Not Found
              </span>
            </div>
          )}
        </div>
      ) : (
        <HeadingPreviewContent
          fontName={font.name}
          weight={specificWeight?.weight ?? 400}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          previewText={previewText}
          previewWidth={previewWidth}
          fontSize={fontSize}
          isLoaded={isLoaded}
          isFailed={isFailed}
          weights={font.weights}
          variable={font.variable}
          hasItalic={font.styles.includes("italic")}
        />
      )}
    </div>
  );
}

function FontDetailPreview({
  font,
  isLoaded,
}: {
  font: Font;
  isLoaded: boolean;
}) {
  const fontFamily = `"${font.name}", sans-serif`;
  const opacityClass = isLoaded ? "opacity-100" : "opacity-30";

  // Get a good bold weight for headings
  const boldWeight = font.weights.includes(700)
    ? 700
    : font.weights.includes(600)
      ? 600
      : Math.max(...font.weights);
  // Get a good regular weight for body
  const regularWeight = font.weights.includes(400)
    ? 400
    : font.weights.includes(500)
      ? 500
      : Math.min(...font.weights);
  // Get a good medium weight for form labels
  const mediumWeight = font.weights.includes(500)
    ? 500
    : font.weights.includes(600)
      ? 600
      : regularWeight;

  return (
    <div className={`space-y-8 transition-opacity ${opacityClass}`}>
      {/* Title */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
          Title
        </p>
        <h1
          style={{ fontFamily, fontWeight: boldWeight }}
          className="text-5xl leading-tight"
        >
          {font.name}
        </h1>
      </div>

      {/* Heading */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
          Heading
        </p>
        <h2
          style={{ fontFamily, fontWeight: boldWeight }}
          className="text-2xl leading-snug"
        >
          The quick brown fox jumps over the lazy dog
        </h2>
      </div>

      {/* Body Text */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
          Body
        </p>
        <p
          style={{ fontFamily, fontWeight: regularWeight }}
          className="text-base leading-relaxed text-neutral-700"
        >
          Typography is the art and technique of arranging type to make written
          language legible, readable, and appealing when displayed. The
          arrangement of type involves selecting typefaces, point sizes, line
          lengths, line-spacing, and letter-spacing.
        </p>
      </div>

      {/* Form Fields */}
      <div>
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">
          Form Fields
        </p>
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <label
              style={{ fontFamily, fontWeight: mediumWeight }}
              className="block text-sm text-neutral-600 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              defaultValue="John Doe"
              style={{ fontFamily, fontWeight: regularWeight }}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              style={{ fontFamily, fontWeight: mediumWeight }}
              className="block text-sm text-neutral-600 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={{ fontFamily, fontWeight: regularWeight }}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400"
            />
          </div>

          {/* Textarea */}
          <div>
            <label
              style={{ fontFamily, fontWeight: mediumWeight }}
              className="block text-sm text-neutral-600 mb-1"
            >
              Message
            </label>
            <textarea
              placeholder="Write your message here..."
              rows={3}
              style={{ fontFamily, fontWeight: regularWeight }}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-neutral-400 resize-none"
            />
            <p
              style={{ fontFamily, fontWeight: regularWeight }}
              className="text-xs text-neutral-500 mt-1"
            >
              Optional: Add any additional details
            </p>
          </div>
        </div>
      </div>

      {/* Font Info */}
      <div className="pt-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
          Font Info
        </p>
        <div className="flex flex-wrap gap-2">
          {font.variable && (
            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
              Variable
            </span>
          )}
          {font.styles.includes("italic") && (
            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
              Italic
            </span>
          )}
          <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
            Weights: {font.weights.join(", ")}
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
  lineHeight,
  letterSpacing,
  isSelected,
  onClick,
}: {
  font: Font;
  isLoaded: boolean;
  selectedWeight: number;
  lineHeight: number;
  letterSpacing: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { weight } = getClosestWeight(font.weights, selectedWeight);

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 transition-colors cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      <p
        className={`text-base leading-relaxed transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
        style={{
          fontFamily: `"${font.name}", sans-serif`,
          fontWeight: weight,
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
          {font.variable && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Variable
            </span>
          )}
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          <span className="text-xs text-neutral-400">
            {font.weights.join(" ")}
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
  lineHeight,
  letterSpacing,
  isSelected,
  onClick,
}: {
  font: Font;
  isLoaded: boolean;
  selectedWeight: number;
  lineHeight: number;
  letterSpacing: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { weight } = getClosestWeight(font.weights, selectedWeight);

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 transition-colors cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      <pre
        className={`text-sm leading-relaxed transition-opacity overflow-x-auto ${isLoaded ? "opacity-100" : "opacity-30"}`}
        style={{
          fontFamily: `"${font.name}", monospace`,
          fontWeight: weight,
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
          {font.variable && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Variable
            </span>
          )}
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
          <span className="text-xs text-neutral-400">
            {font.weights.join(" ")}
          </span>
        </div>
      </div>
    </div>
  );
}

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
