import Link from "next/link";
import { XCircle, RefreshCw } from "lucide-react";

export default function PaymentFailurePage() {
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gunmetal/10 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-gunmetal mb-2">
          Pago No Procesado
        </h1>
        <p className="text-gunmetal/60 text-sm mb-6 leading-relaxed">
          No se pudo completar el pago. Puedes volver a tu carrito e intentarlo
          nuevamente con otro medio de pago.
        </p>
        <div className="space-y-3">
          <Link
            href="/cart"
            className="w-full py-3 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            Volver al Carrito <RefreshCw className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full py-3 bg-ocean-mist/10 text-gunmetal font-semibold rounded-xl hover:bg-ocean-mist/20 transition flex items-center justify-center gap-2 text-sm"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
