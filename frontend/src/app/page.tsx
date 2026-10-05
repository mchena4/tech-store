'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { ProductSummary, Category } from '@/types/api';
import api from '@/lib/axios';
import ProductGrid from '@/components/products/ProductGrid';

export default function HomePage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get<ProductSummary[]>('/product_list/'),
          api.get<Category[]>('/category_list/'),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error cargando datos de inicio:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-8 shadow-xl mt-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-indigo-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Nueva Colección de Tecnología
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            La mejor tecnología al alcance de tus manos
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg mb-8 leading-relaxed">
            Descubre notebooks, monitores, gadgets y accesorios con garantía oficial y envíos sin cargo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition shadow-lg"
            >
              Explorar Categorías <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Envíos a todo el país</h4>
            <p className="text-xs text-gray-500">Recibe tu compra rápido y seguro.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Pagos con Mercado Pago</h4>
            <p className="text-xs text-gray-500">Tarjetas de crédito, débito y dinero en cuenta.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Garantía Oficial</h4>
            <p className="text-xs text-gray-500">Todos nuestros productos son 100% originales.</p>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Categorías Principales</h2>
            <Link href="/categories" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition text-center flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">
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
          <div className="py-12 text-center text-gray-400">Cargando productos destacados...</div>
        ) : (
          <ProductGrid products={products} title="Productos Destacados" />
        )}
      </section>
    </div>
  );
}
