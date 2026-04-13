"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Flame, Star, AlertTriangle, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-context"
import { useState } from "react"
import { motion } from "framer-motion"

export function ProductModal({ isOpen, onClose, product }: any) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  if (!product) return null

  const numericPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, "")) || 0

  const handleAdd = () => {
    setIsAdding(true)
    addToCart({ id: product.id.toString(), name: product.name, price: numericPrice })

    setTimeout(() => {
      onClose()
      setTimeout(() => setIsAdding(false), 200)
    }, 600) // Un poco más de tiempo para apreciar el efecto
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* IMPORTANTE: He quitado la "X" manual. 
        Si la "X" del sistema sigue estorbando, añade 'hide-close' a className 
        y la manejamos por CSS, pero por ahora solo eliminé la duplicada.
      */}
      <DialogContent className="max-w-[90vw] sm:max-w-[450px] overflow-hidden rounded-[3rem] border-none p-0 shadow-2xl backdrop-blur-2xl bg-black/40 max-h-[90vh] no-scrollbar [&>button]:text-white [&>button]:bg-black/20 [&>button]:rounded-full [&>button]:p-2 [&>button]:top-5 [&>button]:right-5">
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isAdding ? {
            /* ANIMACIÓN DE SUCCIÓN MEJORADA */
            scale: [1, 1.05, 0],     // Primero crece (pop) y luego desaparece
            x: [0, -10, 150],       // Un pequeño movimiento opuesto antes de salir disparado
            y: [0, -10, 600],       // Sube un poco y cae al icono
            rotate: [0, -10, 25],   // Giro dinámico
            opacity: [1, 1, 0],
            filter: ["blur(0px)", "blur(0px)", "blur(12px)"],
          } : {
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            filter: "blur(0px)"
          }}
          transition={{ 
            duration: 0.6, 
            times: [0, 0.2, 1], // El 'pop' ocurre en el primer 20% del tiempo
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "bottom right" }}
          className="flex flex-col w-full h-full"
        >
          {/* IMAGEN (Sin botón X manual) */}
          <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>

          {/* CUERPO */}
          <div className="flex flex-col p-8 pt-6 bg-zinc-950/80">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black tracking-tight text-white">{product.name}</DialogTitle>
              <div className="flex gap-1.5 shrink-0">
                {product.isPopular && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
                {product.isSpicy && <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />}
              </div>
            </div>
            
            <p className="mt-1 text-3xl font-light tracking-tighter text-[oklch(0.55_0.15_45)]">{product.price}</p>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400 font-medium">{product.description}</p>

            <div className="mt-9">
              {product.inStock !== false ? (
                <Button
                  disabled={isAdding}
                  className="h-14 w-full rounded-full font-black text-lg bg-[oklch(0.55_0.15_45)] text-white active:scale-95 transition-all flex items-center gap-2"
                  onClick={handleAdd}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAdding ? "¡A la bolsa!" : "Agregar a mi Pedido"}
                </Button>
              ) : (
                <div className="text-center p-4 bg-zinc-900 rounded-2xl text-zinc-500 font-bold">Agotado</div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
