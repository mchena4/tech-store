import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">¡Pago Aprobado!</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Tu compra ha sido procesada con éxito. Hemos registrado tu orden en nuestro sistema.
        </p>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            Ver Mis Órdenes <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
