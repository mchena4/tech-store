'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/api';
import api from '@/lib/axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get<Category[]>('/category_list/');
        setCategories(res.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Todas las Categorías</h1>
      <p className="text-gray-500 mb-8">Explora nuestro catálogo completo organizado por categoría.</p>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Cargando categorías...</div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No hay categorías registradas.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold group-hover:scale-105 transition">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-gray-400">Ver productos disponibles</span>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition">
                Explorar <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
