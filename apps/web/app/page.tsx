"use client";

import { useState, useEffect } from "react";
import { Textfit } from "react-textfit";
import { Slider } from "@mantine/core";
import { fontCategories, type Subcategory, type Font } from "../data/fontCategories";

export default function Page() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(
    fontCategories[0]?.subcategories[0] ?? null
  );
  const [hoveredSubcategory, setHoveredSubcategory] = useState<Subcategory | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [selectedWeight, setSelectedWeight] = useState(400);
  const [showAllWeights, setShowAllWeights] = useState(false);
  const [previewText, setPreviewText] = useState("The Quick Brown Fox Jumps");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);

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
      {/* Column 1: Category Browser - Slack-style dark sidebar */}
      <div className="w-48 flex-shrink-0 bg-[#3F0E40] overflow-y-auto p-4">
        {fontCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2 className="font-semibold text-[#C4B3C5] uppercase tracking-wide mb-2 px-2" style={{ fontSize: 11 }}>
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

      {/* Column 2: Font List */}
      <div className="basis-3/5 border-r border-neutral-200 flex flex-col">
        {displayedSubcategory ? (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-neutral-200">
                {displayedSubcategory.fonts.map((font) => (
                  <FontPreview key={font.id} font={font} isLoaded={loadedFonts.has(font.id)} selectedWeight={selectedWeight} showAllWeights={showAllWeights} previewText={previewText} lineHeight={lineHeight} letterSpacing={letterSpacing} />
                ))}
              </div>
            </div>
            <div className="bg-white border-t border-neutral-200 px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-500">Show All Weights</span>
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
                    { value: 100, label: '100' },
                    { value: 200, label: '200' },
                    { value: 300, label: '300' },
                    { value: 400, label: '400' },
                    { value: 500, label: '500' },
                    { value: 600, label: '600' },
                    { value: 700, label: '700' },
                    { value: 800, label: '800' },
                    { value: 900, label: '900' },
                  ]}
                  size="sm"
                  color="dark"
                  className="flex-1"
                  styles={{ markLabel: { fontSize: '12px' } }}
                />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-neutral-500 w-20">Line Height</span>
                <Slider
                  value={lineHeight}
                  onChange={setLineHeight}
                  min={0.8}
                  max={2.5}
                  step={0.1}
                  marks={[
                    { value: 0.8, label: '0.8' },
                    { value: 1.0, label: '1.0' },
                    { value: 1.2, label: '1.2' },
                    { value: 1.5, label: '1.5' },
                    { value: 2.0, label: '2.0' },
                    { value: 2.5, label: '2.5' },
                  ]}
                  size="sm"
                  color="dark"
                  className="flex-1"
                  styles={{ markLabel: { fontSize: '12px' } }}
                />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-xs text-neutral-500 w-20">Tracking</span>
                <Slider
                  value={letterSpacing}
                  onChange={setLetterSpacing}
                  min={-0.1}
                  max={0.3}
                  step={0.01}
                  marks={[
                    { value: -0.1, label: '-0.1' },
                    { value: 0, label: '0' },
                    { value: 0.1, label: '0.1' },
                    { value: 0.2, label: '0.2' },
                    { value: 0.3, label: '0.3' },
                  ]}
                  size="sm"
                  color="dark"
                  className="flex-1"
                  styles={{ markLabel: { fontSize: '12px' } }}
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

      {/* Column 3: Font Preview */}
      <div className="basis-2/5 overflow-y-auto p-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Select a font to preview
        </p>
      </div>
    </main>
  );
}

function getAllAvailableWeights(weights: number[]): number[] {
  // Return all weights from 100-900 in increments of 100 that are available
  const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  return standardWeights.filter((w) => weights.includes(w));
}

function getClosestWeight(weights: number[], target: number): { weight: number; isExact: boolean } {
  if (weights.includes(target)) {
    return { weight: target, isExact: true };
  }

  const closest = weights.reduce((prev, curr) =>
    Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
  );

  return { weight: closest, isExact: false };
}

function FontPreview({ font, isLoaded, selectedWeight, showAllWeights, previewText, lineHeight, letterSpacing }: { font: Font; isLoaded: boolean; selectedWeight: number; showAllWeights: boolean; previewText: string; lineHeight: number; letterSpacing: number }) {
  const displayWeights = showAllWeights ? getAllAvailableWeights(font.weights) : [];

  // Convert newlines to <br> elements
  const renderText = (text: string) => {
    const lines = text.split('\n');
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
    <div className={`px-8 py-4 transition-colors cursor-pointer ${isInexactMatch ? "bg-neutral-100" : "hover:bg-neutral-50"}`}>
      {showAllWeights && displayWeights.length > 0 ? (
        <div className="space-y-2">
          {displayWeights.map((weight) => (
            <div key={weight} className="flex items-center gap-3">
              <div className="flex-1 w-[80%]">
                <Textfit
                  mode="single"
                  max={200}
                  className={`transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
                  style={{ fontFamily: `"${font.name}", sans-serif`, fontWeight: weight, lineHeight, letterSpacing: `${letterSpacing}em` }}
                >
                  {renderText(previewText)}
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
            style={{
              fontFamily: `"${font.name}", sans-serif`,
              fontWeight: specificWeight?.weight,
              lineHeight,
              letterSpacing: `${letterSpacing}em`
            }}
          >
            {renderText(previewText)}
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
