import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white p-8 rounded-3xl border border-gunmetal/10 shadow-xl text-center">
        <div className="w-16 h-16 bg-ocean-mist/20 text-deep-teal rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-gunmetal mb-2">
          ¡Pago Aprobado!
        </h1>
        <p className="text-gunmetal/60 text-sm mb-6 leading-relaxed">
          Tu compra ha sido procesada con éxito. Hemos registrado tu orden en
          nuestro sistema.
        </p>

        <div className="space-y-3">
          <Link
            href="/orders"
            className="w-full py-3 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition flex items-center justify-center gap-2 text-sm shadow-md"
          >
            Ver Mis Órdenes <ArrowRight className="w-4 h-4" />
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
