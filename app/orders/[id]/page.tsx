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
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',    icon: Clock },
  confirmed:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800 border-blue-200',          icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800 border-purple-200',    icon: PackageSearch },
  shipped:    { label: 'Shipped',    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',    icon: Truck },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-800 border-green-200',       icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-800 border-red-200',             icon: XCircle },
};

function PriceFmt({ value }: { value: number }) {
  return <>${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}</>;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${cfg.color}`}>
      <Icon className="w-4 h-4" />
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  if (error || !order) return <div className="min-h-screen flex items-center justify-center text-destructive">{error || 'Order not found'}</div>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> My Orders
        </Link>

        {isNew && (
          <div className="mb-6 rounded-xl border bg-green-50 border-green-200 p-6 text-center space-y-1">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
            <p className="text-lg font-bold text-green-800">Order Placed Successfully!</p>
            <p className="text-sm text-green-700">Thank you for your order. We'll get it ready right away.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-sm text-muted-foreground mt-1">
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

          {/* Items */}
          <Card>
            <CardHeader><CardTitle className="text-base">Items Ordered</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{item.vehicleName}</p>
                      <p className="text-sm text-muted-foreground">{item.brandName} · {item.vehicleModel}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold"><PriceFmt value={item.itemTotal} /></p>
                      <p className="text-xs text-muted-foreground">Base: <PriceFmt value={item.basePrice} /></p>
                    </div>
                  </div>
                  {item.customizations.length > 0 && (
                    <div className="ml-4 space-y-0.5">
                      {item.customizations.map((c, j) => (
                        <div key={j} className="flex justify-between text-xs text-muted-foreground">
                          <span>{c.assetName} ({c.assetCategory})</span>
                          <span>+<PriceFmt value={c.assetPrice} /></span>
                        </div>
                      ))}
                    </div>
                  )}
                  {i < order.items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Totals + Address */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Payment Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span><PriceFmt value={order.subtotal} /></span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span><PriceFmt value={order.tax} /></span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shippingCost === 0 ? 'Free' : <PriceFmt value={order.shippingCost} />}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span><PriceFmt value={order.total} /></span></div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'} className="text-xs capitalize">{order.paymentStatus}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-0.5 text-muted-foreground">
                <p className="text-foreground font-medium">{order.shippingAddress.fullName}</p>
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
            <Link href="/vehicles"><Button>Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}
