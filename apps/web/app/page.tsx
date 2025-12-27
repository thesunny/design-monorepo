import { fontCategories } from "../data/fontCategories";

export default function Page() {
  return (
    <main className="flex h-screen">
      {/* Column 1: Category Browser */}
      <div className="w-64 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4">
        {fontCategories.map((category) => (
          <div key={category.id} className="mb-6">
            <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
              {category.name}
            </h2>
            <ul className="space-y-1">
              {category.subcategories.map((subcategory) => (
                <li key={subcategory.id}>
                  <button className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    {subcategory.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Column 2: Font List */}
      <div className="flex-1 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto p-4">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Select a category to view fonts
        </p>
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
