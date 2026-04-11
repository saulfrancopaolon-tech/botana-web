"use client"

import { useState, useEffect } from "react"
import { X, Gift, CheckCircle2, AlertCircle, Loader2, Instagram, RefreshCcw } from "lucide-react"

interface LoyaltyWalletProps {
  isOpen: boolean
  onClose: () => void
}

export function LoyaltyWallet({ isOpen, onClose }: LoyaltyWalletProps) {
  const [points, setPoints] = useState(0)
  const [userId, setUserId] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)

  const [isVerified, setIsVerified] = useState(false)
  const [hasClickedInstagram, setHasClickedInstagram] = useState(false)

  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxglhcx_4-m8GXWBawpdymV9Vo5QtSzdYnmq4042JE_pV4m1IaHVyzTO9YkFPEfyazvdQ/exec"

  useEffect(() => {
    if (isOpen) {
      const savedVerified = localStorage.getItem("botaNaVerified")
      if (savedVerified === "true") setIsVerified(true)

      let savedUserId = localStorage.getItem("botaNaUserId")
      if (!savedUserId) {
        savedUserId = "USER-" + Math.random().toString(36).substr(2, 6).toUpperCase()
        localStorage.setItem("botaNaUserId", savedUserId)
      }
      setUserId(savedUserId)

      const savedPoints = localStorage.getItem("botaNaPoints")
      setPoints(savedPoints ? parseInt(savedPoints) : 0)

      setStatusMsg({ text: "", type: "" })
      setInputCode("")
    }
  }, [isOpen])

  const handleActivate = () => {
    if (!hasClickedInstagram) return
    setIsVerified(true)
    localStorage.setItem("botaNaVerified", "true")
  }

  // --- FUNCIÓN PARA REINICIAR LA TARJETA ---
  const handleResetCard = () => {
    if (window.confirm("¿Ya enviaste tu mensaje de WhatsApp para pedir tu premio? Tu tarjeta volverá a cero para empezar de nuevo.")) {
      setPoints(0)
      localStorage.setItem("botaNaPoints", "0")
      setStatusMsg({ text: "", type: "" })
      setInputCode("")
    }
  }

  const handleAddPoint = async () => {
    const cleanCode = inputCode.trim().toUpperCase()
    if (!cleanCode) return

    setIsLoading(true)
    setStatusMsg({ text: "Verificando código...", type: "loading" })

    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: cleanCode, usuario: userId }),
        redirect: "follow"
      })

      const result = await response.json()

      if (result.success) {
        const newPoints = points + 1
        setPoints(newPoints)
        localStorage.setItem("botaNaPoints", newPoints.toString())
        setStatusMsg({ text: result.message, type: "success" })
        setInputCode("")
      } else {
        setStatusMsg({ text: result.message, type: "error" })
      }
    } catch (error) {
      setStatusMsg({ text: "Error de conexión. Intenta de nuevo.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-90"
        >
          <X className="h-6 w-6" />
        </button>

        {!isVerified ? (
          <div className="flex flex-col items-center py-8 text-center animate-in fade-in duration-500">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-xl">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Activa tu BOTA-Card</h2>
            <p className="mt-2 text-sm text-zinc-400 px-4">
              Síguenos para activar la botacard y empezar a sumar puntos.
            </p>

            <div className="mt-8 w-full space-y-3">
              <a
                href="https://instagram.com/bota.na.mx"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setHasClickedInstagram(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-4 text-[10px] font-black text-white transition-all hover:bg-white/10 active:scale-95"
              >
                1. IR A INSTAGRAM @BOTA.NA.MX
              </a>

              <button
                onClick={handleActivate}
                disabled={!hasClickedInstagram}
                className={`w-full rounded-xl py-4 text-[10px] font-black text-white shadow-lg transition-all active:scale-95 ${hasClickedInstagram
                    ? "bg-gradient-to-r from-orange-500 to-red-600 opacity-100"
                    : "bg-zinc-800 opacity-30 cursor-not-allowed"
                  }`}
              >
                2. YA LOS SIGO, ACTIVAR
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-red-600 shadow-lg mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Mi BOTA-Card</h2>
              <p className="mt-1 text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none">ID: {userId}</p>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 ${i < points
                  ? "bg-gradient-to-tr from-orange-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.4)] scale-105"
                  : "bg-white/5 border border-white/10"
                  }`}>
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
                  className="w-full rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 uppercase disabled:opacity-50"
                />
                <button
                  onClick={handleAddPoint}
                  disabled={isLoading || points >= 10 || !inputCode}
                  className="flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 text-xs font-black transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "CANJEAR"}
                </button>
              </div>

              {statusMsg.text && (
                <p className={`mt-3 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${statusMsg.type === 'success' ? 'text-green-400' :
                  statusMsg.type === 'loading' ? 'text-zinc-400' : 'text-red-400'
                  }`}>
                  {statusMsg.type === 'error' && <AlertCircle className="h-3 w-3" />}
                  {statusMsg.text}
                </p>
              )}

              {/* ACCIONES DE TARJETA LLENA */}
              {points >= 10 && (
                <div className="mt-4 flex flex-col items-center animate-in slide-in-from-bottom-2 space-y-3">
                  <p className="text-center text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">¡TARJETA LLENA!</p>

                  {/* BOTÓN WHATSAPP CON TU NÚMERO */}
                  <a
                    href={`https://wa.me/524774950232?text=Hola!%20Llené%20mi%20BOTA-Card.%20Mi%20ID%20es:%20${userId}.%20Quiero%20mi%20premio!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl bg-green-600 py-3 text-center text-[11px] font-black text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    WHATSAPP PREMIO
                  </a>

                  {/* BOTÓN PARA REINICIAR LA TARJETA */}
                  <button
                    onClick={handleResetCard}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-300 uppercase hover:bg-white/10 hover:text-white transition-all active:scale-95"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    REINICIAR TARJETA
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
