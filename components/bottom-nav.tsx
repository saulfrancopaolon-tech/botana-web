"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LayoutGrid, Cookie, Candy, Zap, ShoppingBag } from "lucide-react"

// Definimos tus categorías reales
const categories = [
  { id: "todos", name: "Todos", icon: LayoutGrid },
  { id: "cacahuates", name: "Cacahuates", icon: Zap }, // Zap por la energía/picante
  { id: "gomitas", name: "Gomitas", icon: Candy },
  { id: "papas", name: "Papas", icon: Cookie },
]

export function BottomNav({ onCategoryChange }: { onCategoryChange: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <nav className="fixed bottom-6 left-1/2 z-[90] w-[90%] max-w-sm -translate-x-1/2 sm:hidden">
      <div className="relative flex h-16 items-center justify-around rounded-[2rem] bg-zinc-900 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* El Círculo Flotante (Indicador) */}
        <motion.div
          layoutId="activeTab"
          className="absolute -top-6 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 shadow-[0_10px_20px_rgba(249,115,22,0.4)] border-4 border-zinc-950"
          animate={{ x: `${(activeTab - 1.5) * 100}%` }} // Ajuste fino del movimiento
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Icono que aparece dentro del círculo naranja */}
          <div className="text-white">
            {activeTab === 0 && <LayoutGrid className="h-6 w-6" />}
            {activeTab === 1 && <Zap className="h-6 w-6" />}
            {activeTab === 2 && <Candy className="h-6 w-6" />}
            {activeTab === 3 && <Cookie className="h-6 w-6" />}
          </div>
        </motion.div>

        {/* Botones del Menú */}
        {categories.map((cat, index) => {
          const Icon = cat.icon
          const isActive = index === activeTab

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(index)
                onCategoryChange(cat.id)
              }}
              className="relative flex h-full w-full flex-col items-center justify-center transition-colors"
            >
              <div className={`transition-all duration-300 ${isActive ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}>
                <Icon className="h-5 w-5 text-zinc-500" />
              </div>
              <span className={`absolute bottom-2 text-[7px] font-black uppercase tracking-widest transition-opacity ${isActive ? "opacity-100 text-orange-500" : "opacity-0"}`}>
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
