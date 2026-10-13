import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gunmetal text-gray-300 mt-20 border-t border-gunmetal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-white text-lg font-bold mb-4">
              TechStore
            </h3>
            <p className="text-sm text-gray-400">
              Tu tienda de tecnología de confianza con los mejores precios y
              envíos a todo el país.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-white text-sm font-semibold mb-4">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-strong-cyan transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-strong-cyan transition"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-strong-cyan transition"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-white text-sm font-semibold mb-4">
              Mi Cuenta
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-strong-cyan transition"
                >
                  Ingresar
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-strong-cyan transition"
                >
                  Mis Órdenes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-white text-sm font-semibold mb-4">
              Medios de Pago
            </h4>
            <p className="text-sm text-gray-400 mb-2">
              Integración segura con Mercado Pago
            </p>
            <span className="inline-block px-3 py-1 bg-strong-cyan/15 text-strong-cyan border border-strong-cyan/20 rounded text-xs font-semibold">
              Mercado Pago Approved
            </span>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} TechStore Ecommerce API. Todos los
          derechos reservados.
        </div>
      </div>
    </footer>
  );
}
