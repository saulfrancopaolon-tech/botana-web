"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Instagram, Star, Wallet } from "lucide-react"

export function LoyaltyWallet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [instagram, setInstagram] = useState("")
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 shadow-2xl"
          >
            {/* Header simple */}
            <div className="bg-[oklch(0.55_0.15_45)] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">BotaCard</span>
              </div>
              <button onClick={onClose} className="rounded-full bg-black/20 p-2 hover:bg-black/40">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CUERPO CON ALTURA FIJA: Para que no salte el tamaño */}
            <div className="h-[320px] p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!isRegistered ? (
                  <motion.div
                    key="reg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-black text-white uppercase italic">Registro</h3>
                      <p className="text-sm text-zinc-500 mt-2">Ingresa tu Instagram para ver tus puntos.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="relative">
                        <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="@usuario"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[oklch(0.55_0.15_45)]"
                        />
                      </div>
                      <button
                        onClick={() => instagram && setIsRegistered(true)}
                        className="w-full rounded-2xl bg-white py-4 font-black uppercase text-black active:scale-95 transition-transform"
                      >
                        Consultar
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pts"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    <Star className="h-12 w-12 text-[oklch(0.55_0.15_45)] fill-[oklch(0.55_0.15_45)]" />
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Puntos Totales</p>
                      <h3 className="text-6xl font-black text-white italic tracking-tighter">050</h3>
                      <p className="text-xs text-[oklch(0.55_0.15_45)] font-bold mt-2">{instagram}</p>
                    </div>
                    <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Próximo canje: 100 pts</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
