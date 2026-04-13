"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, LayoutGrid, Store, Info, HelpCircle, Instagram, MessageCircle, ChevronRight } from "lucide-react"
import { useEffect } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (cat: string) => void
  onOpenWholesale: () => void
  categories: string[]
}

export function MobileMenu({ isOpen, onClose, onCategorySelect, onOpenWholesale, categories }: MobileMenuProps) {
  
  // BLOQUEO DE SCROLL TRASERO: Evita que la página principal se mueva al usar el menú
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const scrollToId = (id: string) => {
    onClose()
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 350)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Fondo oscuro) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
          />

          {/* Menú Deslizable */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[120] w-[300px] bg-zinc-950 border-r border-white/5 p-6 flex flex-col shadow-2xl"
          >
            {/* Header del Menú */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-lg bg-[oklch(0.55_0.15_45)] flex items-center justify-center font-black text-white italic">B</div>
                 <span className="text-xl font-black tracking-tighter text-white uppercase italic">Bota-na</span>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cuerpo del Menú con Scroll Invisible */}
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-8 pr-2">
              
              {/* Categorías */}
              <div>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Menú de Snacks</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { onCategorySelect(cat); onClose(); }}
                      className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:bg-white/5 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <LayoutGrid className="h-4 w-4 text-[oklch(0.55_0.15_45)]/50 group-hover:text-[oklch(0.55_0.15_45)]" />
                        {cat}
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección de Negocio */}
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => { onOpenWholesale(); onClose(); }}
                  className="flex w-full items-center gap-3 px-4 py-4 rounded-2xl bg-[oklch(0.55_0.15_45)] text-white shadow-lg shadow-orange-950/20 active:scale-95 transition-all text-sm font-black italic"
                >
                  <Store className="h-5 w-5" />
                  MAYOREO Y DISTRIBUIDOR
                </button>
              </div>

              {/* Información Adicional */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">Sobre nosotros</p>
                <div className="space-y-1">
                  <button onClick={() => scrollToId('about')} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                    <Info className="h-4 w-4" /> Quiénes Somos
                  </button>
                  <button onClick={() => scrollToId('faq')} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                    <HelpCircle className="h-4 w-4" /> Preguntas Frecuentes
                  </button>
                </div>
              </div>
            </div>

            {/* Redes Sociales en el Footer */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center justify-between text-zinc-600">
                <div className="flex gap-4">
                  <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="https://wa.me/524774950232" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">León, Gto. 2026</span>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
