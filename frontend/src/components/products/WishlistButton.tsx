"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

interface WishlistButtonProps {
  productId: number;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      setMessage("Debes inicar sesión para agregar a favoritos");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/add_to_wishlist/", {
        product_id: productId,
      });
      if (res.status === 201) {
        setInWishlist(true);
        setMessage("Añadido a tus favoritos");
      } else if (res.status === 204) {
        setInWishlist(false);
        setMessage("Eliminado de tus favoritos");
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al actualizar wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`p-3 rounded-xl border transition flex items-center justify-center gap-2 font-medium ${
          inWishlist
            ? "bg-strong-cyan/20 border-strong-cyan text-deep-teal"
            : "bg-white border-gunmetal/15 text-gunmetal hover:border-strong-cyan hover:text-deep-teal"
        }`}
        title="Guardar en Favoritos"
      >
        <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
      </button>

      {message && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gunmetal text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-20">
          {message}
        </div>
      )}
    </div>
  );
}
