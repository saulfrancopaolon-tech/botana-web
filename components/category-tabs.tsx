"use client"

import { cn } from "@/lib/utils"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center gap-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wide transition-all duration-200",
            activeCategory === category
              ? "bg-foreground text-background"
              : "bg-transparent text-muted-foreground ring-1 ring-border hover:bg-secondary hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
