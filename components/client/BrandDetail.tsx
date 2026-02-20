'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getBrandById, getAllVehicles } from '@/lib/api';
import { Brand, Vehicle } from '@/lib/types';
import { PremiumBadge } from './PremiumBadge';
import { toast } from 'sonner';

interface BrandDetailProps {
  brandId: string;
}

export function BrandDetail({ brandId }: BrandDetailProps) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandVehicles, setBrandVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async () => {
    try {
      setIsLoading(true);
      const [brandData, allVehicles] = await Promise.all([
        getBrandById(brandId),
        getAllVehicles()
      ]);
      setBrand(brandData);
      setBrandVehicles(allVehicles.filter(v => v.brandId === brandId));
    } catch (error) {
      toast.error('Failed to load brand details');
      console.error('Error loading brand:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Brand not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-card border-b border-border overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative z-10 text-center">
          <div className="text-9xl mb-4">{brand.logo}</div>
          <h1 className="text-5xl font-bold text-foreground mb-2">{brand.name}</h1>
          <p className="text-lg text-muted-foreground">{brand.country}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-foreground mb-6">About {brand.name}</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {brand.description}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded in {brand.founded}, {brand.name} has been delivering excellence and innovation
              in automotive engineering. Each vehicle is crafted with precision and passion, offering
              an unparalleled driving experience to enthusiasts worldwide.
            </p>
          </div>

          {/* Info Card */}
          <div className="p-8 rounded-xl border border-border bg-card space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Founded</p>
              <p className="text-3xl font-bold text-primary">{brand.founded}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Headquarters</p>
              <p className="text-xl font-semibold text-foreground">{brand.country}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <PremiumBadge variant="success">Premium Verified</PremiumBadge>
            </div>
            <Link href="/vehicles" className="block">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Explore Vehicles
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Fleet</h2>

          {brandVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandVehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                  <div className="h-full rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                    {/* Image Area */}
                    <div className="relative h-48 bg-muted border-b border-border flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all" />
                      <div className="relative text-5xl">{brand.logo}</div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {vehicle.name}
                      </h3>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Horsepower</p>
                          <p className="font-semibold text-foreground">{vehicle.horsepower}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">0-60</p>
                          <p className="font-semibold text-foreground">{vehicle.acceleration}s</p>
                        </div>
                      </div>

                      {/* Price */}
                      <p className="text-2xl font-bold text-primary">
                        ${(vehicle.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No vehicles available for this brand yet
            </div>
          )}
        </div>

        {/* Heritage Section */}
        <div className="border-t border-border mt-20 pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Heritage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-foreground font-semibold">Models Produced</p>
              <p className="text-sm text-muted-foreground mt-2">Decades of automotive excellence</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-foreground font-semibold">Satisfied Customers</p>
              <p className="text-sm text-muted-foreground mt-2">Worldwide automotive enthusiasts</p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-foreground font-semibold">Premium Support</p>
              <p className="text-sm text-muted-foreground mt-2">Always here for you</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
