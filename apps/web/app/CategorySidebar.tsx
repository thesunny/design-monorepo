"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconSearch, IconX } from "@tabler/icons-react";
import type { Category, Subcategory } from "../data/types";

type CategorySidebarProps = {
  fontCategories: Category[];
  selectedSubcategory: Subcategory | null;
  onSelectSubcategory: (subcategory: Subcategory) => void;
  onHoverSubcategory: (subcategory: Subcategory | null) => void;
  checkedFontNames: string[];
  onMoveFonts: (categoryName: string, subcategoryName: string) => void;
  onRemoveFonts: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  isSearchPending: boolean;
  isMac: boolean;
};

export function CategorySidebar({
  fontCategories,
  selectedSubcategory,
  onSelectSubcategory,
  onHoverSubcategory,
  checkedFontNames,
  onMoveFonts,
  onRemoveFonts,
  searchInput,
  onSearchChange,
  onSearchClear,
  searchInputRef,
  isSearchPending,
  isMac,
}: CategorySidebarProps) {
  const hasCheckedFonts = checkedFontNames.length > 0;
  return (
    <div className="w-40 bg-[#321938] flex flex-col">
      <div className="flex items-center px-4 pt-2 pb-2">
        <span
          className="font-[family-name:var(--font-pacifico)]"
          style={{ fontSize: 25, color: "rgba(255, 255, 255, 0.7)" }}
        >
          Yam Fonts
        </span>
      </div>
      <div className="px-3 pb-3 pt-1">
        <div className="relative">
          <IconSearch
            size={14}
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${isSearchPending ? "text-white/30" : "text-white/50"}`}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            style={{ fontSize: 13 }}
            className={`w-full pl-7 pr-8 py-1.5 bg-white/10 rounded text-white placeholder-white/50 focus:outline-none focus:border-white/40 ${isSearchPending ? "opacity-70" : ""}`}
          />
          {searchInput ? (
            <button
              onClick={onSearchClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 cursor-pointer"
            >
              <IconX size={14} />
            </button>
          ) : (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-white/40 pointer-events-none">
              {isMac ? "⌘K" : "^K"}
            </span>
          )}
        </div>
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
                  {hasCheckedFonts &&
                    !subcategory.id.endsWith("-top-50") &&
                    !subcategory.id.includes("-more-") && (
                      <button
                        onClick={() =>
                          selectedSubcategory?.id === subcategory.id
                            ? onRemoveFonts()
                            : onMoveFonts(category.name, subcategory.name)
                        }
                        className="absolute -right-3 top-0 bottom-0 px-2 flex items-center text-white/50 hover:text-white bg-[#412346] hover:bg-[#522653] rounded transition-colors cursor-pointer"
                        title={
                          selectedSubcategory?.id === subcategory.id
                            ? `Remove ${checkedFontNames.length} font${checkedFontNames.length > 1 ? "s" : ""} from ${subcategory.name}`
                            : `Move ${checkedFontNames.length} font${checkedFontNames.length > 1 ? "s" : ""} to ${subcategory.name}`
                        }
                      >
                        {selectedSubcategory?.id === subcategory.id ? (
                          <ArrowRight size={16} />
                        ) : (
                          <ArrowLeft size={16} />
                        )}
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
