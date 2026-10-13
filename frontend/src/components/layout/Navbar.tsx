"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, initCartCode, fetchCart } = useCartStore();
  const { user, isAuthenticated, initialize, logout } = useAuthStore();

  useEffect(() => {
    initialize();
    initCartCode();
    fetchCart();
  }, [initialize, initCartCode, fetchCart]);

  const cartCount =
    cart?.cartitems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gunmetal/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-heading font-extrabold text-gunmetal tracking-tight"
          >
            <span className="bg-deep-teal text-white p-1.5 rounded-lg shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </span>
            TechStore
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md relative hidden sm:block"
          >
            <input
              type="text"
              placeholder="Buscar productos, marcas o categorías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-ocean-mist/10 border border-ocean-mist/30 text-gunmetal placeholder-gunmetal/50 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-teal focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-gunmetal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Navigation Items */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/categories"
              className="text-sm font-medium text-gunmetal/80 hover:text-deep-teal transition hidden md:block"
            >
              Categorías
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative p-2 text-gunmetal/80 hover:text-deep-teal transition"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-strong-cyan text-gunmetal text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Auth Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 text-sm font-medium text-gunmetal/80 hover:text-deep-teal"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Mis Órdenes</span>
                </Link>
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="p-1.5 text-gunmetal/40 hover:text-rose-600 transition rounded-lg hover:bg-ocean-mist/10"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-deep-teal rounded-full hover:bg-dark-cyan transition shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 sm:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-ocean-mist/10 border border-ocean-mist/30 text-gunmetal placeholder-gunmetal/50 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-teal"
            />
            <Search className="w-4 h-4 text-gunmetal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>
    </header>
  );
}
