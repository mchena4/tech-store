'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CartPage() {
  const { cart, loading, fetchCart, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && !cart) {
    return <div className="py-20 text-center text-gray-400">Cargando carrito...</div>;
  }

  const items = cart?.cartitems || [];
  const total = cart?.cart_total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Seguir Comprando
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-indigo-600" /> Mi Carrito de Compras
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 text-sm mb-6">
            Explora nuestro catálogo y agrega los mejores productos tecnológicos.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
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
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    {item.product?.image ? (
                      <img
                        src={
                          item.product.image.startsWith('http')
                            ? item.product.image
                            : `http://127.0.0.1:8000${item.product.image}`
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Sin img
                      </div>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product?.slug}`}
                      className="font-bold text-gray-900 hover:text-indigo-600 transition line-clamp-1"
                    >
                      {item.product?.name}
                    </Link>
                    <span className="text-sm font-semibold text-gray-500 block mt-1">
                      ${parseFloat(item.product?.price || '0').toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={loading || item.quantity <= 1}
                      className="p-2 text-gray-500 hover:text-indigo-600 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-bold text-sm text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="p-2 text-gray-500 hover:text-indigo-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Subtotal</span>
                    <span className="font-extrabold text-gray-900">
                      ${item.sub_total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                    className="p-2 text-gray-400 hover:text-rose-600 transition rounded-lg"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de la Compra</h3>

            <div className="space-y-3 border-b border-gray-100 pb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} productos)</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-emerald-600 font-semibold">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 font-extrabold text-lg text-gray-900">
              <span>Total</span>
              <span className="text-2xl text-indigo-600">
                ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <Link
              href={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg mt-4"
            >
              Proceder al Pago <ArrowRight className="w-5 h-5" />
            </Link>

            {!isAuthenticated && (
              <p className="text-xs text-gray-500 text-center mt-3">
                Serás redirigido para iniciar sesión antes de realizar el pago.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
