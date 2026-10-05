import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Pago No Procesado</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          No se pudo completar el pago. Puedes volver a tu carrito e intentarlo nuevamente con otro medio de pago.
        </p>

        <div className="space-y-3">
          <Link
            href="/cart"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            Volver al Carrito <RefreshCw className="w-4 h-4" />
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
