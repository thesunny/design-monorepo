"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import type { Category, Subcategory } from "../data/types";

type CategorySidebarProps = {
  fontCategories: Category[];
  selectedSubcategory: Subcategory | null;
  onSelectSubcategory: (subcategory: Subcategory) => void;
  onHoverSubcategory: (subcategory: Subcategory | null) => void;
  checkedFontNames: string[];
  onMoveFonts: (categoryName: string, subcategoryName: string) => void;
};

export function CategorySidebar({
  fontCategories,
  selectedSubcategory,
  onSelectSubcategory,
  onHoverSubcategory,
  checkedFontNames,
  onMoveFonts,
}: CategorySidebarProps) {
  const hasCheckedFonts = checkedFontNames.length > 0;
  return (
    <div className="w-40 bg-[#3b260f] flex flex-col">
      <div className="flex items-center px-4 pt-2 pb-2">
        <span
          className="font-[family-name:var(--font-pacifico)]"
          style={{ fontSize: 24, color: "rgba(255, 255, 255, 0.6)" }}
        >
          Yam Fonts
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {fontCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2
              className="font-semibold text-white/50 uppercase tracking-wide mb-2 px-2"
              style={{ fontSize: 13 }}
            >
              {category.name}
            </h2>
            <ul className="ml-2 border-l border-white/10">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id} className="relative">
                  <button
                    onClick={() => onSelectSubcategory(subcategory)}
                    onMouseEnter={() => onHoverSubcategory(subcategory)}
                    onMouseLeave={() => onHoverSubcategory(null)}
                    className={`w-full text-left pl-3 pr-2 py-0.5 rounded-r transition-colors cursor-pointer ${
                      selectedSubcategory?.id === subcategory.id
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                    style={{ fontSize: 15 }}
                  >
                    {subcategory.name}
                  </button>
                  {hasCheckedFonts && (
                    <button
                      onClick={() =>
                        onMoveFonts(category.name, subcategory.name)
                      }
                      className="absolute -right-3 top-0 bottom-0 px-2 flex items-center text-white/50 hover:text-white bg-[#382d1f] hover:bg-[#3d3022] rounded transition-colors cursor-pointer"
                      title={`Move ${checkedFontNames.length} font${checkedFontNames.length > 1 ? "s" : ""} to ${subcategory.name}`}
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-auto px-4 py-3 border-t border-white/10">
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
  );
}
