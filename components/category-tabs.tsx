"use client"

import { motion } from "framer-motion"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full bg-white/5 p-1.5 border border-white/5 backdrop-blur-md">
        {categories.map((category) => {
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`relative px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {/* Este es el fondo naranja que se desliza */}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 shadow-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* El texto va arriba del fondo */}
              <span className="relative z-10">{category}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
