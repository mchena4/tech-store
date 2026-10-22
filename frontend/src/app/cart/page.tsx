"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getProductImageUrl } from "@/lib/images";


export default function CartPage() {
  const { cart, loading, fetchCart, updateQuantity, removeItem } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && !cart) {
    return (
      <div className="py-20 text-center text-gunmetal/50">
        Cargando carrito...
      </div>
    );
  }

  const items = cart?.cartitems || [];
  const total = cart?.cart_total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gunmetal/60 hover:text-deep-teal mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Seguir Comprando
      </Link>

      <h1 className="font-heading text-3xl font-extrabold text-gunmetal mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-deep-teal" /> Mi Carrito de Compras
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gunmetal/10 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-ocean-mist/15 text-deep-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold text-gunmetal mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gunmetal/60 text-sm mb-6">
            Explora nuestro catálogo y agrega los mejores productos
            tecnológicos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gunmetal/10 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 bg-ocean-mist/5 rounded-xl overflow-hidden shrink-0 border border-gunmetal/10">
                    {item.product?.image ? (
                      <img
                        src={getProductImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-xs text-gunmetal/40">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product?.slug}`}
                      className="font-heading font-bold text-gunmetal hover:text-deep-teal transition line-clamp-1"
                    >
                      {item.product?.name}
                    </Link>
                    <span className="text-sm font-semibold text-gunmetal/60 block mt-1">
                      $
                      {parseFloat(item.product?.price || "0").toLocaleString(
                        "es-AR",
                        { minimumFractionDigits: 2 },
                      )}
                      c/u
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-gunmetal/10">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gunmetal/15 rounded-xl bg-ocean-mist/5">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={loading || item.quantity <= 1}
                      className="p-2 text-gunmetal/60 hover:text-deep-teal disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-sm text-gunmetal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="p-2 text-gunmetal/60 hover:text-deep-teal"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-gunmetal/50 block">
                      Subtotal
                    </span>
                    <span className="font-extrabold text-gunmetal">
                      $
                      {item.sub_total.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="p-2 text-gunmetal/40 hover:text-rose-600 transition rounded-lg"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-3xl border border-gunmetal/10 shadow-sm h-fit">
            <h3 className="font-heading text-xl font-bold text-gunmetal mb-6">
              Resumen de la Compra
            </h3>
            <div className="space-y-3 border-b border-gunmetal/10 pb-4 text-sm">
              <div className="flex justify-between text-gunmetal/70">
                <span>Subtotal ({items.length} productos)</span>
                <span>
                  ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-gunmetal/70">
                <span>Envío</span>
                <span className="text-deep-teal font-semibold">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 font-extrabold text-lg text-gunmetal">
              <span>Total</span>
              <span className="text-2xl text-deep-teal">
                ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Link
              href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
              className="w-full py-4 bg-deep-teal text-white font-bold rounded-2xl hover:bg-dark-cyan transition flex items-center justify-center gap-2 shadow-lg mt-4"
            >
              Proceder al Pago <ArrowRight className="w-5 h-5" />
            </Link>

            {!isAuthenticated && (
              <p className="text-xs text-gunmetal/50 text-center mt-3">
                Serás redirigido para iniciar sesión antes de realizar el pago.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
