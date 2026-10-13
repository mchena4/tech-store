"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSummary } from "@/types/api";
import api from "@/lib/axios";
import ProductGrid from "@/components/products/ProductGrid";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
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
        const res = await api.get<ProductSummary[]>(
          `/search/?query=${encodeURIComponent(query)}`,
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error durante la búsqueda:", err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gunmetal/10 pb-6">
        <h1 className="font-heading text-3xl font-extrabold text-gunmetal mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-gunmetal/60">
          Mostrando resultados para:
          <span className="font-semibold text-gunmetal">
            &quot;{query}&quot;
          </span>
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gunmetal/50">
          Buscando productos...
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gunmetal/50">Cargando...</div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
