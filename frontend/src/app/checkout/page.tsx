'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PreferenceResponse } from '@/types/api';
import api from '@/lib/axios';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCode, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [initPoint, setInitPoint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    fetchCart();
  }, [isAuthenticated, router, fetchCart]);

  const handleCreatePayment = async () => {
    if (!cartCode) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.post<PreferenceResponse>('/create_payment/', {
        cart_code: cartCode,
      });

      if (res.data.init_point) {
        setInitPoint(res.data.init_point);
        // Redirigir automáticamente a Mercado Pago
        window.location.href = res.data.init_point;
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocurrió un error al generar la preferencia de pago de Mercado Pago.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartitems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 text-sm mb-6">Agrega productos antes de proceder al pago.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Finalizar Compra</h1>
            <p className="text-sm text-gray-500">Pago seguro procesado por Mercado Pago</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-2xl mb-8 space-y-3 text-sm">
          <h3 className="font-bold text-gray-900 text-base mb-2">Resumen de la Orden</h3>
          {cart.cartitems.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-700">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-semibold">${item.sub_total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-gray-900 text-lg">
            <span>Total a pagar</span>
            <span className="text-indigo-600">${cart.cart_total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-base"
          >
            {loading ? (
              'Generando preferencia de pago...'
            ) : (
              <>
                Pagar con Mercado Pago <ExternalLink className="w-5 h-5" />
              </>
            )}
          </button>

          {initPoint && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">¿No fuiste redirigido automáticamente?</p>
              <a
                href={initPoint}
                className="text-sm font-bold text-sky-600 underline hover:text-sky-700"
              >
                Haz clic aquí para abrir el checkout
              </a>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Transacción encriptada y protegida
          </div>
        </div>
      </div>
    </div>
  );
}
