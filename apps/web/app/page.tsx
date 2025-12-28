"use client";

import { useState, useEffect } from "react";
import { fontCategories, type Subcategory, type Font } from "../data/fontCategories";

export default function Page() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Load fonts from Google Fonts when a subcategory is selected
  useEffect(() => {
    if (!selectedSubcategory) return;

    const fontsToLoad = selectedSubcategory.fonts.filter(
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
  }, [selectedSubcategory, loadedFonts]);

  return (
    <main className="flex h-screen bg-white">
      {/* Column 1: Category Browser */}
      <div className="w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4">
        {fontCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
              {category.name}
            </h2>
            <ul className="space-y-1">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button
                    onClick={() => setSelectedSubcategory(subcategory)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                      selectedSubcategory?.id === subcategory.id
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
      <div className="flex-1 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
        {selectedSubcategory ? (
          <div>
            <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <h2 className="font-semibold">{selectedSubcategory.name}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {selectedSubcategory.fonts.length} fonts
              </p>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {selectedSubcategory.fonts.map((font) => (
                <FontPreview key={font.id} font={font} isLoaded={loadedFonts.has(font.id)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400 text-sm">
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

function FontPreview({ font, isLoaded }: { font: Font; isLoaded: boolean }) {
  const previewText = "The quick brown fox jumps over the lazy dog";

  return (
    <div className="px-4 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{font.name}</span>
        <div className="flex items-center gap-2">
          {font.variable && (
            <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
              Variable
            </span>
          )}
          {font.styles.includes("italic") && (
            <span className="text-xs px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
              Italic
            </span>
          )}
        </div>
      </div>
      <div
        className={`text-2xl leading-relaxed transition-opacity ${isLoaded ? "opacity-100" : "opacity-30"}`}
        style={{ fontFamily: `"${font.name}", sans-serif` }}
      >
        {previewText}
      </div>
      <div className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
        {font.weights.length} weight{font.weights.length !== 1 ? "s" : ""}: {font.weights.join(", ")}
      </div>
    </div>
  );
}
