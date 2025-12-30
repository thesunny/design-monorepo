"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { EnrichedCategory, EnrichedSubcategory } from "../data/types";

type CategorySidebarProps = {
  fontCategories: EnrichedCategory[];
  selectedSubcategory: EnrichedSubcategory | null;
  onSelectSubcategory: (subcategory: EnrichedSubcategory) => void;
  onHoverSubcategory: (subcategory: EnrichedSubcategory | null) => void;
};

export function CategorySidebar({
  fontCategories,
  selectedSubcategory,
  onSelectSubcategory,
  onHoverSubcategory,
}: CategorySidebarProps) {
  return (
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
                    onClick={() => onSelectSubcategory(subcategory)}
                    onMouseEnter={() => onHoverSubcategory(subcategory)}
                    onMouseLeave={() => onHoverSubcategory(null)}
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
  );
}
