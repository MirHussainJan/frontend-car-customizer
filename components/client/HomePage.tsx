'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Palette, Gauge, Loader2 } from 'lucide-react';
import { getAllBrands, getAllVehicles } from '@/lib/api';
import { Brand, Vehicle } from '@/lib/types';
import { toast } from 'sonner';
import { VehicleModelPreview } from '@/components/client/VehicleModelPreview';

export function HomePage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [brandsData, vehiclesData] = await Promise.all([
        getAllBrands(),
        getAllVehicles()
      ]);
      setBrands(brandsData.slice(0, 4));
      setVehicles(vehiclesData.slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Premium Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-car.jpg"
            alt="Premium luxury sports car"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Premium Customization Platform</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold text-foreground leading-tight text-balance">
                  Craft Your Masterpiece
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg text-balance">
                  Design and customize premium vehicles with precision. Choose from world-class brands and create your perfect machine.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/vehicles">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                    Explore Vehicles
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/brands">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10 hover:text-white text-foreground bg-transparent"
                  >
                    Browse Brands
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Premium Brands</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Customizable Vehicles</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">100K+</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </div>

            {/* Right Spacer */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Premium Brands Showcase Section */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
              World-Class Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and customize vehicles from the world's most prestigious automotive manufacturers
            </p>
          </div>

          {/* Brands Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.id}`}>
                <div className="group h-full p-8 rounded-2xl border border-border hover:border-primary/50 bg-background hover:bg-muted transition-all duration-300 cursor-pointer">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {brand.logo}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-4 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
              Featured Vehicles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of premium vehicles ready for customization
            </p>
          </div>

          {/* Vehicles Showcase */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                <div className="group h-full flex flex-col justify-between relative rounded-2xl border border-border overflow-hidden bg-card hover:border-primary/50 transition-all duration-300">
                  {/* Vehicle Image Background */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden flex items-center justify-center">
                    <VehicleModelPreview
                      modelUrl={vehicle.modelUrl}
                      vehicleName={vehicle.name}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {vehicle.year}
                      </p>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-t border-b border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Engine</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.engine}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Horsepower</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.horsepower} hp</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">0-60 mph</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.acceleration}s</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Top Speed</p>
                        <p className="text-sm font-semibold text-foreground">{vehicle.topSpeed} mph</p>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-2xl font-bold text-primary">
                          ${(vehicle.price / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-lg transition-all"
                      >
                        Customize
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/vehicles">
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-muted text-foreground bg-transparent"
              >
                View All Vehicles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Customization Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced tools and premium options to make your vehicle uniquely yours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Palette className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                Premium Paint
              </h3>
              <p className="text-muted-foreground">
                Choose from an extensive palette of premium metallic and matte finishes
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                Performance
              </h3>
              <p className="text-muted-foreground">
                Enhance handling, acceleration, and braking with premium upgrades
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-border hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center mb-4">
                <Gauge className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                Real-Time Preview
              </h3>
              <p className="text-muted-foreground">
                Instantly visualize your customizations with advanced 3D visualization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">
                Ready to Build Your Dream Vehicle?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore premium brands, select your vehicle, and create unlimited customizations with our advanced platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vehicles">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
                    Start Customizing
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/brands">
                  <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 text-foreground bg-transparent">
                    Explore Brands
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
