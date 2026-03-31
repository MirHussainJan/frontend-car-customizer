'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, PackageSearch, ArrowLeft, Truck, Clock, XCircle } from 'lucide-react';
import { OrderAPI } from '../../../lib/api/orders';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import type { Order, OrderStatus } from '../../../lib/types';

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
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${cfg.color}`}>
      <Icon className="h-4 w-4" />
      {cfg.label}
    </span>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;

    OrderAPI.getById(String(params.id))
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !order) {
    return <div className="flex min-h-screen items-center justify-center text-destructive">{error || 'Order not found'}</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Link href="/orders" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> My Orders
        </Link>

        {isNew && (
          <div className="mb-6 space-y-1 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
            <p className="text-lg font-bold text-green-800">Order placed successfully</p>
            <p className="text-sm text-green-700">Your items are confirmed and the order is now in the queue.</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={order.status} />
              {order.estimatedDelivery && (
                <p className="text-xs text-muted-foreground">
                  Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </p>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.itemType}-${item.itemId}-${index}`} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {item.name}
                        {item.quantity > 1 ? ` x ${item.quantity}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.subtitle || (item.itemType === 'accessory' ? 'Accessory' : 'Vehicle')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold"><PriceFmt value={item.itemTotal} /></p>
                      <p className="text-xs text-muted-foreground">Base: <PriceFmt value={item.basePrice * item.quantity} /></p>
                    </div>
                  </div>
                  {item.customizations.length > 0 && (
                    <div className="ml-4 space-y-0.5">
                      {item.customizations.map((customization, customizationIndex) => (
                        <div key={customizationIndex} className="flex justify-between text-xs text-muted-foreground">
                          <span>{customization.assetName} ({customization.assetCategory})</span>
                          <span>+<PriceFmt value={customization.assetPrice} /></span>
                        </div>
                      ))}
                    </div>
                  )}
                  {index < order.items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span><PriceFmt value={order.subtotal} /></span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span><PriceFmt value={order.tax} /></span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : <PriceFmt value={order.shippingCost} />}</span></div>
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>Total</span><span><PriceFmt value={order.total} /></span></div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs capitalize">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-1">{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Link href="/orders"><Button variant="outline">All Orders</Button></Link>
            <Link href="/shop"><Button>Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}
