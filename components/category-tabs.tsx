"use client"

import { motion } from "framer-motion"
import { useRef, useEffect } from "react"

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Lógica de Auto-centrado: Mueve el scroll para que la categoría activa siempre esté a la vista
  useEffect(() => {
    const activeElement = document.getElementById(`tab-${activeCategory}`)
    if (activeElement && scrollRef.current) {
      const scrollContainer = scrollRef.current
      const scrollLeft = activeElement.offsetLeft - scrollContainer.offsetWidth / 2 + activeElement.offsetWidth / 2
      scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeCategory])

  return (
    <div className="relative w-full px-4 overflow-hidden">
      {/* Contenedor con Scroll Horizontal Invisible */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar items-center py-2 transition-all"
      >
        <div className="flex bg-zinc-900/40 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
          {categories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                id={`tab-${category}`}
                onClick={() => onCategoryChange(category)}
                className={`relative flex-shrink-0 px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {/* Indicador de categoría activa (La "Pastilla" Cobre) */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 rounded-full bg-[oklch(0.55_0.15_45)] shadow-[0_4px_12px_rgba(194,65,12,0.3)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10">{category}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Gradientes sutiles a los lados (Opcional, para look industrial) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent sm:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent sm:hidden" />
    </div>
  )
}
