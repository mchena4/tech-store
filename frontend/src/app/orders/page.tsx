"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { Order } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders");
      return;
    }

    async function fetchOrders() {
      try {
        const res = await api.get<Order[]>("/orders/history/");
        setOrders(res.data);
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gunmetal/50">
        Cargando tus órdenes de compra...
      </div>
    );
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-ocean-mist/20 text-deep-teal rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Pagado
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-dark-cyan/15 text-dark-cyan rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case "Shipped":
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-deep-teal text-white rounded-full text-xs font-bold">
            <Package className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gunmetal/10 text-gunmetal rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gunmetal/60 hover:text-deep-teal mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
      </Link>

      <h1 className="font-heading text-3xl font-extrabold text-gunmetal mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-deep-teal" /> Mis Órdenes de Compra
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gunmetal/10 shadow-sm max-w-lg mx-auto">
          <Package className="w-12 h-12 text-gunmetal/30 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-gunmetal mb-1">
            Aún no tienes órdenes de compra
          </h3>
          <p className="text-sm text-gunmetal/60 mb-6">
            Tus compras confirmadas aparecerán aquí.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-deep-teal text-white font-bold rounded-xl hover:bg-dark-cyan transition text-sm"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-gunmetal/10 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gunmetal/10">
                <div>
                  <span className="text-xs text-gunmetal/50 block uppercase tracking-wider">
                    Código de Orden
                  </span>
                  <span className="font-heading font-extrabold text-gunmetal text-lg">
                    #{order.order_code}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gunmetal/50 block uppercase tracking-wider">
                    Fecha
                  </span>
                  <span className="text-sm font-medium text-gunmetal/80">
                    {new Date(order.created_at).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gunmetal/50 block uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-extrabold text-deep-teal text-lg">
                    $
                    {parseFloat(order.total_amount).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gunmetal/50 uppercase tracking-wider">
                  Productos
                </span>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm py-1.5 px-3 bg-ocean-mist/5 rounded-xl border border-gunmetal/5"
                  >
                    <span className="font-medium text-gunmetal/80">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-bold text-gunmetal">
                      $
                      {parseFloat(item.price).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      c/u
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
