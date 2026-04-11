"use client"

import Image from "next/image"
import { useState } from "react"
import { MapPin, Instagram, Wallet, X, Store } from "lucide-react"
import { LoyaltyWallet } from "./BotaCard"
import { WholesaleModal } from "./WholesaleModal" // Asegúrate de tener este archivo creado

export function MenuHeader() {
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/90 py-4 text-center backdrop-blur-2xl">
        {/* --- CAMBIO AQUÍ: BOTÓN SUPERIOR DE MAYOREO CORREGIDO --- */}
        <div className="absolute top-3 right-5 z-[60]">
          <button
            onClick={() => setIsWholesaleOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] font-black tracking-widest text-zinc-300 hover:bg-white/10 hover:text-orange-400 transition-all active:scale-95 shadow-lg"
          >
            {/* El icono también creció un poquito */}
            <Store className="h-3.5 w-3.5" />
            <span>Distribuidor / Mayoreo</span>
          </button>
        </div>

        <div className="container mx-auto px-4 mt-6"> {/* Subimos mt-4 a mt-6 para dar espacio al nuevo botón */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center transition-transform duration-500 hover:scale-105">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Orange%20and%20White%20Playful%20Food%20Logo%20%28US%20carta%29%20%282%29-1qMpbsYrPr8DZdxCCQEIDgFFo7CTy5.png"
                alt="BOTA-NA Logo"
                width={120}
                height={100}
                className="h-auto w-24 invert sm:w-28"
                priority
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                <MapPin className="h-3 w-3 text-red-500" />
                Leon Gto.
                <span className="mx-1 h-1 w-1 rounded-full bg-zinc-700" />
                Snacks Premium
              </p>

              <div className="flex gap-3">
                <a href="https://instagram.com/bota.na.mx" target="_blank" className="group flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] font-black tracking-widest text-white hover:bg-white/10 transition-all">
                  <Instagram className="h-3.5 w-3.5" />
                  <span>INSTAGRAM</span>
                </a>
                <button onClick={() => setIsWalletOpen(true)} className="group flex items-center gap-2 rounded-full bg-linear-to-tr from-orange-500 to-red-600 px-4 py-2 text-[11px] font-black tracking-widest text-white shadow-lg active:scale-95 transition-all">
                  <Wallet className="h-3.5 w-3.5 text-white" />
                  <span>MI TARJETA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LoyaltyWallet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <WholesaleModal isOpen={isWholesaleOpen} onClose={() => setIsWholesaleOpen(false)} />
    </>
  )
}