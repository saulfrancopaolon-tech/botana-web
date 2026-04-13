"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Instagram, Wallet, Check, Gift, Ticket } from "lucide-react"

export function LoyaltyWallet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState(1) // 1: Registro/IG, 2: Puntos y Canje
  const [instagram, setInstagram] = useState("")
  const [purchaseCode, setPurchaseCode] = useState("")
  
  // Tu lógica original de puntos (ejemplo con 3 puntos)
  const [points, setPoints] = useState(3)

  const handleApplyCode = () => {
    // Aquí va tu lógica de validación de códigos (ej. el que le das con su compra)
    if (purchaseCode.length > 0) {
      console.log("Validando código:", purchaseCode)
      // setPoints(prev => prev + 1)
      setPurchaseCode("")
    }
  }

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
            {/* HEADER FIJO */}
            <div className="bg-[oklch(0.55_0.15_45)] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">BotaCard</span>
              </div>
              <button onClick={onClose} className="rounded-full bg-black/20 p-2 hover:bg-black/40 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CONTENEDOR CON TAMAÑO FIJO (Para evitar el salto de tamaño) */}
            <div className="h-[500px] p-8 flex flex-col justify-center no-scrollbar overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* PANTALLA 1: IG Y REGISTRO */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">¡Bienvenido al Club!</h3>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                        SÍGUENOS EN INSTAGRAM <br /> Y ACTIVA TU TARJETA
                      </p>
                    </div>

                    <a 
                      href="https://instagram.com/bota.na.mx" 
                      target="_blank" 
                      className="flex items-center justify-center gap-3 w-full rounded-2xl bg-zinc-800 border border-white/5 py-4 text-sm font-black text-white hover:bg-zinc-700 transition-all"
                    >
                      <Instagram className="h-5 w-5 text-[oklch(0.55_0.15_45)]" />
                      @BOTA.NA.MX
                    </a>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Tu usuario</label>
                        <input
                          type="text"
                          placeholder="@tu_usuario"
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-[oklch(0.55_0.15_45)]"
                        />
                      </div>
                      <button
                        onClick={() => instagram && setStep(2)}
                        className="w-full rounded-2xl bg-white py-4 text-sm font-black uppercase text-black active:scale-95 transition-transform"
                      >
                        Ingresar
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* PANTALLA 2: PUNTOS E INPUT DE CÓDIGO (RESTAURADA) */
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <p className="text-[10px] font-black text-[oklch(0.55_0.15_45)] uppercase tracking-widest">@{instagram}</p>
                      <h3 className="text-lg font-black text-white uppercase italic">Tus Puntos</h3>
                    </div>

                    {/* LOS 10 ESPACIOS */}
                    <div className="grid grid-cols-5 gap-3 bg-white/5 p-4 rounded-3xl border border-white/5">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            i < points 
                              ? "bg-[oklch(0.55_0.15_45)] border-[oklch(0.55_0.15_45)]" 
                              : "bg-black/20 border-white/10"
                          }`}
                        >
                          {i < points ? (
                            <Check className="h-4 w-4 text-white stroke-[4px]" />
                          ) : i === 9 ? (
                            <Gift className="h-4 w-4 text-zinc-700" />
                          ) : (
                            <span className="text-[9px] font-black text-zinc-800">{i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* EL INPUT DEL CÓDIGO QUE TE HABÍA QUITADO */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <input
                          type="text"
                          placeholder="Ingresa código de compra"
                          value={purchaseCode}
                          onChange={(e) => setPurchaseCode(e.target.value)}
                          className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[oklch(0.55_0.15_45)] placeholder:text-zinc-700"
                        />
                      </div>
                      <button
                        onClick={handleApplyCode}
                        className="w-full rounded-2xl bg-[oklch(0.55_0.15_45)] py-4 text-sm font-black uppercase text-white shadow-lg shadow-orange-950/20 active:scale-95 transition-transform"
                      >
                        Canjear Código
                      </button>
                    </div>

                    <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-[0.2em] px-4">
                      Al llegar a 10 puntos obtienes un producto gratis. <br />
                      <span className="text-zinc-500 underline mt-2 inline-block cursor-pointer" onClick={() => setStep(1)}>Cerrar Sesión</span>
                    </p>
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
