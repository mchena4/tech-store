'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Order } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    async function fetchOrders() {
      try {
        const res = await api.get<Order[]>('/orders/history/');
        setOrders(res.data);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Cargando tus órdenes de compra...</div>;
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Pagado
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'Shipped':
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">
            <Package className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-indigo-600" /> Mis Órdenes de Compra
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Aún no tienes órdenes de compra</h3>
          <p className="text-sm text-gray-500 mb-6">Tus compras confirmadas aparecerán aquí.</p>
          <Link
            href="/"
            className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider">Código de Orden</span>
                  <span className="font-extrabold text-gray-900 text-lg">#{order.order_code}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider">Fecha</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase tracking-wider">Total</span>
                  <span className="font-extrabold text-indigo-600 text-lg">
                    ${parseFloat(order.total_amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Productos
                </span>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-1.5 px-3 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-800">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span className="font-bold text-gray-900">
                      ${parseFloat(item.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u
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
