"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Flame, Star, AlertTriangle, ShoppingBag } from "lucide-react"
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
    
    // Agregamos al carrito
    addToCart({ 
      id: product.id.toString(), 
      name: product.name, 
      price: numericPrice 
    })

    // Duración de la animación de "vuelo/cierre" antes de desmontar el modal
    setTimeout(() => {
      onClose()
      // Resetear el estado después de que el modal se cierre completamente
      setTimeout(() => setIsAdding(false), 300)
    }, 600)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        /* Eliminamos las animaciones por defecto de DialogContent para usar las nuestras */
        className="max-w-[90vw] sm:max-w-[450px] overflow-hidden rounded-[3rem] border border-white/10 p-0 shadow-2xl backdrop-blur-2xl bg-black/40 max-h-[90vh] no-scrollbar border-none"
      >
        {/* CONTENEDOR ANIMADO: Este es el que hace el efecto de "irse al icono" */}
        <motion.div
          animate={isAdding ? {
            scale: 0,
            x: 200,      // Se mueve a la derecha
            y: 500,      // Baja al icono
            opacity: 0,
            filter: "blur(10px)"
          } : {
            scale: 1,
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)"
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.32, 0, 0.67, 0] // Ease-in para efecto de succión
          }}
          className="flex flex-col w-full h-full"
        >
          {/* IMAGEN */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            
            <button 
              onClick={onClose} 
              className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-lg active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* CUERPO DEL MODAL */}
          <div className="flex flex-col p-8 pt-6 bg-zinc-950/80">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                {product.name}
              </DialogTitle>
              <div className="flex gap-1.5 shrink-0">
                {product.isPopular && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
                {product.isSpicy && <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />}
              </div>
            </div>

            <p className="mt-1 text-3xl font-light tracking-tighter text-[oklch(0.55_0.15_45)]">
              {product.price}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-zinc-400 font-medium">
              {product.description}
            </p>

            <div className="mt-9">
              {!isAgotado ? (
                <Button
                  disabled={isAdding}
                  className="h-14 w-full rounded-full font-black text-lg bg-[oklch(0.55_0.15_45)] text-white hover:shadow-[0_10px_20px_rgba(194,65,12,0.3)] active:scale-95 transition-all flex items-center gap-2"
                  onClick={handleAdd}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAdding ? "Agregando..." : "Agregar a mi Pedido"}
                </Button>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-zinc-800/50 p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-zinc-600" />
                  <h4 className="text-xl font-black text-zinc-300">¡Agotado!</h4>
                </div>
              )}
            </div>

            <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 text-white">
              BOTA-NA • León, Gto.
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
