"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, LayoutGrid, Store, Info, HelpCircle, ChevronDown, Instagram, Phone, Home } from "lucide-react"
import { useState } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (cat: string) => void
  onOpenWholesale: () => void
  categories: string[]
}

export function MobileMenu({ isOpen, onClose, onCategorySelect, onOpenWholesale, categories }: MobileMenuProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[120] w-[300px] bg-zinc-950 border-r border-white/5 p-6 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white italic">B</div>
                   <span className="text-xl font-black tracking-tighter text-white uppercase italic">Bota-na</span>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-zinc-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
                {/* SECCIÓN PRODUCTOS CON DESPLEGABLE */}
                <div>
                  <button 
                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                    className="flex w-full items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4"
                  >
                    Categorías
                    <ChevronDown className={`h-3 w-3 transition-transform ${isProductsOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isProductsOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 overflow-hidden"
                      >
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { onCategorySelect(cat); onClose(); }}
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <LayoutGrid className="h-4 w-4 text-orange-500/50" />
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* SECCIÓN NEGOCIO */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Negocio</p>
                  <button 
                    onClick={() => { onOpenWholesale(); onClose(); }}
                    className="flex w-full items-center gap-3 px-4 py-4 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm font-black italic"
                  >
                    <Store className="h-5 w-5" />
                    MAYOREO Y DISTRIBUIDOR
                  </button>
                </div>

                {/* SECCIÓN INFO */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Ayuda</p>
                  <div className="space-y-1">
                    <a href="#about" onClick={onClose} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                      <Info className="h-4 w-4" />
                      Quiénes Somos
                    </a>
                    <a href="#about" onClick={onClose} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                      <HelpCircle className="h-4 w-4" />
                      Preguntas Frecuentes
                    </a>
                  </div>
                </div>
              </div>

              {/* FOOTER MENU */}
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-zinc-600">
                  <div className="flex gap-4">
                    <Instagram className="h-5 w-5 hover:text-white transition-colors" />
                    <Phone className="h-5 w-5 hover:text-white transition-colors" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">León, Gto.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
