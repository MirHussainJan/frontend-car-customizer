'use client';

import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

function PriceFmt({ value }: { value: number }) {
  return <>${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</>;
}

export default function CartSidebar() {
  const { items, cartTotal, isOpen, closeCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add a vehicle to get started</p>
              <Button variant="outline" onClick={closeCart} className="mt-2">
                Browse Vehicles
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.vehicleId} className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{item.vehicleName}</p>
                    <p className="text-xs text-muted-foreground">{item.brandName} · {item.vehicleModel}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.vehicleId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {item.customizations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customizations</p>
                    {item.customizations.map((c, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{c.assetName}</span>
                        <span>+<PriceFmt value={c.assetPrice} /></span>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Item Total</span>
                  <span><PriceFmt value={item.itemTotal} /></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4 bg-background">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span><PriceFmt value={cartTotal} /></span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (10%)</span>
              <span><PriceFmt value={cartTotal * 0.1} /></span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Estimated Total</span>
              <span><PriceFmt value={cartTotal * 1.1} /></span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="flex items-center gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </Button>
              <Button className="flex-1" onClick={handleCheckout}>
                Checkout
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
