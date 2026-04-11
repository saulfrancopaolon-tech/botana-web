"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Flame, Star, AlertTriangle, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-context"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    description: string
    price: string
    image: string
    isPopular: boolean
    isSpicy: boolean
    inStock?: boolean
  } | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { addToCart } = useCart()

  if (!product) return null

  const isAgotado = product.inStock === false
  const numericPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, "")) || 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-[450px] overflow-hidden rounded-[3rem] border border-white/10 p-0 shadow-2xl backdrop-blur-2xl transition-all duration-500 animate-in slide-in-from-bottom-10 flex flex-col bg-white/30 dark:bg-black/30 max-h-[90vh] overflow-y-auto custom-scrollbar">

        <div className="sticky top-0 z-20 aspect-square w-full shrink-0 overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-lg transition-transform hover:scale-110 active:scale-90"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-8 pt-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              {product.name}
            </DialogTitle>
            <div className="flex gap-1.5 shrink-0">
              {product.isPopular && <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />}
              {product.isSpicy && <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />}
            </div>
          </div>

          <p className="mt-1 text-3xl font-light tracking-tighter text-primary">
            {product.price}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground/90 font-medium">
            {product.description}
          </p>

          <div className="mt-9 flex flex-col gap-3">
            {!isAgotado ? (
              <>
                <Button
                  className="h-14 w-full rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white font-black text-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2"
                  onClick={() => {
                    addToCart({
                      id: product.id.toString(),
                      name: product.name,
                      price: numericPrice
                    })
                    onClose()
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Agregar a mi Pedido
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-zinc-200/50 p-6 text-center dark:bg-zinc-800/50 backdrop-blur-sm">
                <AlertTriangle className="h-12 w-12 text-zinc-500 dark:text-zinc-600" />
                <h4 className="text-xl font-black text-zinc-700 dark:text-zinc-300">
                  ¡Agotado!
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Lo sentimos. Este producto no está disponible por el momento.
                </p>
                <Button disabled className="mt-2 h-12 w-full rounded-full bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500">
                  No disponible
                </Button>
              </div>
            )}
          </div>

          <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
            BOTA-NA • León, Gto.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}