"use client";

import { useState, useEffect } from "react";
import { Textfit } from "react-textfit";
import { fontCategories, type Subcategory, type Font } from "../data/fontCategories";

export default function Page() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<Subcategory | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [showWeights, setShowWeights] = useState(false);

  // The subcategory to display: hovered takes priority, then selected
  const displayedSubcategory = hoveredSubcategory || selectedSubcategory;

  // Load fonts from Google Fonts when a subcategory is displayed
  useEffect(() => {
    if (!displayedSubcategory) return;

    const fontsToLoad = displayedSubcategory.fonts.filter(
      (font) => !loadedFonts.has(font.id)
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

    // Mark fonts as loaded
    setLoadedFonts((prev) => {
      const next = new Set(prev);
      fontsToLoad.forEach((font) => next.add(font.id));
      return next;
    });
  }, [displayedSubcategory, loadedFonts]);

  return (
    <main className="flex h-screen bg-white">
      {/* Column 1: Category Browser */}
      <div className="w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4">
        {fontCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
              {category.name}
            </h2>
            <ul>
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button
                    onClick={() => setSelectedSubcategory(subcategory)}
                    onMouseEnter={() => setHoveredSubcategory(subcategory)}
                    onMouseLeave={() => setHoveredSubcategory(null)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                      selectedSubcategory?.id === subcategory.id
                        ? "bg-neutral-900 text-white"
                        : "hover:bg-neutral-100"
                    }`}
                  >
                    {subcategory.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Column 2: Font List */}
      <div className="flex-1 border-r border-neutral-200 overflow-y-auto">
        {displayedSubcategory ? (
          <div>
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{displayedSubcategory.name}</h2>
                  <p className="text-sm text-neutral-500">
                    {displayedSubcategory.fonts.length} fonts
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-neutral-500">Weights</span>
                  <button
                    role="switch"
                    aria-checked={showWeights}
                    onClick={() => setShowWeights(!showWeights)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showWeights ? "bg-neutral-900" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showWeights ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
            <div className="divide-y divide-neutral-100">
              {displayedSubcategory.fonts.map((font) => (
                <FontPreview key={font.id} font={font} isLoaded={loadedFonts.has(font.id)} showWeights={showWeights} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
            Select a category to view fonts
          </div>
        )}
      </div>

      {/* Column 3: Font Preview */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Select a font to preview
        </p>
      </div>
    </main>
  );
}

function getDisplayWeights(weights: number[]): number[] {
  const sortedWeights = [...weights].sort((a, b) => a - b);
  const result: number[] = [];

  // Find lowest weight below 400
  const belowFour = sortedWeights.filter((w) => w < 400);
  if (belowFour.length > 0) {
    result.push(belowFour[0]); // lowest below 400
  }

  // Add 400 if available
  if (weights.includes(400)) {
    result.push(400);
  }

  // Add 700 if available
  if (weights.includes(700)) {
    result.push(700);
  }

  // Find highest weight above 700
  const aboveSeven = sortedWeights.filter((w) => w > 700);
  if (aboveSeven.length > 0) {
    result.push(aboveSeven[aboveSeven.length - 1]); // highest above 700
  }

  // Remove duplicates and sort
  return [...new Set(result)].sort((a, b) => a - b);
}

function FontPreview({ font, isLoaded, showWeights }: { font: Font; isLoaded: boolean; showWeights: boolean }) {
  const previewText = "The Quick Brown Fox Jumps";
  const displayWeights = showWeights ? getDisplayWeights(font.weights) : [];

  return (
    <div className="px-4 py-4 hover:bg-neutral-50 transition-colors cursor-pointer">
      {showWeights && displayWeights.length > 0 ? (
        <div className="space-y-2">
          {displayWeights.map((weight) => (
            <div key={weight} className="flex items-center gap-3">
              <div className="flex-1 w-[80%]">
                <Textfit
                  mode="single"
                  max={200}
                  className={`transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
                  style={{ fontFamily: `"${font.name}", sans-serif`, fontWeight: weight, height: "1.2em" }}
                >
                  {previewText}
                </Textfit>
              </div>
              <span className="text-xs text-neutral-400 w-8 text-right">{weight}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[85%]">
          <Textfit
            mode="single"
            max={200}
            className={`transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
            style={{ fontFamily: `"${font.name}", sans-serif`, height: "1.2em" }}
          >
            {previewText}
          </Textfit>
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">{font.name}</span>
          {font.variable && (
            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
              Variable
            </span>
          )}
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
              Italic
            </span>
          )}
        </div>
        <span className="text-xs text-neutral-400">
          {font.weights.join(" ")}
        </span>
      </div>
    </div>
  );
}
