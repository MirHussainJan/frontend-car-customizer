'use client';

import { useEffect, useState } from 'react';
import { Eye, RefreshCw, Clock, CheckCircle2, Truck, PackageSearch, XCircle } from 'lucide-react';
import { OrderAPI } from '@/lib/api/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Order, OrderStatus, OrderStats } from '@/lib/types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed:  'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped:    'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered:  'bg-green-100 text-green-800 border-green-200',
  cancelled:  'bg-red-100 text-red-800 border-red-200',
};

const STATUS_ICONS: Record<OrderStatus, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: PackageSearch,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const Icon = STATUS_ICONS[status] ?? Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_COLORS[status]}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function PriceFmt({ value }: { value: number }) {
  return <>${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}</>;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async (status?: string) => {
    setLoading(true);
    try {
      const res = await OrderAPI.getAll(status && status !== 'all' ? status : undefined);
      setOrders(res.data);
    } catch (_) {}
    setLoading(false);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await OrderAPI.getStats();
      setStats(res.data);
    } catch (_) {}
    setStatsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await OrderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      fetchStats(); // refresh stats
    } catch (_) {}
    setUpdatingId(null);
  };

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? orders.length;
  const deliveredCount = stats?.statusCounts?.delivered ?? 0;
  const pendingCount = (stats?.statusCounts?.pending ?? 0) + (stats?.statusCounts?.confirmed ?? 0);

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`} />
        <StatCard label="Delivered" value={deliveredCount} />
        <StatCard label="Awaiting Action" value={pendingCount} sub="pending + confirmed" />
      </div>

      {/* Filter + Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchOrders(filterStatus); fetchStats(); }}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Order #</th>
                    <th className="text-left px-4 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">Total</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const customer = typeof order.userId === 'object' ? order.userId : null;
                    return (
                      <tr key={order._id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {customer ? (
                            <div>
                              <p className="text-foreground font-medium">{customer.name}</p>
                              <p className="text-xs">{customer.email}</p>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'short' })}
                        </td>
                        <td className="px-4 py-3 font-semibold"><PriceFmt value={order.total} /></td>
                        <td className="px-4 py-3">
                          <Select
                            value={order.status}
                            onValueChange={(val) => handleStatusChange(order._id, val)}
                            disabled={updatingId === order._id}
                          >
                            <SelectTrigger className="h-7 w-36 text-xs">
                              <SelectValue>
                                <StatusBadge status={order.status} />
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <StatusBadge status={s} />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-4">
                  <span>{selectedOrder.orderNumber}</span>
                  <StatusBadge status={selectedOrder.status} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {/* Customer info */}
                {typeof selectedOrder.userId === 'object' && (
                  <div className="text-sm">
                    <p className="font-medium">{selectedOrder.userId.name}</p>
                    <p className="text-muted-foreground">{selectedOrder.userId.email}</p>
                  </div>
                )}

                <Separator />

                {/* Items */}
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Items</p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <p>{item.vehicleName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.brandName} · {item.vehicleModel}
                          {item.customizations.length > 0 && ` · ${item.customizations.length} customizations`}
                        </p>
                      </div>
                      <p className="font-medium"><PriceFmt value={item.itemTotal} /></p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span><PriceFmt value={selectedOrder.subtotal} /></span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span><PriceFmt value={selectedOrder.tax} /></span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{selectedOrder.shippingCost === 0 ? 'Free' : <PriceFmt value={selectedOrder.shippingCost} />}</span></div>
                  <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span><PriceFmt value={selectedOrder.total} /></span></div>
                </div>

                <Separator />

                {/* Shipping */}
                <div className="text-sm">
                  <p className="font-semibold mb-1">Shipping Address</p>
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-muted-foreground">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p className="text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                </div>

                {/* Update status */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm font-medium">Update Status:</span>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => handleStatusChange(selectedOrder._id, val)}
                    disabled={updatingId === selectedOrder._id}
                  >
                    <SelectTrigger className="w-40 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
