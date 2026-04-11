"use client"

import { useState, useEffect } from "react"
import { X, Gift, CheckCircle2, AlertCircle, Loader2, Instagram, RefreshCcw, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase" // Importamos el túnel

interface LoyaltyWalletProps {
  isOpen: boolean
  onClose: () => void
}

export function LoyaltyWallet({ isOpen, onClose }: LoyaltyWalletProps) {
  const [points, setPoints] = useState(0)
  const [telefono, setTelefono] = useState("") // Usaremos teléfono en vez de ID aleatorio
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inputCode, setInputCode] = useState("")
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [hasClickedInstagram, setHasClickedInstagram] = useState(false)

  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxglhcx_4-m8GXWBawpdymV9Vo5QtSzdYnmq4042JE_pV4m1IaHVyzTO9YkFPEfyazvdQ/exec"

  // 1. Intentar recuperar sesión al abrir
  useEffect(() => {
    if (isOpen) {
      const savedPhone = localStorage.getItem("botaNaPhone")
      if (savedPhone) {
        setTelefono(savedPhone)
        fetchUserData(savedPhone)
      }
    }
  }, [isOpen])

  // 2. Función para buscar o crear usuario en la DB
  const fetchUserData = async (phone: string) => {
    setIsLoading(true)
    try {
      // Buscamos al cliente
      let { data, error } = await supabase
        .from('clientes_leales')
        .select('*')
        .eq('telefono', phone)
        .single()

      if (error && error.code === 'PGRST116') {
        // Si no existe, lo creamos
        const { data: newUser, error: createError } = await supabase
          .from('clientes_leales')
          .insert([{ telefono: phone, puntos: 0, is_verified: false }])
          .select()
          .single()
        
        if (newUser) {
          data = newUser
        }
      }

      if (data) {
        setPoints(data.puntos)
        setIsVerified(data.is_verified)
        setIsLoggedIn(true)
        localStorage.setItem("botaNaPhone", phone)
      }
    } catch (err) {
      setStatusMsg({ text: "Error al conectar con la base de datos", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (telefono.length < 10) {
      setStatusMsg({ text: "Ingresa un número válido", type: "error" })
      return
    }
    fetchUserData(telefono)
  }

  const handleActivate = async () => {
    if (!hasClickedInstagram) return
    setIsLoading(true)
    
    const { error } = await supabase
      .from('clientes_leales')
      .update({ is_verified: true })
      .eq('telefono', telefono)

    if (!error) {
      setIsVerified(true)
    }
    setIsLoading(false)
  }

  const handleResetCard = async () => {
    if (window.confirm("¿Reiniciar tarjeta a cero?")) {
      const { error } = await supabase
        .from('clientes_leales')
        .update({ puntos: 0 })
        .eq('telefono', telefono)

      if (!error) {
        setPoints(0)
        setStatusMsg({ text: "Tarjeta reiniciada", type: "success" })
      }
    }
  }

  const handleAddPoint = async () => {
    const cleanCode = inputCode.trim().toUpperCase()
    if (!cleanCode) return

    setIsLoading(true)
    setStatusMsg({ text: "Verificando código...", type: "loading" })

    try {
      // Seguimos usando tu Google Script para validar el código
      const response = await fetch(GOOGLE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: cleanCode, usuario: telefono }),
        redirect: "follow"
      })

      const result = await response.json()

      if (result.success) {
        const newPoints = points + 1
        
        // ACTUALIZAMOS EN SUPABASE
        const { error } = await supabase
          .from('clientes_leales')
          .update({ puntos: newPoints })
          .eq('telefono', telefono)

        if (!error) {
          setPoints(newPoints)
          setStatusMsg({ text: result.message, type: "success" })
          setInputCode("")
        }
      } else {
        setStatusMsg({ text: result.message, type: "error" })
      }
    } catch (error) {
      setStatusMsg({ text: "Error de conexión.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </button>

        {/* PASO 0: LOGIN CON TELÉFONO */}
        {!isLoggedIn ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-orange-500">
              <Phone className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-white uppercase">Tus Puntos BOTA-NA</h2>
            <p className="mt-2 text-sm text-zinc-400">Ingresa tu celular para recuperar o crear tu tarjeta.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <input
                type="tel"
                placeholder="Tu número (10 dígitos)"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-orange-500 py-4 font-black text-white active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "CONTINUAR"}
              </button>
            </form>
          </div>
        ) : !isVerified ? (
          /* PASO 1: VERIFICACIÓN INSTAGRAM (Igual que antes pero guarda en DB) */
          <div className="flex flex-col items-center py-8 text-center animate-in fade-in">
             <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600">
               <Instagram className="h-8 w-8 text-white" />
             </div>
             <h2 className="text-xl font-black text-white uppercase">Activa tu BOTA-Card</h2>
             <p className="mt-2 text-sm text-zinc-400">Casi listo, {telefono}. Síguenos para activar tus puntos.</p>
             <div className="mt-8 w-full space-y-3">
               <a href="https://instagram.com/bota.na.mx" target="_blank" onClick={() => setHasClickedInstagram(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-4 text-[10px] font-black text-white">
                 1. IR A INSTAGRAM @BOTA.NA.MX
               </a>
               <button onClick={handleActivate} disabled={!hasClickedInstagram || isLoading} className={`w-full rounded-xl py-4 text-[10px] font-black text-white ${hasClickedInstagram ? "bg-orange-500" : "bg-zinc-800 opacity-30"}`}>
                 2. YA LOS SIGO, ACTIVAR
               </button>
             </div>
          </div>
        ) : (
          /* PASO 2: LA TARJETA (Ahora lee de la DB) */
          <div className="animate-in fade-in duration-500">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white">Mi BOTA-Card</h2>
              <p className="mt-1 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">TEL: {telefono}</p>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex h-11 w-11 items-center justify-center rounded-full border ${i < points ? "bg-orange-500 border-orange-400 shadow-lg scale-105" : "bg-white/5 border-white/10"}`}>
                  {i < points ? <CheckCircle2 className="h-5 w-5 text-white" /> : <span className="text-[10px] font-bold text-white/20">{i + 1}</span>}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-black/40 p-4 border border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="BOTA-XXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  disabled={isLoading || points >= 10}
                  className="w-full rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none uppercase"
                />
                <button onClick={handleAddPoint} disabled={isLoading || points >= 10 || !inputCode} className="rounded-xl bg-white text-black px-4 py-2 text-xs font-black active:scale-95 disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "CANJEAR"}
                </button>
              </div>

              {statusMsg.text && (
                <p className={`mt-3 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${statusMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {statusMsg.text}
                </p>
              )}

              {points >= 10 && (
                <div className="mt-4 flex flex-col space-y-3">
                  <p className="text-center text-[10px] font-black text-orange-500 tracking-[0.3em]">¡TARJETA LLENA!</p>
                  <a href={`https://wa.me/524774950232?text=Llené%20mi%20BOTA-Card.%20Mi%20Tel:%20${telefono}`} target="_blank" className="w-full rounded-xl bg-green-600 py-3 text-center text-[11px] font-black text-white shadow-lg">
                    WHATSAPP PREMIO
                  </a>
                  <button onClick={handleResetCard} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-300">
                    <RefreshCcw className="h-3.5 w-3.5" /> REINICIAR
                  </button>
                </div>
              )}
            </div>
            {/* Botón para cerrar sesión si se equivocó de número */}
            <button 
              onClick={() => { localStorage.removeItem("botaNaPhone"); setIsLoggedIn(false); setTelefono(""); }}
              className="mt-4 w-full text-[9px] text-zinc-600 uppercase font-bold hover:text-zinc-400"
            >
              Cerrar Sesión / Cambiar Número
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
