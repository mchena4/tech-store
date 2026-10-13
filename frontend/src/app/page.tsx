"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from "lucide-react";
import { ProductSummary, Category } from "@/types/api";
import api from "@/lib/axios";
import ProductGrid from "@/components/products/ProductGrid";

export default function HomePage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get<ProductSummary[]>("/product_list/"),
          api.get<Category[]>("/category_list/"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error cargando datos de inicio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-gunmetal via-deep-teal to-dark-cyan text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-8 shadow-xl mt-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-strong-cyan mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Nueva Colección de Tecnología
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            La mejor tecnología al alcance de tus manos
          </h1>
          <p className="text-gray-100 text-base sm:text-lg mb-8 leading-relaxed">
            Descubre notebooks, monitores, gadgets y accesorios con garantía
            oficial y envíos sin cargo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gunmetal font-bold rounded-full hover:bg-strong-cyan hover:text-gunmetal transition shadow-lg"
            >
              Explorar Categorías <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gunmetal/10 shadow-sm">
          <div className="p-3 bg-ocean-mist/15 text-deep-teal rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gunmetal">
              Envíos a todo el país
            </h4>
            <p className="text-xs text-gunmetal/60">
              Recibe tu compra rápido y seguro.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gunmetal/10 shadow-sm">
          <div className="p-3 bg-dark-cyan/15 text-dark-cyan rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gunmetal">
              Pagos con Mercado Pago
            </h4>
            <p className="text-xs text-gunmetal/60">
              Tarjetas de crédito, débito y dinero en cuenta.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gunmetal/10 shadow-sm">
          <div className="p-3 bg-strong-cyan/20 text-deep-teal rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-gunmetal">
              Garantía Oficial
            </h4>
            <p className="text-xs text-gunmetal/60">
              Todos nuestros productos son 100% originales.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-gunmetal tracking-tight">
              Categorías Principales
            </h2>
            <Link
              href="/categories"
              className="text-sm font-semibold text-deep-teal hover:text-dark-cyan flex items-center gap-1"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group p-4 bg-white rounded-2xl border border-gunmetal/10 shadow-sm hover:border-ocean-mist/40 hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-ocean-mist/15 text-deep-teal flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:bg-deep-teal group-hover:text-white transition">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gunmetal/80 group-hover:text-deep-teal transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-12 text-center text-gunmetal/50">
            Cargando productos destacados...
          </div>
        ) : (
          <ProductGrid products={products} title="Productos Destacados" />
        )}
      </section>
    </div>
  );
}
