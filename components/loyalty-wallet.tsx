"use client"

import { useState, useEffect } from "react"
import { X, Gift, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

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

  // Tu API conectada a Google Sheets
  const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxglhcx_4-m8GXWBawpdymV9Vo5QtSzdYnmq4042JE_pV4m1IaHVyzTO9YkFPEfyazvdQ/exec"

  useEffect(() => {
    if (isOpen) {
      // 1. Crear un ID único para el celular de este cliente si no tiene uno
      let savedUserId = localStorage.getItem("botaNaUserId")
      if (!savedUserId) {
        // Genera un ID estilo "USER-X8A9B2"
        savedUserId = "USER-" + Math.random().toString(36).substr(2, 6).toUpperCase()
        localStorage.setItem("botaNaUserId", savedUserId)
      }
      setUserId(savedUserId)

      // 2. Cargar los puntos que ya tiene guardados en su celular
      const savedPoints = localStorage.getItem("botaNaPoints")
      setPoints(savedPoints ? parseInt(savedPoints) : 0)

      setStatusMsg({ text: "", type: "" })
      setInputCode("")
    }
  }, [isOpen])

  const handleAddPoint = async () => {
    const cleanCode = inputCode.trim().toUpperCase()
    if (!cleanCode) return

    setIsLoading(true)
    setStatusMsg({ text: "Verificando código...", type: "loading" })

    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: "POST",
        // Usamos text/plain para que los navegadores móviles no bloqueen la conexión (CORS)
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ codigo: cleanCode, usuario: userId }),
        // 🔴 ESTA LÍNEA ES LA QUE ARREGLA EL ERROR EN CELULARES 🔴
        redirect: "follow"
      })

      const result = await response.json()

      if (result.success) {
        // ✅ EL EXCEL DIJO QUE EL CÓDIGO ES VÁLIDO Y NUEVO
        const newPoints = points + 1
        setPoints(newPoints)
        localStorage.setItem("botaNaPoints", newPoints.toString())
        setStatusMsg({ text: result.message, type: "success" })
        setInputCode("")
      } else {
        // ❌ EL EXCEL DIJO QUE NO EXISTE O YA SE USÓ
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-200">

        <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-red-600 shadow-lg mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Mi BOTA-Card</h2>
          <p className="mt-1 text-xs text-zinc-500 font-mono">ID Cliente: {userId}</p>
        </div>

        {/* Círculos de Puntos */}
        <div className="mt-8 grid grid-cols-5 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${i < points
                  ? "bg-gradient-to-tr from-orange-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-110"
                  : "bg-white/5 border border-white/10"
                }`}>
                {i < points ? <CheckCircle2 className="h-6 w-6 text-white" /> : <span className="text-xs font-bold text-white/20">{i + 1}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Input para el Código */}
        <div className="mt-10 rounded-2xl bg-black/40 p-4 border border-white/5">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500 text-center">Ingresar Código de Compra</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. BOTA-A1B2"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              disabled={isLoading || points >= 10}
              className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 uppercase disabled:opacity-50"
            />
            <button
              onClick={handleAddPoint}
              disabled={isLoading || points >= 10 || !inputCode}
              className="flex w-24 items-center justify-center rounded-xl bg-white text-black px-4 py-2 text-sm font-bold transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Canjear"}
            </button>
          </div>

          {/* Mensajes de Estado */}
          {statusMsg.text && (
            <p className={`mt-3 flex items-center justify-center gap-1 text-xs font-semibold ${statusMsg.type === 'success' ? 'text-green-400' :
                statusMsg.type === 'loading' ? 'text-zinc-400' : 'text-red-400'
              }`}>
              {statusMsg.type === 'error' && <AlertCircle className="h-3 w-3" />}
              {statusMsg.text}
            </p>
          )}

          {/* Botón de Premio (Solo aparece al llegar a 10) */}
          {points >= 10 && (
            <div className="mt-4 flex flex-col items-center animate-in fade-in duration-500">
              <p className="mb-3 text-center text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                ¡FELICIDADES!
              </p>
              <a
                // IMPORTANTE: Recuerda cambiar los "0000000000" por tu número de WhatsApp real cuando estés listo
                href={`https://wa.me/520000000000?text=Hola!%20Acabo%20de%20llenar%20mi%20tarjeta%20BOTA-NA.%20Mi%20ID%20de%20cliente%20es%20${userId}.%20Quiero%20mi%20botana%20gratis!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-gradient-to-tr from-green-500 to-emerald-600 px-4 py-3 text-center text-sm font-black text-white shadow-lg transition-transform active:scale-95"
              >
                PEDIR PREMIO AL WHATSAPP
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}