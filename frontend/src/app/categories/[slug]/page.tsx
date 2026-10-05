'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CategoryDetail } from '@/types/api';
import api from '@/lib/axios';
import ProductGrid from '@/components/products/ProductGrid';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryDetail() {
      try {
        const res = await api.get<CategoryDetail>(`/category/${slug}/`);
        setCategory(res.data);
      } catch (err) {
        console.error('Error al cargar detalle de categoría:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryDetail();
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Cargando categoría...</div>;
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Categoría no encontrada</h2>
        <Link href="/categories" className="text-indigo-600 hover:underline">
          Volver a categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Categorías
      </Link>

      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-500">
          Mostrando los productos pertenecientes a {category.name}.
        </p>
      </div>

      <ProductGrid products={category.products} />
    </div>
  );
}
