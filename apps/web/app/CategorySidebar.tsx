"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Category, Subcategory } from "../data/types";

type CategorySidebarProps = {
  fontCategories: Category[];
  selectedSubcategory: Subcategory | null;
  onSelectSubcategory: (subcategory: Subcategory) => void;
  onHoverSubcategory: (subcategory: Subcategory | null) => void;
};

export function CategorySidebar({
  fontCategories,
  selectedSubcategory,
  onSelectSubcategory,
  onHoverSubcategory,
}: CategorySidebarProps) {
  return (
    <div className="w-40 flex-shrink-0 bg-[#2f251a] flex flex-col">
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
              className="font-semibold text-white/50 uppercase tracking-wide mb-2 px-2"
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
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/70 hover:bg-white/5"
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
