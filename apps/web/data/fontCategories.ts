import { z } from "zod";
import { googleFontsMetadata } from "./googleFontsMetadata";
import baseFontCategoriesJson from "./fonts.json";

// Helper to convert "Sans Serif" to "sans-serif"
const dasherize = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, "-");

// Zod schemas (strict mode)
const BaseSubcategorySchema = z
  .object({
    name: z.string(),
    fonts: z.array(z.string()),
  })
  .strict();

const BaseCategorySchema = z
  .object({
    name: z.string(),
    subcategories: z.array(BaseSubcategorySchema),
  })
  .strict();

const BaseFontCategoriesSchema = z.array(BaseCategorySchema);

// Parse and validate JSON
const baseFontCategories = BaseFontCategoriesSchema.parse(
  baseFontCategoriesJson
);

export type Subcategory = {
  id: string;
  name: string;
  fonts: string[];
};

export type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

// Extract all fonts already used in baseFontCategories
const usedFonts = new Set<string>(
  baseFontCategories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) => subcategory.fonts)
  )
);

// Create a map of font name to popularity for sorting
const fontPopularity = new Map<string, number>(
  googleFontsMetadata.familyMetadataList.map((font) => [
    font.family,
    font.popularity,
  ])
);

// Sort fonts by popularity (lower number = more popular)
const sortByPopularity = (fonts: string[]): string[] =>
  [...fonts].sort(
    (a, b) =>
      (fontPopularity.get(a) ?? Infinity) - (fontPopularity.get(b) ?? Infinity)
  );

// Group fonts by category and sort by popularity
const fontsByCategory = new Map<string, string[]>();
const sortedFonts = [...googleFontsMetadata.familyMetadataList].sort(
  (a, b) => a.popularity - b.popularity
);
for (const font of sortedFonts) {
  if (!fontsByCategory.has(font.category)) {
    fontsByCategory.set(font.category, []);
  }
  fontsByCategory.get(font.category)!.push(font.family);
}

// Create a set of Noto fonts to exclude from "More..." subcategories
// (We intentionally exclude Noto fonts from auto-populated subcategories,
// but preserve any explicitly defined Noto fonts in baseFontCategories)
const notoFonts = new Set<string>(
  googleFontsMetadata.familyMetadataList
    .filter((font) => font.isNoto)
    .map((font) => font.family)
);

// Get fonts for a category, filtering out already used fonts and Noto fonts
const getMoreFonts = (categoryName: string): string[] => {
  const fonts = fontsByCategory.get(categoryName) || [];
  return fonts.filter((font) => !usedFonts.has(font) && !notoFonts.has(font));
};

// Get top 50 most popular fonts for a category (excluding Noto fonts)
const POPULAR_COUNT = 50;
const getPopularFonts = (categoryName: string): string[] => {
  const fonts = fontsByCategory.get(categoryName) || [];
  return fonts.filter((font) => !notoFonts.has(font)).slice(0, POPULAR_COUNT);
};

// Break fonts into chunks of 50 for performance, creating subcategories like
// "50 More", "100 More", "150 More", etc.
const CHUNK_SIZE = 50;
const createMoreSubcategories = (
  categoryId: string,
  fonts: string[]
): Subcategory[] => {
  const subcategories: Subcategory[] = [];
  for (let i = 0; i < fonts.length; i += CHUNK_SIZE) {
    const chunk = fonts.slice(i, i + CHUNK_SIZE);
    const end = Math.min(i + CHUNK_SIZE, fonts.length);
    subcategories.push({
      id: `${categoryId}-more-${end}`,
      name: `${end} More`,
      fonts: chunk,
    });
  }
  return subcategories;
};

// Extend baseFontCategories with "Popular" and "More" subcategories and sort all fonts by popularity
export const fontCategories: Category[] = baseFontCategories.map(
  (category) => {
    const categoryId = dasherize(category.name);
    const popularFonts = getPopularFonts(category.name);

    return {
      id: categoryId,
      name: category.name,
      subcategories: [
        // Top 50 fonts by popularity
        {
          id: `${categoryId}-top-50`,
          name: "Favorites",
          fonts: popularFonts,
        },
        ...category.subcategories.map((subcategory) => ({
          id: `${categoryId}-${dasherize(subcategory.name)}`,
          name: subcategory.name,
          fonts: sortByPopularity(subcategory.fonts),
        })),
        ...createMoreSubcategories(categoryId, getMoreFonts(category.name)),
      ],
    };
  }
);
