"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Flame, Star, AlertTriangle, ShoppingBag, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-context"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductModal({ isOpen, onClose, product }: any) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  if (!product) return null

  const isAgotado = product.inStock === false
  const numericPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, "")) || 0

  const handleAdd = () => {
    setIsAdding(true)
    addToCart({ id: product.id.toString(), name: product.name, price: numericPrice })

    // Tiempo de la animación antes de cerrar el modal
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 800)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[450px] overflow-hidden rounded-[3rem] border border-white/10 p-0 shadow-2xl backdrop-blur-2xl bg-black/40 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${isAdding ? "scale-110 blur-sm" : "hover:scale-105"}`}
          />
          
          <AnimatePresence>
            {isAdding && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center gap-2 text-white">
                  <CheckCircle2 className="h-16 w-16 text-[oklch(0.55_0.15_45)]" />
                  <span className="font-black italic tracking-tighter text-xl uppercase italic">¡Agregado!</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={onClose} className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-lg transition-transform hover:scale-110 active:scale-90">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-8 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black tracking-tight text-white">{product.name}</DialogTitle>
            <div className="flex gap-1.5 shrink-0">
              {product.isPopular && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
              {product.isSpicy && <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />}
            </div>
          </div>

          <p className="mt-1 text-3xl font-light tracking-tighter text-[oklch(0.55_0.15_45)]">{product.price}</p>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400 font-medium">{product.description}</p>

          <div className="mt-9 relative">
            {!isAgotado ? (
              <div className="relative">
                <Button
                  disabled={isAdding}
                  className={`h-14 w-full rounded-full font-black text-lg transition-all duration-300 flex items-center gap-2 shadow-lg
                    ${isAdding ? "bg-zinc-800 text-zinc-500 scale-95" : "bg-[oklch(0.55_0.15_45)] text-white hover:shadow-[0_10px_20px_rgba(194,65,12,0.3)] active:scale-95"}`}
                  onClick={handleAdd}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAdding ? "Procesando..." : "Agregar a mi Pedido"}
                </Button>

                {/* PARTÍCULA QUE VUELA AL ICONO INFERIOR DERECHO */}
                <AnimatePresence>
                  {isAdding && (
                    <motion.div
                      initial={{ x: "0%", y: 0, opacity: 1, scale: 1 }}
                      animate={{ 
                        x: "150%",   // Se mueve a la derecha
                        y: 800,      // Baja hacia el botón de abajo
                        opacity: 0,
                        scale: 0.5
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-0 left-1/2 h-10 w-10 rounded-full bg-[oklch(0.55_0.15_45)] z-50 pointer-events-none shadow-[0_0_20px_oklch(0.55_0.15_45)]"
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-zinc-800/50 p-6 text-center backdrop-blur-sm">
                <AlertTriangle className="h-12 w-12 text-zinc-600" />
                <h4 className="text-xl font-black text-zinc-300">¡Agotado!</h4>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
