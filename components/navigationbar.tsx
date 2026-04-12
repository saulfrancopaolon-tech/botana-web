"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LayoutGrid, Cookie, Candy, Component, ShoppingBag } from "lucide-react"

const categories = [
  { id: "todos", name: "Todos", icon: LayoutGrid },
  { id: "cacahuates", name: "Cacahuates", icon: Component },
  { id: "gomitas", name: "Gomitas", icon: Candy },
  { id: "papas", name: "Papas", icon: Cookie },
]

export function BottomNav({ onCategoryChange }: { onCategoryChange: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[80] flex justify-center px-6 sm:hidden">
      <div className="relative flex h-16 w-full max-w-md items-center justify-around rounded-[2rem] bg-zinc-900 border border-white/5 shadow-2xl">
        
        {/* El Círculo Flotante que se mueve */}
        <motion.div
          className="absolute top-[-50%] flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          animate={{ x: `${(activeTab - (categories.length - 1) / 2) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* El icono activo dentro del círculo */}
          {categories.map((cat, i) => i === activeTab && (
            <cat.icon key={cat.id} className="h-6 w-6 text-white" />
          ))}
        </motion.div>

        {/* Los Iconos del Menú */}
        {categories.map((category, index) => {
          const Icon = category.icon
          const isActive = index === activeTab

          return (
            <button
              key={category.id}
              onClick={() => {
                setActiveTab(index)
                onCategoryChange(category.id)
              }}
              className="relative z-10 flex h-full w-full items-center justify-center"
            >
              <motion.div
                animate={{ 
                  y: isActive ? -100 : 0, // Esconde el icono original cuando está activo
                  opacity: isActive ? 0 : 1 
                }}
              >
                <Icon className="h-5 w-5 text-zinc-500" />
              </motion.div>
              
              <span className={`absolute bottom-2 text-[8px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-orange-500' : 'text-transparent'}`}>
                {category.name}
              </span>
            </button>
          )
        })}

        {/* SVG para el efecto de curva (Corte en el menú) */}
        <svg className="absolute hidden" width="0" height="0">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}
