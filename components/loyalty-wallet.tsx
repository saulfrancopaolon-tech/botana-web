"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Instagram, Wallet, Check, Gift } from "lucide-react"

export function LoyaltyWallet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1) // 1: Registro, 2: Puntos
  const [instagram, setInstagram] = useState("")

  // Simulamos que tiene 3 puntos de 10
  const points = 3 

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
            {/* HEADER DE LA TARJETA */}
            <div className="bg-[oklch(0.55_0.15_45)] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">BotaCard</span>
              </div>
              <button onClick={onClose} className="rounded-full bg-black/20 p-2 hover:bg-black/40 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CUERPO CON ALTURA FIJA (400px para que quepan bien los 10 espacios) */}
            <div className="h-[400px] p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* PASO 1: SEGUIR IG Y REGISTRO */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">¡Activa tu BotaCard!</h3>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Paso 1: Síguenos en Instagram</p>
                    </div>

                    <a 
                      href="https://instagram.com/bota.na.mx" 
                      target="_blank" 
                      className="flex items-center justify-center gap-3 w-full rounded-2xl bg-zinc-800 border border-white/5 py-4 text-sm font-black text-white hover:bg-zinc-700 transition-all"
                    >
                      <Instagram className="h-5 w-5 text-[oklch(0.55_0.15_45)]" />
                      @BOTA.NA.MX
                    </a>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Tu usuario de IG"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 px-4 text-center text-sm font-bold text-white focus:outline-none focus:border-[oklch(0.55_0.15_45)] transition-all"
                      />
                      <button
                        onClick={() => instagram && setStep(2)}
                        className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase text-black active:scale-95 transition-transform shadow-lg"
                      >
                        Ver mis puntos
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* PASO 2: LOS 10 ESPACIOS */
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <p className="text-[10px] font-black text-[oklch(0.55_0.15_45)] uppercase tracking-[0.2em]">@{instagram}</p>
                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Tu Progreso</h3>
                    </div>

                    {/* GRID DE 10 ESPACIOS */}
                    <div className="grid grid-cols-5 gap-3">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            i < points 
                              ? "bg-[oklch(0.55_0.15_45)] border-[oklch(0.55_0.15_45)] shadow-[0_0_10px_rgba(194,65,12,0.4)]" 
                              : "bg-white/5 border-white/10"
                          }`}
                        >
                          {i < points ? (
                            <Check className="h-4 w-4 text-white stroke-[4px]" />
                          ) : i === 9 ? (
                            <Gift className="h-4 w-4 text-zinc-700" />
                          ) : (
                            <span className="text-[10px] font-black text-zinc-700">{i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                        ¡Llega a 10 y obtén <br /> <span className="text-white">un producto gratis!</span>
                      </p>
                    </div>

                    <button 
                      onClick={() => setStep(1)}
                      className="w-full text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer de la tarjeta */}
            <div className="p-4 bg-zinc-800/20 text-center border-t border-white/5">
               <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em]">BOTA-NA Industrial Snacks</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
