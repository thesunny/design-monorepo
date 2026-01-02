"use client";

import { useState, useMemo, useCallback, useDeferredValue, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { Slider } from "@mantine/core";
import { IconHeading, IconAlignLeft, IconStar, IconStarFilled, IconSearch, IconX } from "@tabler/icons-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/convex/convex/_generated/api";
import type {
  Category,
  Subcategory,
  Font,
} from "../data/types";
import { CategorySidebar } from "./CategorySidebar";
import { FavoritesColumn } from "./FavoritesColumn";
import { useFontLoader } from "./hooks/useFontLoader";
import { FontWeightRow } from "./FontWeightRow";
import { NormalizedText } from "./components/NormalizedText";
import { isMonospaceFont } from "./utils";

type PageClientProps = {
  fontCategories: Category[];
  allFonts: Font[];
};

// Default values for URL state
const DEFAULTS = {
  previewMode: "headings" as const,
  searchInput: "",
  filterBold: false,
  filterItalic: false,
  filterVariable: false,
  selectedWeight: 400,
  headingsFontSize: 36,
  textFontSize: 16,
  letterSpacing: 0,
  lineHeight: 1.2,
  lineHeightAuto: true,
  showAllWeights: false,
  showItalics: false,
  previewText: "The Quick Brown Fox Jumps",
};

// Helper to find subcategory by ID across all categories
function findSubcategoryById(categories: Category[], id: string): Subcategory | null {
  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      if (subcategory.id === id) {
        return subcategory;
      }
    }
  }
  return null;
}

export default function PageClient({ fontCategories, allFonts }: PageClientProps) {
  // URL state management
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isInitialized = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get default subcategory
  const defaultSubcategory = fontCategories[0]?.subcategories[0] ?? null;

  // Initialize state from URL params
  const getInitialSubcategory = () => {
    const categoryId = searchParams.get("category");
    if (categoryId) {
      const found = findSubcategoryById(fontCategories, categoryId);
      if (found) return found;
    }
    return defaultSubcategory;
  };

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(getInitialSubcategory);
  const [hoveredSubcategory, setHoveredSubcategory] =
    useState<Subcategory | null>(null);
  const [selectedWeight, setSelectedWeight] = useState(() => {
    const w = searchParams.get("weight");
    return w ? parseInt(w, 10) : DEFAULTS.selectedWeight;
  });
  const [showAllWeights, setShowAllWeights] = useState(() =>
    searchParams.get("allWeights") === "1"
  );
  const [showItalics, setShowItalics] = useState(() =>
    searchParams.get("italics") === "1"
  );
  const [previewText, setPreviewText] = useState(() =>
    searchParams.get("text") ?? DEFAULTS.previewText
  );
  const [lineHeight, setLineHeight] = useState(() => {
    const lh = searchParams.get("lineHeight");
    return lh ? parseFloat(lh) : DEFAULTS.lineHeight;
  });
  const [lineHeightAuto, setLineHeightAuto] = useState(() =>
    searchParams.get("lineHeightAuto") !== "0"
  );
  const [letterSpacing, setLetterSpacing] = useState(() => {
    const ls = searchParams.get("tracking");
    return ls ? parseFloat(ls) : DEFAULTS.letterSpacing;
  });
  const [previewMode, setPreviewMode] = useState<"headings" | "paragraphs" | "code">(() => {
    const tab = searchParams.get("tab");
    if (tab === "paragraphs" || tab === "code") return tab;
    return DEFAULTS.previewMode;
  });
  const [filterBold, setFilterBold] = useState(() =>
    searchParams.get("bold") === "1"
  );
  const [filterItalic, setFilterItalic] = useState(() =>
    searchParams.get("italic") === "1"
  );
  const [filterVariable, setFilterVariable] = useState(() =>
    searchParams.get("variable") === "1"
  );
  const [searchInput, setSearchInput] = useState(() =>
    searchParams.get("q") ?? DEFAULTS.searchInput
  );
  // Defer the search query so typing stays responsive
  const deferredSearchQuery = useDeferredValue(searchInput);
  const [headingsFontSize, setHeadingsFontSize] = useState(() => {
    const hs = searchParams.get("headingSize");
    return hs ? parseInt(hs, 10) : DEFAULTS.headingsFontSize;
  });
  const [textFontSize, setTextFontSize] = useState(() => {
    const ts = searchParams.get("textSize");
    return ts ? parseInt(ts, 10) : DEFAULTS.textFontSize;
  });

  // Sync state with URL when user navigates back/forward
  useEffect(() => {
    // Skip the initial render since state is already initialized from URL
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    // Update all state from current URL params
    const categoryId = searchParams.get("category");
    if (categoryId) {
      const found = findSubcategoryById(fontCategories, categoryId);
      if (found) setSelectedSubcategory(found);
    } else {
      setSelectedSubcategory(defaultSubcategory);
    }

    const tab = searchParams.get("tab");
    if (tab === "paragraphs" || tab === "code") {
      setPreviewMode(tab);
    } else {
      setPreviewMode(DEFAULTS.previewMode);
    }

    setSearchInput(searchParams.get("q") ?? DEFAULTS.searchInput);
    setFilterBold(searchParams.get("bold") === "1");
    setFilterItalic(searchParams.get("italic") === "1");
    setFilterVariable(searchParams.get("variable") === "1");

    const w = searchParams.get("weight");
    setSelectedWeight(w ? parseInt(w, 10) : DEFAULTS.selectedWeight);

    const hs = searchParams.get("headingSize");
    setHeadingsFontSize(hs ? parseInt(hs, 10) : DEFAULTS.headingsFontSize);

    const ts = searchParams.get("textSize");
    setTextFontSize(ts ? parseInt(ts, 10) : DEFAULTS.textFontSize);

    const ls = searchParams.get("tracking");
    setLetterSpacing(ls ? parseFloat(ls) : DEFAULTS.letterSpacing);

    const lh = searchParams.get("lineHeight");
    setLineHeight(lh ? parseFloat(lh) : DEFAULTS.lineHeight);

    setLineHeightAuto(searchParams.get("lineHeightAuto") !== "0");
    setShowAllWeights(searchParams.get("allWeights") === "1");
    setShowItalics(searchParams.get("italics") === "1");
    setPreviewText(searchParams.get("text") ?? DEFAULTS.previewText);
  }, [searchParams, fontCategories, defaultSubcategory]);

  // Helper to build and update URL with current state
  const updateUrl = useCallback((overrides: {
    category?: string | null;
    tab?: "headings" | "paragraphs" | "code";
    q?: string;
    bold?: boolean;
    italic?: boolean;
    variable?: boolean;
    weight?: number;
    headingSize?: number;
    textSize?: number;
    tracking?: number;
    lineHeight?: number;
    lineHeightAuto?: boolean;
    allWeights?: boolean;
    italics?: boolean;
    text?: string;
  } = {}) => {
    const params = new URLSearchParams();

    // Category
    const categoryId = overrides.category !== undefined
      ? overrides.category
      : selectedSubcategory?.id ?? null;
    if (categoryId && categoryId !== defaultSubcategory?.id) {
      params.set("category", categoryId);
    }

    // Tab
    const tab = overrides.tab !== undefined ? overrides.tab : previewMode;
    if (tab !== DEFAULTS.previewMode) {
      params.set("tab", tab);
    }

    // Search query
    const q = overrides.q !== undefined ? overrides.q : searchInput;
    if (q !== DEFAULTS.searchInput) {
      params.set("q", q);
    }

    // Filters
    const bold = overrides.bold !== undefined ? overrides.bold : filterBold;
    if (bold !== DEFAULTS.filterBold) {
      params.set("bold", "1");
    }

    const italic = overrides.italic !== undefined ? overrides.italic : filterItalic;
    if (italic !== DEFAULTS.filterItalic) {
      params.set("italic", "1");
    }

    const variable = overrides.variable !== undefined ? overrides.variable : filterVariable;
    if (variable !== DEFAULTS.filterVariable) {
      params.set("variable", "1");
    }

    // Weight
    const weight = overrides.weight !== undefined ? overrides.weight : selectedWeight;
    if (weight !== DEFAULTS.selectedWeight) {
      params.set("weight", weight.toString());
    }

    // Heading size
    const headingSize = overrides.headingSize !== undefined ? overrides.headingSize : headingsFontSize;
    if (headingSize !== DEFAULTS.headingsFontSize) {
      params.set("headingSize", headingSize.toString());
    }

    // Text size
    const textSize = overrides.textSize !== undefined ? overrides.textSize : textFontSize;
    if (textSize !== DEFAULTS.textFontSize) {
      params.set("textSize", textSize.toString());
    }

    // Tracking
    const tracking = overrides.tracking !== undefined ? overrides.tracking : letterSpacing;
    if (tracking !== DEFAULTS.letterSpacing) {
      params.set("tracking", tracking.toString());
    }

    // Line height
    const lh = overrides.lineHeight !== undefined ? overrides.lineHeight : lineHeight;
    if (lh !== DEFAULTS.lineHeight) {
      params.set("lineHeight", lh.toString());
    }

    // Line height auto
    const lhAuto = overrides.lineHeightAuto !== undefined ? overrides.lineHeightAuto : lineHeightAuto;
    if (lhAuto !== DEFAULTS.lineHeightAuto) {
      params.set("lineHeightAuto", "0");
    }

    // Show all weights
    const allWeights = overrides.allWeights !== undefined ? overrides.allWeights : showAllWeights;
    if (allWeights !== DEFAULTS.showAllWeights) {
      params.set("allWeights", "1");
    }

    // Show italics
    const italics = overrides.italics !== undefined ? overrides.italics : showItalics;
    if (italics !== DEFAULTS.showItalics) {
      params.set("italics", "1");
    }

    // Preview text
    const text = overrides.text !== undefined ? overrides.text : previewText;
    if (text !== DEFAULTS.previewText) {
      params.set("text", text);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [
    pathname, router, defaultSubcategory?.id,
    selectedSubcategory?.id, previewMode, searchInput,
    filterBold, filterItalic, filterVariable,
    selectedWeight, headingsFontSize, textFontSize,
    letterSpacing, lineHeight, lineHeightAuto,
    showAllWeights, showItalics, previewText
  ]);

  // Debounced URL update for text inputs
  const updateUrlDebounced = useCallback((overrides: Parameters<typeof updateUrl>[0]) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateUrl(overrides);
    }, 300);
  }, [updateUrl]);

  // Mark as initialized after first render
  useEffect(() => {
    isInitialized.current = true;
  }, []);

  // Search input ref for keyboard shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);
  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  // Detect platform for keyboard shortcut display
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Fixed font size for favorites column (not affected by slider)
  const FAVORITES_FONT_SIZE = 24;

  // Use headings font size for headings tab, text font size for paragraphs/code
  const fontSize = previewMode === "headings" ? headingsFontSize : textFontSize;
  const setFontSize = previewMode === "headings" ? setHeadingsFontSize : setTextFontSize;

  // Fetch favorites for Column 3
  const favorites = useQuery(api.favorites.getFavorites);

  // The subcategory to display: hovered takes priority, then selected
  const displayedSubcategory = hoveredSubcategory || selectedSubcategory;

  // Create a map of font name -> Font for fast lookup
  const fontByNameMap = useMemo(() => {
    const map = new Map<string, Font>();
    for (const font of allFonts) {
      map.set(font.name, font);
    }
    return map;
  }, [allFonts]);

  // Create a map of font id -> Font for favorites lookup
  const fontByIdMap = useMemo(() => {
    const map = new Map<string, Font>();
    for (const font of allFonts) {
      map.set(font.id, font);
    }
    return map;
  }, [allFonts]);

  // Get Font objects for a subcategory's font names
  const getFontsForSubcategory = useCallback(
    (subcategory: Subcategory): Font[] => {
      const fonts: Font[] = [];
      for (const fontName of subcategory.fonts) {
        const font = fontByNameMap.get(fontName);
        if (font) {
          fonts.push(font);
        }
      }
      return fonts;
    },
    [fontByNameMap]
  );

  // Get fonts for the displayed subcategory
  const displayedFonts = useMemo(() => {
    if (!displayedSubcategory) return [];
    return getFontsForSubcategory(displayedSubcategory);
  }, [displayedSubcategory, getFontsForSubcategory]);

  // Maximum number of search results to display (prevents loading hundreds of fonts)
  const MAX_SEARCH_RESULTS = 50;

  // Search fonts across all fonts when there's a search query (uses deferred value)
  const searchedFonts = useMemo(() => {
    if (!deferredSearchQuery.trim()) return null;
    const query = deferredSearchQuery.toLowerCase().trim();
    const results: Font[] = [];
    for (const font of allFonts) {
      if (font.name.toLowerCase().includes(query)) {
        results.push(font);
        if (results.length >= MAX_SEARCH_RESULTS) break;
      }
    }
    return results;
  }, [deferredSearchQuery, allFonts]);

  // Track if search is pending (input differs from deferred value)
  const isSearchPending = searchInput !== deferredSearchQuery;

  // Determine which fonts to show: searched fonts or category fonts
  const baseFonts = searchedFonts ?? displayedFonts;

  // Compute all fonts that need to be loaded (displayed/searched fonts + favorites)
  const fontsToLoad = useMemo(() => {
    const fonts: Font[] = [];
    const seenIds = new Set<string>();

    // Add fonts from current view (search results or category)
    for (const font of baseFonts) {
      if (!seenIds.has(font.id)) {
        seenIds.add(font.id);
        fonts.push(font);
      }
    }

    // Add fonts from favorites (look up full Font object)
    if (favorites) {
      for (const fav of favorites) {
        if (!seenIds.has(fav.fontId)) {
          const font = fontByIdMap.get(fav.fontId);
          if (font) {
            seenIds.add(fav.fontId);
            fonts.push(font);
          }
        }
      }
    }

    return fonts;
  }, [baseFonts, favorites, fontByIdMap]);

  // Load fonts using the optimized hook (one link per font)
  const { failedFonts } = useFontLoader(fontsToLoad);

  // Filter fonts based on active filters
  const filteredFonts = baseFonts.filter((font) => {
    if (filterBold) {
      const hasNormal = font.weights.some((w) => w >= 400 && w <= 500);
      const hasBold = font.weights.some((w) => w >= 600);
      if (!hasNormal || !hasBold) return false;
    }
    if (filterItalic && !font.styles.includes("italic")) return false;
    if (filterVariable && !font.variable) return false;
    return true;
  });

  return (
    <main className="flex h-screen bg-white">
      <CategorySidebar
        fontCategories={fontCategories}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={(subcategory) => {
          setSelectedSubcategory(subcategory);
          updateUrl({ category: subcategory?.id ?? null });
        }}
        onHoverSubcategory={setHoveredSubcategory}
      />

      {/* Column 2: Font List */}
      <div className={`flex-1 min-w-0 border-r border-neutral-200 flex flex-col transition-opacity duration-150 ${hoveredSubcategory && hoveredSubcategory.id !== selectedSubcategory?.id ? 'opacity-50' : ''}`}>
        {displayedSubcategory ? (
          <>
            {/* Tabs and Filters */}
            <div className="flex border-b border-neutral-200 pl-4 pr-4 h-12">
              <button
                onClick={() => {
                  setPreviewMode("headings");
                  updateUrl({ tab: "headings" });
                }}
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
                onClick={() => {
                  setPreviewMode("paragraphs");
                  updateUrl({ tab: "paragraphs" });
                }}
                style={{ fontSize: 13 }}
                className={`px-3 h-full flex items-center font-medium transition-colors cursor-pointer mb-[-1px] border-b-2 ${
                  previewMode === "paragraphs"
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700 border-transparent"
                }`}
              >
                <IconAlignLeft size={16} className="mr-1.5" />
                Text
              </button>
              <div className="flex items-center ml-auto mr-4">
                <div className="relative">
                  <IconSearch size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isSearchPending ? "text-neutral-300" : "text-neutral-400"}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      updateUrlDebounced({ q: e.target.value });
                    }}
                    placeholder="Search fonts..."
                    style={{ fontSize: 13 }}
                    className={`w-48 pl-7 pr-12 py-1.5 border border-neutral-200 rounded focus:outline-none focus:border-neutral-400 ${isSearchPending ? "bg-neutral-50" : ""}`}
                  />
                  {searchInput ? (
                    <button
                      onClick={() => {
                        setSearchInput("");
                        updateUrl({ q: "" });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <IconX size={14} />
                    </button>
                  ) : (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-neutral-400 pointer-events-none">
                      {isMac ? "⌘K" : "Ctrl+K"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newValue = !filterBold;
                    setFilterBold(newValue);
                    updateUrl({ bold: newValue });
                  }}
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
                  onClick={() => {
                    const newValue = !filterItalic;
                    setFilterItalic(newValue);
                    updateUrl({ italic: newValue });
                  }}
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
                  onClick={() => {
                    const newValue = !filterVariable;
                    setFilterVariable(newValue);
                    updateUrl({ variable: newValue });
                  }}
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
                    <HeadingPreview
                      key={font.id}
                      font={font}
                      isFailed={failedFonts.has(font.id)}
                      selectedWeight={selectedWeight}
                      showAllWeights={showAllWeights}
                      showItalics={showItalics}
                      previewText={previewText}
                      lineHeight={lineHeight}
                      lineHeightAuto={lineHeightAuto}
                      letterSpacing={letterSpacing}
                      fontSize={fontSize}
                    />
                  ))}
                </div>
              )}
              {previewMode === "paragraphs" && (
                <div className="divide-y divide-neutral-200">
                  {filteredFonts.map((font) => (
                    <TextPreview
                      key={font.id}
                      font={font}
                      selectedWeight={selectedWeight}
                      showItalics={showItalics}
                      lineHeight={lineHeight}
                      lineHeightAuto={lineHeightAuto}
                      letterSpacing={letterSpacing}
                      fontSize={fontSize}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Preview Controls */}
            <div className="bg-white border-t border-neutral-200 px-4 py-3">
              {/* Controls grid: label | control | optional toggle */}
              <div
                className="grid gap-x-3 gap-y-6 mb-2 items-center"
                style={{ gridTemplateColumns: "5rem 1fr auto" }}
              >
                {/* Weight row */}
                <span className="text-xs text-neutral-500">Weight</span>
                <Slider
                  value={selectedWeight}
                  onChange={setSelectedWeight}
                  onChangeEnd={(value) => updateUrl({ weight: value })}
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
                    onClick={() => {
                      const newValue = !showAllWeights;
                      setShowAllWeights(newValue);
                      updateUrl({ allWeights: newValue });
                    }}
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
                  onChangeEnd={(value) => updateUrl(
                    previewMode === "headings"
                      ? { headingSize: value }
                      : { textSize: value }
                  )}
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
                <label className="flex items-center gap-2 cursor-pointer ml-3">
                  <button
                    role="switch"
                    aria-checked={showItalics}
                    onClick={() => {
                      const newValue = !showItalics;
                      setShowItalics(newValue);
                      updateUrl({ italics: newValue });
                    }}
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
                  <span className="text-xs text-neutral-500 whitespace-nowrap">Italics</span>
                </label>

                {/* Tracking row */}
                <span className="text-xs text-neutral-500">Tracking</span>
                <Slider
                  value={letterSpacing}
                  onChange={setLetterSpacing}
                  onChangeEnd={(value) => updateUrl({ tracking: value })}
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

                {/* Line Height row - hidden for headings tab */}
                {previewMode !== "headings" && (
                  <>
                    <span className="text-xs text-neutral-500">Line Height</span>
                    <Slider
                      value={lineHeight}
                      onChange={setLineHeight}
                      onChangeEnd={(value) => updateUrl({ lineHeight: value })}
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
                      disabled={lineHeightAuto}
                      styles={{ markLabel: { fontSize: "12px" } }}
                    />
                    <label className="flex items-center gap-2 cursor-pointer ml-3">
                      <button
                        role="switch"
                        aria-checked={lineHeightAuto}
                        onClick={() => {
                          const newValue = !lineHeightAuto;
                          setLineHeightAuto(newValue);
                          updateUrl({ lineHeightAuto: newValue });
                        }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          lineHeightAuto ? "bg-neutral-900" : "bg-neutral-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            lineHeightAuto ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                      <span className="text-xs text-neutral-500 whitespace-nowrap">Auto</span>
                    </label>
                  </>
                )}

                {/* Preview Text row - hidden for paragraphs/text tab */}
                {previewMode !== "paragraphs" && (
                  <>
                    <span className="text-xs text-neutral-500">Text</span>
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => {
                        setPreviewText(e.target.value);
                        updateUrlDebounced({ text: e.target.value });
                      }}
                      placeholder="Enter preview text..."
                      className="w-full px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
                    />
                    <div className="grid grid-cols-2 gap-1.5 ml-3">
                      {[
                        { label: "Title", value: "The Quick Brown Fox Jumps" },
                        { label: "Kerning", value: "AVATAR Hamburgefontsiv" },
                        { label: "Numbers", value: "0123456789 $€£¥" },
                        { label: "Alphabet", value: "abcdefghijklmnopqrstuvwxyz" },
                      ].map(({ label, value }) => {
                        const isActive = previewText === value;
                        return (
                          <button
                            key={label}
                            onClick={() => {
                              setPreviewText(value);
                              updateUrl({ text: value });
                            }}
                            className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              isActive
                                ? "bg-neutral-300 text-neutral-700"
                                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                            }`}
                            style={{ fontSize: 10 }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
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
        failedFonts={failedFonts}
        previewText={previewText}
        fontSize={FAVORITES_FONT_SIZE}
        fontByIdMap={fontByIdMap}
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

/**
 * Gets the lineHeight from font metadata for a specific weight and style.
 * Falls back to 1.2 if not found.
 */
function getFontLineHeight(font: Font, weight: number, isItalic: boolean): number {
  const key = isItalic ? `${weight}i` : `${weight}`;
  const variant = font.metadata.fonts[key];
  return variant?.lineHeight ?? 1.2;
}

function FontMetadata({
  font,
  isFailed,
}: {
  font: Font;
  isFailed?: boolean;
}) {
  const hasItalic = font.styles.includes("italic");

  return (
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
  );
}

function HeadingPreview({
  font,
  isFailed,
  selectedWeight,
  showAllWeights,
  showItalics,
  previewText,
  lineHeight,
  lineHeightAuto,
  letterSpacing,
  fontSize,
}: {
  font: Font;
  isFailed?: boolean;
  selectedWeight: number;
  showAllWeights: boolean;
  showItalics: boolean;
  previewText: string;
  lineHeight: number;
  lineHeightAuto: boolean;
  letterSpacing: number;
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
        {weightsToDisplay.map((weight) => {
          const isItalic = showItalics && hasItalic;
          const effectiveLineHeight = lineHeightAuto
            ? getFontLineHeight(font, weight, isItalic)
            : lineHeight;
          return (
          <FontWeightRow
            key={weight}
            fontName={font.name}
            weight={weight}
            lineHeight={effectiveLineHeight}
            letterSpacing={letterSpacing}
            previewText={previewText}
            fontSize={fontSize}
            isMonospace={isMonospaceFont(font)}
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
        );
        })}
      </div>
      <FontMetadata font={font} isFailed={isFailed} />
    </div>
  );
}

const PARAGRAPH_NORMALIZATION_TEXT = "this is a simple sample text that represents average spacing and letter frequency";
const FORM_LABEL_SIZE_SCALE = 0.9375; // 15/16 (15px when base font size is 16px)

function TextPreview({
  font,
  selectedWeight,
  showItalics,
  lineHeight,
  lineHeightAuto,
  letterSpacing,
  fontSize,
}: {
  font: Font;
  selectedWeight: number;
  showItalics: boolean;
  lineHeight: number;
  lineHeightAuto: boolean;
  letterSpacing: number;
  fontSize: number;
}) {
  const { isSignedIn } = useAuth();
  const favorites = useQuery(api.favorites.getFavorites);
  const addFavorite = useMutation(api.favorites.addFavorite);
  const removeFavorite = useMutation(api.favorites.removeFavorite);

  const { weight } = getClosestWeight(font.weights, selectedWeight);
  const hasItalic = font.styles.includes("italic");
  const italicUnavailable = showItalics && !hasItalic;
  const fontStyle = showItalics && hasItalic ? "italic" : "normal";
  const isItalic = showItalics && hasItalic;
  const effectiveLineHeight = lineHeightAuto
    ? getFontLineHeight(font, weight, isItalic)
    : lineHeight;
  const isMonospace = isMonospaceFont(font);

  // Check if current font+weight is favorited as a paragraph
  const isFavorited = favorites?.some(
    (fav) =>
      fav.fontId === font.id &&
      fav.weight === weight &&
      fav.type === "paragraph"
  ) ?? false;

  const handleStarClick = () => {
    if (isFavorited) {
      removeFavorite({
        fontId: font.id,
        weight,
        lineHeight: 1.4,
        letterSpacing: 0,
        type: "paragraph",
      });
    } else {
      addFavorite({
        fontId: font.id,
        fontName: font.name,
        weight,
        lineHeight: 1.4,
        letterSpacing: 0,
        type: "paragraph",
      });
    }
  };

  return (
    <div className="px-8 py-4">
      <div className="relative">
        {isSignedIn && (
          <button
            onClick={handleStarClick}
            className="absolute p-1 rounded hover:bg-neutral-100 transition-colors z-10"
            style={{ top: -8, right: -8 }}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? (
              <IconStarFilled size={16} className="text-yellow-500" />
            ) : (
              <IconStar size={16} className="text-neutral-400" />
            )}
          </button>
        )}
        <div className="flex gap-6">
        {/* Left: Paragraph preview */}
        <div className="flex-1 min-w-0">
          <NormalizedText
            fontFamily={font.name}
            fontWeight={weight}
            fontStyle={fontStyle}
            lineHeight={effectiveLineHeight}
            letterSpacing={letterSpacing}
            normalizedFontSize={fontSize}
            normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
            isMonospace={isMonospace}
            className={italicUnavailable ? "opacity-30" : ""}
          >
            Typography is the art of arranging type. It makes text legible and
            appealing when displayed.
            <br /><br />
            Good design uses <strong>contrast</strong> and <em>spacing</em>.
          </NormalizedText>
        </div>
        {/* Right: Code preview (monospace) or UI sample (non-monospace) */}
        <div className="flex-1 min-w-0">
          {isMonospace ? (
            <div className="overflow-x-auto bg-neutral-50 rounded p-3">
              <NormalizedText
                fontFamily={font.name}
                fontWeight={weight}
                fontStyle={fontStyle}
                lineHeight={effectiveLineHeight}
                letterSpacing={letterSpacing}
                normalizedFontSize={fontSize}
                normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
                isMonospace={true}
                className={italicUnavailable ? "opacity-30" : ""}
                style={{ display: "block", whiteSpace: "pre" }}
              >{`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1);
}

const result = fibonacci(10);`}</NormalizedText>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-0.5">
                <NormalizedText
                  fontFamily={font.name}
                  fontWeight={weight}
                  fontStyle={fontStyle}
                  lineHeight={effectiveLineHeight}
                  letterSpacing={letterSpacing}
                  normalizedFontSize={fontSize * FORM_LABEL_SIZE_SCALE}
                  normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
                  isMonospace={false}
                  className={italicUnavailable ? "opacity-30" : ""}
                  style={{ display: "block", marginBottom: 4, color: "#525252" }}
                >
                  Email address
                </NormalizedText>
                <NormalizedText
                  fontFamily={font.name}
                  fontWeight={weight}
                  fontStyle={fontStyle}
                  lineHeight={effectiveLineHeight}
                  letterSpacing={letterSpacing}
                  normalizedFontSize={fontSize}
                  normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
                  isMonospace={false}
                  className={`block w-full border border-neutral-300 rounded px-3 py-2 ${italicUnavailable ? "opacity-30" : ""}`}
                  style={{ color: "#a3a3a3" }}
                >
                  you@example.com
                </NormalizedText>
              </div>
              <div className={`flex items-center gap-2 ${italicUnavailable ? "opacity-30" : ""}`}>
                <input
                  type="checkbox"
                  readOnly
                  className="rounded border-neutral-300"
                />
                <NormalizedText
                  fontFamily={font.name}
                  fontWeight={weight}
                  fontStyle={fontStyle}
                  lineHeight={effectiveLineHeight}
                  letterSpacing={letterSpacing}
                  normalizedFontSize={fontSize * FORM_LABEL_SIZE_SCALE}
                  normalizationText={PARAGRAPH_NORMALIZATION_TEXT}
                  isMonospace={false}
                  style={{ color: "#525252" }}
                >
                  Keep me signed in
                </NormalizedText>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
      <FontMetadata font={font} />
    </div>
  );
}
