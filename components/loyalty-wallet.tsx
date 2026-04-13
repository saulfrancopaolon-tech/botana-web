"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trophy, Instagram, Star, ChevronRight, Wallet } from "lucide-react"

interface LoyaltyWalletProps {
  isOpen: boolean
  onClose: () => void
}

export function LoyaltyWallet({ isOpen, onClose }: LoyaltyWalletProps) {
  const [instagram, setInstagram] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  // Bloqueo de scroll al abrir la cartera
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (instagram.trim()) {
      setIsRegistered(true)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Tarjeta BotaCard */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl"
          >
            {/* Header de la Tarjeta */}
            <div className="bg-[oklch(0.55_0.15_45)] p-6 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">BotaCard</span>
                </div>
                <button onClick={onClose} className="rounded-full bg-black/20 p-2 hover:bg-black/40 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4 relative z-10">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Member</h2>
                <p className="text-[10px] font-bold opacity-80 tracking-widest uppercase">Loyalty Program 2026</p>
              </div>

              {/* Decoración Industrial de fondo */}
              <div className="absolute -right-4 -bottom-8 opacity-10">
                 <Trophy className="h-32 w-32 rotate-12" />
              </div>
            </div>

            {/* CONTENEDOR CON ALTURA FIJA (Para evitar el salto visual) */}
            <div className="p-8 min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!isRegistered ? (
                  /* ESTADO A: REGISTRO IG */
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6 w-full"
                  >
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-black text-white uppercase italic">¡Únete al Club!</h3>
                      <p className="text-sm text-zinc-500 font-medium">Ingresa tu usuario de Instagram para empezar a acumular puntos.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="relative">
                        <Instagram className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Tu usuario de IG"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[oklch(0.55_0.15_45)] focus:outline-none transition-all"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Obtener mi tarjeta
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  /* ESTADO B: VISUALIZACIÓN DE PUNTOS */
                  <motion.div
                    key="points"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col items-center text-center space-y-6 w-full"
                  >
                    <div className="relative">
                       <div className="h-20 w-20 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                          <Star className="h-10 w-10 text-[oklch(0.55_0.15_45)] fill-[oklch(0.55_0.15_45)]" />
                       </div>
                       <div className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-md">
                         LVL 1
                       </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Puntos acumulados</p>
                      <h3 className="text-5xl font-black text-white italic tracking-tighter">050</h3>
                      <p className="text-[10px] text-[oklch(0.55_0.15_45)] font-black uppercase tracking-[0.2em]">@{instagram}</p>
                    </div>

                    <div className="w-full bg-zinc-800/50 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Próxima recompensa:</p>
                      <p className="text-xs text-white font-black mt-1">100 pts = 1 Papas Locas Gratis</p>
                      <div className="mt-3 h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "50%" }}
                          className="h-full bg-[oklch(0.55_0.15_45)]" 
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer de la Tarjeta */}
            <div className="bg-zinc-800/30 p-4 border-t border-white/5 text-center">
               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Válido solo en León, Gto.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
