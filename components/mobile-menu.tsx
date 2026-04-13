"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, LayoutGrid, Store, Info, HelpCircle, ChevronDown, Instagram, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (cat: string) => void
  onOpenWholesale: () => void
  categories: string[]
}

export function MobileMenu({ isOpen, onClose, onCategorySelect, onOpenWholesale, categories }: MobileMenuProps) {
  const [isProductsOpen, setIsProductsOpen] = useState(true)

  // --- SOLUCIÓN AL PUNTO 2: BLOQUEO DE SCROLL TRASERO ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden" // Congela la página principal
    } else {
      document.body.style.overflow = "unset" // La libera al cerrar
    }
    return () => { document.body.style.overflow = "unset" } // Limpieza por seguridad
  }, [isOpen])

  const scrollToId = (id: string) => {
    onClose()
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 300)
  }

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
                <span className="text-xl font-black tracking-tighter text-white uppercase italic">Bota-na</span>
                <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-zinc-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* --- SOLUCIÓN AL PUNTO 1: no-scrollbar APLICADO --- */}
              <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
                <div>
                  <button onClick={() => setIsProductsOpen(!isProductsOpen)} className="flex w-full items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">
                    Categorías <ChevronDown className={`h-3 w-3 transition-transform ${isProductsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isProductsOpen && (
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => { onCategorySelect(cat); onClose(); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                          <LayoutGrid className="h-4 w-4 text-orange-500/50" /> {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button onClick={() => { onOpenWholesale(); onClose(); }} className="flex w-full items-center gap-3 px-4 py-4 rounded-2xl bg-orange-500 text-white font-black italic shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-sm">
                    <Store className="h-5 w-5" /> MAYOREO / DISTRIBUIDOR
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Información</p>
                  <div className="space-y-1">
                    <button onClick={() => scrollToId('about')} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all text-left">
                      <Info className="h-4 w-4" /> Quiénes Somos
                    </button>
                    <button onClick={() => scrollToId('faq')} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all text-left">
                      <HelpCircle className="h-4 w-4" /> Preguntas Frecuentes
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://wa.me/524774950232?text=Hola!%20Vengo%20de%20la%20web%20BOTA-NA." target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-700 tracking-widest">Leon, Gto.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
