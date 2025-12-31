// Re-export raw category types for convenience
export type { Category, Subcategory } from "./fontCategories";

export type AxisFallback = {
  name: string;
  value: number;
  displayName: string;
};

export type AxisRegistryEntry = {
  tag: string;
  displayName: string;
  min: number;
  defaultValue: number;
  max: number;
  precision: number;
  description: string;
  fallbackOnly: boolean;
  illustrationUrl?: string;
  fallbacks: AxisFallback[];
};

export type FontVariant = {
  thickness: number | null;
  slant: number | null;
  width: number | null;
  lineHeight: number;
};

export type FontAxis = {
  tag: string;
  min: number;
  max: number;
  defaultValue: number;
};

export type FamilyMetadata = {
  family: string;
  displayName: string | null;
  category: string;
  stroke: string | null;
  classifications: string[];
  size: number;
  subsets: string[];
  fonts: Record<string, FontVariant>;
  axes: FontAxis[];
  designers: string[];
  lastModified: string;
  dateAdded: string;
  popularity: number;
  trending: number;
  defaultSort: number;
  androidFragment: string | null;
  isNoto: boolean;
  colorCapabilities: string[];
  primaryScript: string;
  primaryLanguage: string;
  isOpenSource: boolean;
  isBrandFont: boolean;
  languages: string[];
};

export type GoogleFontsMetadata = {
  axisRegistry: AxisRegistryEntry[];
  familyMetadataList: FamilyMetadata[];
  promotedScript: null;
};

// Processed font type with derived convenience fields + full metadata
export type Font = {
  id: string;
  name: string;
  weights: number[];
  styles: ("normal" | "italic")[];
  variable: boolean;
  metadata: FamilyMetadata;
};

// Enriched subcategory with processed fonts
export type EnrichedSubcategory = {
  id: string;
  name: string;
  fonts: Font[];
};

// Enriched category with processed subcategories
export type EnrichedCategory = {
  id: string;
  name: string;
  subcategories: EnrichedSubcategory[];
};
