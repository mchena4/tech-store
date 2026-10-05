'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react';
import { ProductDetail } from '@/types/api';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import WishlistButton from '@/components/products/WishlistButton';
import ReviewSection from '@/components/reviews/ReviewSection';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const { addToCart, loading: cartLoading } = useCartStore();

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const res = await api.get<ProductDetail>(`/products/${slug}/`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error al cargar detalle del producto:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductDetail();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Cargando detalles del producto...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Producto no encontrado</h2>
        <Link href="/" className="text-indigo-600 hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `http://127.0.0.1:8000${product.image}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <span className="text-gray-400 text-sm">Sin imagen disponible</span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
              {product.category.name} {product.brand ? `• ${product.brand.name}` : ''}
            </span>
          )}

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="text-3xl font-extrabold text-gray-900 mb-6">
            ${parseFloat(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8 mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white transition flex items-center justify-center gap-2 shadow-lg ${
                added
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" /> ¡Agregado al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Agregar al Carrito
                </>
              )}
            </button>

            <WishlistButton productId={product.id} />
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" /> Envío inmediato a todo el país
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Garantía oficial incluida
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Especificaciones Técnicas</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.specifications.map((spec) => (
              <div key={spec.id} className="p-3 bg-gray-50 rounded-xl flex justify-between">
                <dt className="font-semibold text-gray-700 text-sm">{spec.name}</dt>
                <dd className="text-gray-900 text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection productId={product.id} />
    </div>
  );
}
