"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { PreferenceResponse } from "@/types/api";
import api from "@/lib/axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCode, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [initPoint, setInitPoint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    fetchCart();
  }, [isAuthenticated, router, fetchCart]);

  const handleCreatePayment = async () => {
    if (!cartCode) return;
    setLoading(true);
    setError(null);

    try {
      const res = await api.post<PreferenceResponse>("/create_payment/", {
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
        setError(
          "Ocurrió un error al generar la preferencia de pago de Mercado Pago.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartitems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-gunmetal/10 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-gunmetal mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gunmetal/60 text-sm mb-6">
          Agrega productos antes de proceder al pago.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition text-sm"
        >
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gunmetal/10 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gunmetal/10">
          <div className="p-3 bg-ocean-mist/15 text-deep-teal rounded-2xl">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-gunmetal">
              Finalizar Compra
            </h1>
            <p className="text-sm text-gunmetal/60">
              Pago seguro procesado por Mercado Pago
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-ocean-mist/5 p-6 rounded-2xl mb-8 space-y-3 text-sm border border-gunmetal/10">
          <h3 className="font-heading font-bold text-gunmetal text-base mb-2">
            Resumen de la Orden
          </h3>
          {cart.cartitems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-gunmetal/80"
            >
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span className="font-semibold">
                $
                {item.sub_total.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
          <div className="border-t border-gunmetal/10 pt-3 flex justify-between font-extrabold text-gunmetal text-lg">
            <span>Total a pagar</span>
            <span className="text-deep-teal">
              $
              {cart.cart_total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full py-4 bg-dark-cyan hover:bg-deep-teal text-white font-extrabold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-base"
          >
            {loading ? (
              "Generando preferencia de pago..."
            ) : (
              <>
                Pagar con Mercado Pago <ExternalLink className="w-5 h-5" />
              </>
            )}
          </button>

          {initPoint && (
            <div className="text-center">
              <p className="text-xs text-gunmetal/60 mb-2">
                ¿No fuiste redirigido automáticamente?
              </p>
              <a
                href={initPoint}
                className="text-sm font-bold text-dark-cyan underline hover:text-deep-teal"
              >
                Haz clic aquí para abrir el checkout
              </a>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-gunmetal/50 pt-4">
            <ShieldCheck className="w-4 h-4 text-deep-teal" /> Transacción
            encriptada y protegida
          </div>
        </div>
      </div>
    </div>
  );
}
