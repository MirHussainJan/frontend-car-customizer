'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllBrands } from '@/lib/api';
import { Brand } from '@/lib/types';
import { toast } from 'sonner';

export function BrandsShowcase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      toast.error('Failed to load brands');
      console.error('Error loading brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-12 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Premium Automotive Brands
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our curated collection of luxury and performance automotive brands
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-6 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <Link key={brand.id} href={`/brands/${brand.id}`}>
                  <div className="h-full rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/60 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col justify-between">
                    {/* Brand Header */}
                    <div className="p-6 border-b border-border">
                      <div className="w-16 h-16 rounded-lg bg-muted group-hover:bg-primary/20 flex items-center justify-center text-3xl mb-4 transition-colors">
                        {brand.logo}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">{brand.country}</p>
                    </div>

                    {/* Brand Info */}
                    <div className="p-6 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {brand.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Founded</p>
                          <p className="font-semibold text-foreground">{brand.foundedYear}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Vehicles</p>
                          <p className="font-semibold text-foreground">12+</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-muted/20">
                      <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                        Explore Brand
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No brands found matching your search</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="border-border"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-muted-foreground">Premium Brands</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Total Vehicles</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">100K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
