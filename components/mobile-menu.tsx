"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Menu, LayoutGrid, Info, Store, HelpCircle, Instagram, Phone } from "lucide-react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (cat: string) => void
  onOpenWholesale: () => void
}

export function MobileMenu({ isOpen, onClose, onCategorySelect, onOpenWholesale }: MobileMenuProps) {
  const menuItems = [
    { name: "Cacahuates", icon: LayoutGrid },
    { name: "Chips", icon: LayoutGrid },
    { name: "Papas", icon: LayoutGrid },
    { name: "Gomitas", icon: LayoutGrid },
    { name: "Bebidas y más", icon: LayoutGrid },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro detrás */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />

          {/* Menú Lateral */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[120] w-[280px] bg-zinc-950 border-r border-white/5 p-6 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header del Menú */}
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-black tracking-tighter text-white uppercase">Bota-na</span>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-zinc-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Secciones del Menú */}
              <div className="space-y-8 overflow-y-auto no-scrollbar flex-grow">
                
                {/* GRUPO 1: PRODUCTOS */}
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Productos</p>
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => { onCategorySelect(item.name); onClose(); }}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
                      >
                        <item.icon className="h-4 w-4 text-orange-500" />
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GRUPO 2: NEGOCIO */}
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Negocio</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => { onOpenWholesale(); onClose(); }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm font-bold text-orange-500"
                    >
                      <Store className="h-4 w-4" />
                      Mayoreo / Distribuidor
                    </button>
                  </div>
                </div>

                {/* GRUPO 3: NOSOTROS */}
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Información</p>
                  <div className="space-y-2">
                    <a href="#about" onClick={onClose} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                      <Info className="h-4 w-4" />
                      Quiénes somos
                    </a>
                    <a href="#about" onClick={onClose} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                      <HelpCircle className="h-4 w-4" />
                      Preguntas Frecuentes
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer del Menú */}
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-4">
                  <Instagram className="h-5 w-5 text-zinc-500" />
                  <Phone className="h-5 w-5 text-zinc-500" />
                </div>
                <p className="text-[8px] font-black text-zinc-700 uppercase">León, Gto. 2026</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
