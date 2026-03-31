'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { OrderAPI } from '../../lib/api/orders';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import type { ShippingAddress } from '../../lib/types';

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
};

function PriceFmt({ value }: { value: number }) {
  return <>${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</>;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState<ShippingAddress>({
    ...EMPTY_ADDRESS,
    fullName: user?.name ?? '',
    email: user?.email ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Please log in to checkout</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const tax = parseFloat((cartTotal * 0.1).toFixed(2));
  const shipping = cartTotal > 100000 ? 0 : 999;
  const total = cartTotal + tax + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await OrderAPI.create({
        items,
        shippingAddress: form,
        paymentMethod: 'card',
      });
      clearCart();
      router.push(`/orders/${result.data._id}?new=1`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Address */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5" /> Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" name="phone" required value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="123 Main St" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" required value={form.city} onChange={handleChange} placeholder="Los Angeles" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" required value={form.state} onChange={handleChange} placeholder="CA" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input id="zipCode" name="zipCode" required value={form.zipCode} onChange={handleChange} placeholder="90001" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" name="country" required value={form.country} onChange={handleChange} placeholder="United States" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-green-500" />
                Payment is simulated — no real charges will be made.
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.itemType}-${item.itemId}`}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate mr-2">
                          {item.name}
                          {item.quantity > 1 ? ` x ${item.quantity}` : ''}
                        </span>
                        <span className="shrink-0"><PriceFmt value={item.basePrice * item.quantity} /></span>
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</div>
                      )}
                      {item.customizations.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          +{item.customizations.length} customization{item.customizations.length > 1 ? 's' : ''} (<PriceFmt value={item.customizationTotal} />)
                        </div>
                      )}
                    </div>
                  ))}

                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span><PriceFmt value={cartTotal} /></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span><PriceFmt value={tax} /></span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : <PriceFmt value={shipping} />}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span><PriceFmt value={total} /></span>
                  </div>

                  {error && <p className="text-sm text-destructive text-center">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? 'Placing Order…' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
