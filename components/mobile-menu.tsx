"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, LayoutGrid, Store, Info, HelpCircle, Instagram, MessageCircle } from "lucide-react"
import { useEffect } from "react"

export function MobileMenu({ isOpen, onClose, onCategorySelect, onOpenWholesale, categories }: any) {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset" };
  }, [isOpen]);

  const scrollToId = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md" />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-y-0 left-0 z-[120] w-[300px] bg-zinc-950 border-r border-white/5 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-10 text-white font-black uppercase italic tracking-tighter text-xl">
              <span>BOTA-NA</span>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-grow space-y-8 no-scrollbar overflow-y-auto text-zinc-400 font-bold">
              <div className="space-y-2">
                <p className="text-[10px] tracking-[.3em] uppercase text-zinc-600 mb-4">Categorías</p>
                {categories.map((cat: string) => (
                  <button key={cat} onClick={() => { onCategorySelect(cat); onClose(); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all">
                    <LayoutGrid className="h-4 w-4 text-[oklch(0.55_0.15_45)]" /> {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => { onOpenWholesale(); onClose(); }} className="w-full flex items-center gap-3 p-4 bg-[oklch(0.55_0.15_45)] text-white rounded-2xl font-black italic shadow-lg">
                <Store className="h-5 w-5" /> MAYOREO
              </button>
              <div className="space-y-2">
                <button onClick={() => scrollToId('about')} className="flex w-full items-center gap-3 px-4 py-3"><Info className="h-4 w-4" /> Quiénes Somos</button>
                <button onClick={() => scrollToId('faq')} className="flex w-full items-center gap-3 px-4 py-3"><HelpCircle className="h-4 w-4" /> Preguntas Frecuentes</button>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-between">
              <div className="flex gap-4">
                <a href="https://instagram.com/bota.na.mx" target="_blank" className="hover:text-white transition-colors"><Instagram /></a>
                <a href="https://wa.me/524774950232" target="_blank" className="hover:text-white transition-colors"><MessageCircle /></a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
