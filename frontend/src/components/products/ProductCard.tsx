"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ProductSummary } from "@/types/api";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, loading } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gunmetal/10 shadow-sm hover:border-ocean-mist/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square bg-ocean-mist/5 overflow-hidden"
      >
        {product.image ? (
          <img
            src={
              product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
            }
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gunmetal/40 text-sm">
            Sin imagen
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product.slug}`} className="block mb-2">
          <h3 className="font-heading font-semibold text-gunmetal group-hover:text-deep-teal transition line-clamp-2 text-sm sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gunmetal/5">
          <div>
            <span className="text-xs text-gunmetal/50 block">Precio</span>
            <span className="text-lg font-extrabold text-gunmetal">
              $
              {parseFloat(product.price).toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="p-2.5 bg-ocean-mist/15 text-deep-teal hover:bg-deep-teal hover:text-white rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-deep-teal/20 active:scale-95 disabled:opacity-50"
            title="Agregar al Carrito"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
