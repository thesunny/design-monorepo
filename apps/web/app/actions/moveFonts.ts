"use server";

import { z } from "zod";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const MoveFontsInputSchema = z.object({
  categoryName: z.string().min(1),
  subcategoryName: z.string().min(1),
  fontNames: z.array(z.string().min(1)).min(1),
});

type MoveFontsInput = z.infer<typeof MoveFontsInputSchema>;

const FontsJsonSchema = z.array(
  z.object({
    name: z.string(),
    subcategories: z.array(
      z.object({
        name: z.string(),
        fonts: z.array(z.string()),
      })
    ),
  })
);

export async function moveFontsToSubcategory(input: MoveFontsInput) {
  const parsed = MoveFontsInputSchema.parse(input);
  const { categoryName, subcategoryName, fontNames } = parsed;

  const fontsJsonPath = path.join(process.cwd(), "data", "fonts.json");
  const fileContents = await readFile(fontsJsonPath, "utf-8");
  const fontsData = FontsJsonSchema.parse(JSON.parse(fileContents));

  const fontNamesSet = new Set(fontNames);

  // Remove fonts from all subcategories
  for (const category of fontsData) {
    for (const subcategory of category.subcategories) {
      subcategory.fonts = subcategory.fonts.filter(
        (font) => !fontNamesSet.has(font)
      );
    }
  }

  // Find the target category and subcategory and add fonts
  const targetCategory = fontsData.find((c) => c.name === categoryName);
  if (!targetCategory) {
    throw new Error(`Category "${categoryName}" not found`);
  }

  const targetSubcategory = targetCategory.subcategories.find(
    (s) => s.name === subcategoryName
  );
  if (!targetSubcategory) {
    throw new Error(
      `Subcategory "${subcategoryName}" not found in category "${categoryName}"`
    );
  }

  // Add the fonts to the end of the target subcategory
  targetSubcategory.fonts.push(...fontNames);

  // Write back to fonts.json
  await writeFile(fontsJsonPath, JSON.stringify(fontsData, null, 2) + "\n");

  return { success: true };
}

const RemoveFontsInputSchema = z.object({
  fontNames: z.array(z.string().min(1)).min(1),
});

type RemoveFontsInput = z.infer<typeof RemoveFontsInputSchema>;

export async function removeFontsFromSubcategory(input: RemoveFontsInput) {
  const parsed = RemoveFontsInputSchema.parse(input);
  const { fontNames } = parsed;

  const fontsJsonPath = path.join(process.cwd(), "data", "fonts.json");
  const fileContents = await readFile(fontsJsonPath, "utf-8");
  const fontsData = FontsJsonSchema.parse(JSON.parse(fileContents));

  const fontNamesSet = new Set(fontNames);

  // Remove fonts from all subcategories
  for (const category of fontsData) {
    for (const subcategory of category.subcategories) {
      subcategory.fonts = subcategory.fonts.filter(
        (font) => !fontNamesSet.has(font)
      );
    }
  }

  // Write back to fonts.json
  await writeFile(fontsJsonPath, JSON.stringify(fontsData, null, 2) + "\n");

  return { success: true };
}
