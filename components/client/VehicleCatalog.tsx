'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllVehicles, getAllBrands } from '@/lib/api';
import { Vehicle, Brand } from '@/lib/types';
import { toast } from 'sonner';
import { VehicleModelPreview } from '@/components/client/VehicleModelPreview';

export function VehicleCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [vehiclesData, brandsData] = await Promise.all([
        getAllVehicles(),
        getAllBrands()
      ]);
      setVehicles(vehiclesData);
      setBrands(brandsData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const brand = brands.find(b => b.id === vehicle.brandId);
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || vehicle.brandId === selectedBrand;
    const matchesPrice = vehicle.basePrice >= priceRange[0] && vehicle.basePrice <= priceRange[1];
    return matchesSearch && matchesBrand && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-12 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Vehicle Customization Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse and customize premium vehicles from the world's finest brands
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Search Vehicles
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Brand
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      !selectedBrand
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.slice(0, 5).map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        selectedBrand === brand.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground hover:border-primary/50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>${(priceRange[0] / 1000).toFixed(0)}K</span>
                    <span>${(priceRange[1] / 1000).toFixed(0)}K</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full border-border bg-transparent"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand(null);
                  setPriceRange([0, 200000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVehicles.map((vehicle) => {
                  const brand = brands.find(b => b.id === vehicle.brandId);
                  return (
                    <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
                      <div className="h-full rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                        {/* Image Area */}
                        <div className="relative h-56 bg-muted border-b border-border flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all" />
                          <VehicleModelPreview
                            modelUrl={vehicle.modelUrl}
                            vehicleName={vehicle.name}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                          <div>
                            <p className="text-xs text-primary font-semibold mb-1">{brand?.name || 'Unknown'}</p>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {vehicle.name}
                            </h3>
                          </div>

                          {/* Specs */}
                          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">HP</p>
                              <p className="font-semibold text-foreground text-sm">{vehicle.horsepower}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">0-60</p>
                              <p className="font-semibold text-foreground text-sm">{vehicle.acceleration}s</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Torque</p>
                              <p className="font-semibold text-foreground text-sm">{vehicle.torque} lb-ft</p>
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-primary">
                              ${(vehicle.basePrice / 1000).toFixed(0)}K
                            </p>
                            <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors">
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No vehicles found matching your filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrand(null);
                    setPriceRange([0, 200000]);
                  }}
                  className="border-border"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Results Count */}
            {filteredVehicles.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
