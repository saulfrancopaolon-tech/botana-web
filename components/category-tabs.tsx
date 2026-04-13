"use client"
import { motion } from "framer-motion"
import { useRef, useEffect } from "react"

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = document.getElementById(`tab-${activeCategory}`);
    if (activeElement && scrollRef.current) {
      const scrollLeft = activeElement.offsetLeft - scrollRef.current.offsetWidth / 2 + activeElement.offsetWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <div className="relative w-full px-4 overflow-hidden">
      <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar items-center py-2">
        <div className="flex bg-zinc-900/50 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
          {categories.map((cat: string) => (
            <button
              key={cat}
              id={`tab-${cat}`}
              onClick={() => onCategoryChange(cat)}
              className={`relative px-6 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${
                activeCategory === cat ? "text-white" : "text-zinc-500"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-[oklch(0.55_0.15_45)] shadow-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
