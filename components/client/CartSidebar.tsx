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
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:w-[420px]">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {items.length} {items.length === 1 ? 'line' : 'lines'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add a vehicle or accessory to get started</p>
              <Button variant="outline" onClick={closeCart} className="mt-2">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.itemType}-${item.itemId}`} className="space-y-3 rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subtitle || (item.itemType === 'accessory' ? 'Accessory' : 'Vehicle')}
                      {item.quantity > 1 ? ` · Qty ${item.quantity}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {item.customizations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Customizations</p>
                    {item.customizations.map((customization, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{customization.assetName}</span>
                        <span>+<PriceFmt value={customization.assetPrice} /></span>
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

        {items.length > 0 && (
          <div className="space-y-4 border-t bg-background px-6 py-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span><PriceFmt value={cartTotal} /></span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax (10%)</span>
              <span><PriceFmt value={cartTotal * 0.1} /></span>
            </div>
            <div className="flex justify-between text-base font-bold">
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
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
              <Button className="flex-1" onClick={handleCheckout}>
                Checkout
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
