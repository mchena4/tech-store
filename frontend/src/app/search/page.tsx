'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductSummary } from '@/types/api';
import api from '@/lib/axios';
import ProductGrid from '@/components/products/ProductGrid';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get<ProductSummary[]>(`/search/?query=${encodeURIComponent(query)}`);
        setProducts(res.data);
      } catch (err) {
        console.error('Error durante la búsqueda:', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-gray-500">
          Mostrando resultados para: <span className="font-semibold text-gray-900">&quot;{query}&quot;</span>
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Buscando productos...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Cargando...</div>}>
      <SearchContent />
    </Suspense>
  );
}
