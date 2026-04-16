"use client"
import { useState } from "react"
import { motion } from "framer-motion"

const PRIZES = [
  { id: 0, label: "Nada", color: "#18181b", weight: 60 },
  { id: 1, label: "10% OFF", color: "#27272a", weight: 20 },
  { id: 2, label: "15% OFF", color: "#3f3f46", weight: 12 },
  { id: 3, label: "1 Punto", color: "#52525b", weight: 6 },
  { id: 4, label: "PRODUCTO GRATIS", color: "oklch(0.55 0.15 45)", weight: 2 },
]

export function BotaRoulette({ onFinish }: { onFinish: (prize: any) => void }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const spin = () => {
    if (isSpinning) return
    setIsSpinning(true)

    // Lógica de probabilidades pesadas
    const random = Math.random() * 100
    let cumulativeWeight = 0
    let selectedPrize = PRIZES[0]

    for (const prize of PRIZES) {
      cumulativeWeight += prize.weight
      if (random < cumulativeWeight) {
        selectedPrize = prize
        break
      }
    }

    // Calcular rotación (360 / 5 premios = 72 grados por sección)
    const prizeIndex = PRIZES.findIndex(p => p.id === selectedPrize.id)
    const extraSpins = 5 * 360 // 5 vueltas completas
    const sectorAngle = 360 / PRIZES.length
    const finalRotation = rotation + extraSpins + (360 - (prizeIndex * sectorAngle))

    setRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      onFinish(selectedPrize)
    }, 4000)
  }

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative h-64 w-64">
        {/* Marcador superior (La flecha) */}
        <div className="absolute -top-2 left-1/2 z-20 -translate-x-1/2">
          <div className="h-6 w-4 bg-white clip-path-triangle" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
        </div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0, 0.1, 1] }}
          className="h-full w-full rounded-full border-4 border-white/10 overflow-hidden relative shadow-2xl"
          style={{ background: 'conic-gradient(from 0deg, #18181b 0deg 72deg, #27272a 72deg 144deg, #3f3f46 144deg 216deg, #52525b 216deg 288deg, oklch(0.55 0.15 45) 288deg 360deg)' }}
        >
          {/* Textos de los premios */}
          {PRIZES.map((prize, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 h-full w-full text-[8px] font-black text-white uppercase tracking-tighter origin-top-left"
              style={{ transform: `rotate(${i * 72 + 36}deg) translate(-50%, -100%)` }}
            >
              <span className="inline-block pt-8 pl-4" style={{ transform: 'rotate(90deg)' }}>{prize.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`w-full rounded-2xl py-4 font-black uppercase tracking-widest transition-all ${isSpinning ? "bg-zinc-800 text-zinc-600" : "bg-white text-black active:scale-95"}`}
      >
        {isSpinning ? "La suerte está echada..." : "GIRAR RULETA"}
      </button>
    </div>
  )
}
