"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { ShoppingBag, X, Plus, Minus, Send } from "lucide-react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: { id: string; name: string; price: number }) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  // 🔴 NUEVO ESTADO PARA LA ANIMACIÓN DEL BOTÓN
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })

    // 🔴 HACEMOS QUE EL BOTÓN SALTE DURANTE 300 MILISEGUNDOS
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)

    // (Eliminamos el setIsOpen(true) para que ya no se abra solo)
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const getTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleWhatsAppCheckout = (phone: string, name: string) => {
    if (cart.length === 0) return

    let message = `Hola ${name}! quiero hacer un pedido de BOTA-NA:%0A%0A`
    cart.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} ($${item.price * item.quantity})%0A`
    })
    message += `%0A*Total: $${getTotal()}*%0A%0A¿Dónde nos vemos para la entrega?`

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotal }}>
      {children}

      {isMounted && totalItems > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 ${
            // 🔴 APLICAMOS LA ANIMACIÓN VISUAL AQUÍ
            isAnimating
              ? "scale-125 bg-white text-orange-600 ring-4 ring-orange-500/50"
              : "scale-100 bg-gradient-to-tr from-orange-500 to-red-600 text-white hover:scale-105 active:scale-95"
            }`}
        >
          <div className="relative">
            <ShoppingBag className={`h-6 w-6 transition-colors ${isAnimating ? "text-orange-600" : "text-white"}`} />

            {/* Burbuja del contador */}
            <span className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full font-bold border transition-all duration-300 ${isAnimating
                ? "bg-orange-500 text-white border-white scale-125"
                : "bg-black text-white border-white/20 scale-100 text-[10px]"
              }`}>
              {totalItems}
            </span>
          </div>
        </button>
      )}

      {isMounted && isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 h-full">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                TU PEDIDO
              </h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-50 text-white">
                  <ShoppingBag className="h-12 w-12 mb-4" />
                  <p className="font-bold">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{item.name}</h3>
                        <p className="text-orange-400 font-bold text-sm">${item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-white/70 hover:text-white">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white/70 hover:text-white">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-5 bg-zinc-900">
              <div className="flex justify-between mb-4">
                <span className="text-zinc-400 font-bold">Total a pagar:</span>
                <span className="text-2xl font-black text-white">${getTotal()}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleWhatsAppCheckout("524774950232", "Saúl")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-4 font-black shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Send className="h-5 w-5" />
                  PEDIR A SAÚL
                </button>

                <button
                  onClick={() => handleWhatsAppCheckout("524761004512", "Aranza")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-white px-6 py-4 font-black shadow-lg shadow-[#25D366]/20 transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Send className="h-5 w-5" />
                  PEDIR A ARANZA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}
