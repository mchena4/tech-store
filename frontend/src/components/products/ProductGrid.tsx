import { ProductSummary } from "@/types/api";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductSummary[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No se encontraron productos disponible.
      </div>
    );
  }

  return (
    <section className="py-6">
      {title && (
        <h2 className="text-2xl font-bold text-gunmetal mb-6 tracking-tight">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
