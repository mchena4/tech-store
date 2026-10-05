import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export default function PaymentPendingPage() {
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Pago Pendiente</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Tu transacción se encuentra en proceso de aprobación por Mercado Pago. Te notificaremos en cuanto se acredite.
        </p>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            Ver Estado de Mis Órdenes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
