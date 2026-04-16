"use client"

import { useState, useEffect } from "react"
import { X, Gift, CheckCircle2, Loader2, Instagram, Trophy, Gamepad2, Ticket, Check, Wallet } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
// Cambiamos el import a la ruleta
import { BotaRoulette } from "./arcade/bota-roulette"

interface LoyaltyWalletProps {
  isOpen: boolean
  onClose: () => void
}

export function LoyaltyWallet({ isOpen, onClose }: LoyaltyWalletProps) {
  const [view, setView] = useState<'login' | 'verify' | 'card' | 'decision' | 'roulette'>('login')
  const [points, setPoints] = useState(0)
  const [usuarioIg, setUsuarioIg] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [hasClickedInstagram, setHasClickedInstagram] = useState(false)

  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxglhcx_4-m8GXWBawpdymV9Vo5QtSzdYnmq4042JE_pV4m1IaHVyzTO9YkFPEfyazvdQ/exec"

  useEffect(() => {
    if (isOpen) {
      const savedUser = localStorage.getItem("botaNaUsername")
      if (savedUser) {
        setUsuarioIg(savedUser)
        fetchUserData(savedUser)
      }
    }
  }, [isOpen])

  const fetchUserData = async (username: string) => {
    setIsLoading(true)
    const cleanUser = username.trim().toLowerCase().replace("@", "")
    try {
      let { data, error } = await supabase.from('clientes_leales').select('*').eq('usuario_ig', cleanUser).single()
      if (error && error.code === 'PGRST116') {
        const { data: newUser } = await supabase.from('clientes_leales').insert([{ usuario_ig: cleanUser, puntos: 0, is_verified: false }]).select().single()
        data = newUser
      }
      if (data) {
        setPoints(data.puntos); setIsVerified(data.is_verified); localStorage.setItem("botaNaUsername", cleanUser)
        setView(data.is_verified ? 'card' : 'verify')
      }
    } catch (err) { setStatusMsg({ text: "Error de conexión", type: "error" }) } finally { setIsLoading(false) }
  }

  const handleValidateCode = async () => {
    const cleanCode = inputCode.trim().toUpperCase()
    if (!cleanCode) return
    setIsLoading(true)
    setStatusMsg({ text: "Verificando...", type: "loading" })

    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: cleanCode, usuario: usuarioIg }),
        redirect: "follow"
      })
      const result = await response.json()
      if (result.success) { setStatusMsg({ text: "", type: "" }); setView('decision') } 
      else { setStatusMsg({ text: result.message, type: "error" }) }
    } catch (error) { setStatusMsg({ text: "Error de red", type: "error" }) } finally { setIsLoading(false) }
  }

  const handleSecurePoint = async () => {
    setIsLoading(true)
    const { error } = await supabase.from('clientes_leales').update({ puntos: points + 1 }).eq('usuario_ig', usuarioIg)
    if (!error) { setPoints(prev => prev + 1); setInputCode(""); setView('card'); setStatusMsg({ text: "¡Punto asegurado!", type: "success" }) }
    setIsLoading(false)
  }

  const handleRouletteFinish = async (prize: any) => {
    // IMPORTANTE: Aquí el código ya se usó (se validó antes). 
    // Solo sumamos punto si cayó en "1 Punto".
    if (prize.label === "1 Punto") {
      const { error } = await supabase.from('clientes_leales').update({ puntos: points + 1 }).eq('usuario_ig', usuarioIg)
      if (!error) setPoints(prev => prev + 1)
    }

    if (prize.label === "Nada") {
      alert("❌ Mala suerte, no ganaste nada esta vez.")
    } else {
      alert(`🎉 ¡GANASTE: ${prize.label}! \nMuestra este mensaje a Saúl o Aranza para canjearlo.`)
    }

    setInputCode("")
    setView('card')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={onClose} />
      
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl">
        {/* HEADER LIMPIO */}
        <div className="bg-zinc-900 p-6 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[oklch(0.55_0.15_45)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">BotaCard</span>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 hover:bg-white/10 transition-all"><X className="h-4 w-4" /></button>
        </div>

        <div className="h-[520px] p-8 flex flex-col justify-center overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">

            {view === 'login' && (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Acceso</h2>
                <input type="text" placeholder="@tu_usuario_ig" value={usuarioIg} onChange={(e) => setUsuarioIg(e.target.value)} className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 text-center text-white font-bold outline-none" />
                <button onClick={() => fetchUserData(usuarioIg)} disabled={isLoading} className="w-full rounded-2xl bg-white py-4 font-black text-black">ENTRAR</button>
              </motion.div>
            )}

            {view === 'card' && (
              <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">@{usuarioIg}</p>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tarjeta de Lealtad</h3>
                </div>
                <div className="grid grid-cols-5 gap-3 bg-white/5 p-4 rounded-3xl border border-white/5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-full flex items-center justify-center transition-all duration-700 ${i < points ? "bg-[oklch(0.55_0.15_45)]" : "bg-zinc-900 border border-white/10"}`}>
                      {i < points ? <Check className="h-4 w-4 text-white stroke-[4px]" /> : <span className="text-[9px] font-bold text-zinc-800">{i + 1}</span>}
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4">
                  <input type="text" placeholder="CÓDIGO DE COMPRA" value={inputCode} onChange={(e) => setInputCode(e.target.value.toUpperCase())} className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 text-center text-sm font-bold text-white outline-none" />
                  <button onClick={handleValidateCode} disabled={isLoading || points >= 10} className="w-full rounded-2xl bg-white py-4 font-black text-black shadow-xl uppercase">CANJEAR</button>
                  {statusMsg.text && <p className="text-center text-[10px] font-bold uppercase text-red-500">{statusMsg.text}</p>}
                </div>
              </motion.div>
            )}

            {view === 'decision' && (
              <motion.div key="decision" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter italic">¿Te la <span className="text-[oklch(0.55_0.15_45)]">juegas</span>?</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Elige tu camino. Solo tienes una oportunidad.</p>
                </div>
                <div className="grid gap-4">
                  <button onClick={handleSecurePoint} className="flex items-center justify-between p-6 bg-zinc-900 rounded-[2rem] border border-white/5 text-left group">
                    <div><h4 className="text-white font-black uppercase italic">Punto Seguro</h4><p className="text-[9px] text-zinc-600 font-bold">+1 PUNTO A TU TARJETA</p></div>
                    <Trophy className="h-8 w-8 text-zinc-800 group-hover:text-white" />
                  </button>
                  <button onClick={() => setView('roulette')} className="flex items-center justify-between p-6 bg-white rounded-[2rem] text-left group overflow-hidden relative">
                    <div className="relative z-10"><h4 className="text-black font-black uppercase italic">Ruleta de la Suerte</h4><p className="text-[9px] text-zinc-400 font-bold uppercase">Gana snacks gratis o descuentos</p></div>
                    <Gamepad2 className="h-8 w-8 text-black/10 group-hover:text-black relative z-10" />
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'roulette' && (
              <motion.div key="roulette" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BotaRoulette onFinish={handleRouletteFinish} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
        <div className="p-4 bg-black text-center border-t border-white/5 opacity-40">
           <p className="text-[8px] font-black uppercase tracking-[0.5em]">BOTA-NA Industrial Snacks</p>
        </div>
      </motion.div>
    </div>
  )
}
