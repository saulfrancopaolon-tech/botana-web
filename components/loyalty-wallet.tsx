"use client"

import { useState, useEffect } from "react"
import { X, Gift, CheckCircle2, AlertCircle, Loader2, Instagram, RefreshCcw } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface LoyaltyWalletProps {
  isOpen: boolean
  onClose: () => void
}

export function LoyaltyWallet({ isOpen, onClose }: LoyaltyWalletProps) {
  const [points, setPoints] = useState(0)
  const [usuarioIg, setUsuarioIg] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inputCode, setInputCode] = useState("")
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [hasClickedInstagram, setHasClickedInstagram] = useState(false)

  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxglhcx_4-m8GXWBawpdymV9Vo5QtSzdYnmq4042JE_pV4m1IaHVyzTO9YkFPEfyazvdQ/exec"

  // Recuperar sesión al abrir
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
      let { data, error } = await supabase
        .from('clientes_leales')
        .select('*')
        .eq('usuario_ig', cleanUser)
        .single()

      if (error && error.code === 'PGRST116') {
        const { data: newUser } = await supabase
          .from('clientes_leales')
          .insert([{ usuario_ig: cleanUser, puntos: 0, is_verified: false }])
          .select()
          .single()
        data = newUser
      }

      if (data) {
        setPoints(data.puntos)
        setIsVerified(data.is_verified)
        setIsLoggedIn(true)
        localStorage.setItem("botaNaUsername", cleanUser)
      }
    } catch (err) {
      setStatusMsg({ text: "Error de conexión", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (usuarioIg.length < 3) return
    fetchUserData(usuarioIg)
  }

  const handleActivate = async () => {
    if (!hasClickedInstagram) return
    setIsLoading(true)
    const { error } = await supabase
      .from('clientes_leales')
      .update({ is_verified: true })
      .eq('usuario_ig', usuarioIg)

    if (!error) setIsVerified(true)
    setIsLoading(false)
  }

  const handleResetCard = async () => {
    if (window.confirm("¿Reiniciar tarjeta?")) {
      const { error } = await supabase
        .from('clientes_leales')
        .update({ puntos: 0 })
        .eq('usuario_ig', usuarioIg)
      if (!error) {
        setPoints(0)
        setStatusMsg({ text: "Reiniciada con éxito", type: "success" })
      }
    }
  }

  const handleAddPoint = async () => {
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

      if (result.success) {
        const newPoints = points + 1
        const { error } = await supabase
          .from('clientes_leales')
          .update({ puntos: newPoints })
          .eq('usuario_ig', usuarioIg)

        if (!error) {
          setPoints(newPoints)
          setStatusMsg({ text: result.message, type: "success" })
          setInputCode("")
        }
      } else {
        setStatusMsg({ text: result.message, type: "error" })
      }
    } catch (error) {
      setStatusMsg({ text: "Error de red", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm rounded-[2rem] bg-zinc-900 border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="absolute right-4 top-4 z-[120] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
        >
          <X className="h-6 w-6" />
        </button>

        {!isLoggedIn ? (
          <div className="py-8 text-center animate-in fade-in duration-300">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-xl">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Tu BOTA-Card</h2>
            <p className="mt-2 text-sm text-zinc-400">Ingresa tu usuario de Instagram para comenzar.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <input
                type="text"
                placeholder="@tu_usuario"
                value={usuarioIg}
                onChange={(e) => setUsuarioIg(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button type="submit" disabled={isLoading || usuarioIg.length < 3} className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-purple-700 py-4 font-black text-white active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "ENTRAR"}
              </button>
            </form>
          </div>
        ) : !isVerified ? (
          <div className="flex flex-col items-center py-8 text-center animate-in fade-in duration-500">
             <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-xl">
               <Instagram className="h-8 w-8 text-white" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-tight">Activa tu BOTA-Card</h2>
             <p className="mt-2 text-sm text-zinc-400">Hola @{usuarioIg}, síguenos para activar tus puntos.</p>
             <div className="mt-8 w-full space-y-3">
               <a href="https://instagram.com/bota.na.mx" target="_blank" rel="noopener noreferrer" onClick={() => setHasClickedInstagram(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-4 text-[10px] font-black text-white">
                 1. IR A INSTAGRAM @BOTA.NA.MX
               </a>
               <button onClick={handleActivate} disabled={!hasClickedInstagram || isLoading} className={`w-full rounded-xl py-4 text-[10px] font-black text-white shadow-lg ${hasClickedInstagram ? "bg-gradient-to-r from-orange-500 to-red-600" : "bg-zinc-800 opacity-30"}`}>
                 2. YA LOS SIGO, ACTIVAR
               </button>
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-red-600 mb-4 shadow-lg">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Mi BOTA-Card</h2>
              <p className="mt-1 text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">USUARIO: @{usuarioIg}</p>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 ${i < points ? "bg-gradient-to-tr from-orange-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)] scale-105" : "bg-white/5 border border-white/10"}`}>
                  {i < points ? <CheckCircle2 className="h-5 w-5 text-white" /> : <span className="text-[10px] font-bold text-white/20">{i + 1}</span>}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-black/40 p-4 border border-white/5">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center leading-none">Código de Compra</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="BOTA-XXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  disabled={isLoading || points >= 10}
                  className="w-full rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white focus:outline-none uppercase"
                />
                <button onClick={handleAddPoint} disabled={isLoading || points >= 10 || !inputCode} className="flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 text-xs font-black transition-transform active:scale-95 disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "CANJEAR"}
                </button>
              </div>

              {statusMsg.text && (
                <p className={`mt-3 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${statusMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {statusMsg.text}
                </p>
              )}

              {points >= 10 && (
                <div className="mt-4 flex flex-col items-center space-y-3">
                  <p className="text-center text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">¡TARJETA LLENA!</p>
                  <a href={`https://wa.me/524774950232?text=Hola!%20Llené%20mi%20BOTA-Card.%20Mi%20Usuario%20es:%20@${usuarioIg}.%20Quiero%20mi%20premio!`} target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-green-600 py-3 text-center text-[11px] font-black text-white shadow-lg transition-transform active:scale-95">
                    WHATSAPP PREMIO
                  </a>
                  <button onClick={handleResetCard} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-300 uppercase hover:bg-white/10 hover:text-white transition-all active:scale-95">
                    <RefreshCcw className="h-3.5 w-3.5" /> REINICIAR TARJETA
                  </button>
                </div>
              )}
            </div>
            
            <button 
              type="button"
              onClick={() => { localStorage.removeItem("botaNaUsername"); setIsLoggedIn(false); setUsuarioIg(""); }}
              className="mt-6 w-full text-[9px] text-zinc-600 uppercase font-bold hover:text-zinc-400 transition-colors"
            >
              Cerrar Sesión / Cambiar Usuario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
