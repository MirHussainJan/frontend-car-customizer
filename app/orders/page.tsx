'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, Truck, PackageSearch, XCircle } from 'lucide-react';
import { OrderAPI } from '../../lib/api/orders';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import type { Order, OrderStatus } from '../../lib/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: PackageSearch },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
};

function PriceFmt({ value }: { value: number }) {
  return <>${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}</>;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    OrderAPI.getMyOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Link href="/shop">
            <Button variant="outline" size="sm">Browse Shop</Button>
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {orders.length === 0 ? (
          <div className="space-y-3 py-20 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground">Your order history will appear here</p>
            <Link href="/shop">
              <Button className="mt-2">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-bold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} - {order.items.map((item) => item.name).join(', ')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={order.status} />
                      <p className="text-lg font-bold"><PriceFmt value={order.total} /></p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/orders/${order._id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
