'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Search, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react';
import { getAllAssets } from '@/lib/api';
import { CustomizationAsset } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const categoryCopy: Record<CustomizationAsset['category'], { label: string; description: string }> = {
  paint: {
    label: 'Paint',
    description: 'Finishes and paint systems for a sharper visual identity.',
  },
  wheels: {
    label: 'Wheels',
    description: 'Wheel packages tuned for stance, finish, and performance.',
  },
  interior: {
    label: 'Interior',
    description: 'Cockpit upgrades that refine comfort and cabin character.',
  },
  exterior: {
    label: 'Exterior',
    description: 'Body accessories and visual pieces that reshape the silhouette.',
  },
  performance: {
    label: 'Performance',
    description: 'Parts focused on response, handling, and power delivery.',
  },
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
];

const normalizeCompatibility = (entry: string | CustomizationAsset['compatibility'][number]) => {
  if (typeof entry === 'string') {
    return { id: entry, name: entry };
  }

  return {
    id: entry.id,
    name: entry.name,
    vehicleModel: entry.vehicleModel,
  };
};

export function ShopPage() {
  const { addToCart } = useCart();
  const [assets, setAssets] = useState<CustomizationAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CustomizationAsset['category']>('all');
  const [selectedCompatibility, setSelectedCompatibility] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAssets();
        setAssets(data);
      } catch (error) {
        console.error('Error loading shop assets:', error);
        toast.error('Failed to load shop inventory');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const compatibilityOptions = useMemo(() => {
    const allCompatibility = assets.flatMap((asset) => (asset.compatibility || []).map(normalizeCompatibility));
    const seen = new Map<string, string>();

    allCompatibility.forEach((entry) => {
      if (!seen.has(entry.id)) {
        seen.set(entry.id, entry.name);
      }
    });

    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [assets]);

  const categoryCounts = useMemo(() => {
    return assets.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {});
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const nextAssets = assets.filter((asset) => {
      const matchesSearch =
        !normalizedSearch ||
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.description.toLowerCase().includes(normalizedSearch);

      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      const matchesCompatibility =
        selectedCompatibility === 'all' ||
        asset.compatibility.some((vehicle) => normalizeCompatibility(vehicle).id === selectedCompatibility);

      return matchesSearch && matchesCategory && matchesCompatibility;
    });

    switch (sortBy) {
      case 'price-asc':
        return [...nextAssets].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...nextAssets].sort((a, b) => b.price - a.price);
      case 'name':
        return [...nextAssets].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...nextAssets].sort((a, b) => {
          const compatibilityDelta = (b.compatibility?.length || 0) - (a.compatibility?.length || 0);
          if (compatibilityDelta !== 0) return compatibilityDelta;
          return b.price - a.price;
        });
    }
  }, [assets, searchTerm, selectedCategory, selectedCompatibility, sortBy]);

  const featuredAssets = useMemo(() => filteredAssets.slice(0, 3), [filteredAssets]);
  const totalInventoryValue = useMemo(
    () => assets.reduce((sum, asset) => sum + asset.price, 0),
    [assets]
  );

  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground md:text-6xl text-balance">
                Shop premium accessories for every build stage.
              </h1>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">Live products</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{assets.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">Vehicle fitments</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{compatibilityOptions.length}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-sm text-muted-foreground">Inventory value</p>
              <p className="mt-2 text-3xl font-bold text-foreground">${totalInventoryValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-foreground">Filters</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Search products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search accessories..."
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as 'all' | CustomizationAsset['category'])}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="all">All categories</option>
                  {(Object.keys(categoryCopy) as CustomizationAsset['category'][]).map((category) => (
                    <option key={category} value={category}>
                      {categoryCopy[category].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Compatible vehicle</label>
                <select
                  value={selectedCompatibility}
                  onChange={(event) => setSelectedCompatibility(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="all">All vehicles</option>
                  {compatibilityOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">Storefront status</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Products here are loaded from the admin asset inventory. When your team uploads new accessories,
              they will appear in this shop automatically.
            </p>
          </div>
        </aside>

        <section className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Shop inventory</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Accessory catalog</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredAssets.length} of {assets.length} accessories
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card px-8 py-20 text-center">
              <p className="text-2xl font-bold text-foreground">No accessories match the current filters.</p>
              <p className="mt-3 text-muted-foreground">
                Try another search, switch categories, or broaden vehicle compatibility.
              </p>
              <Button
                variant="outline"
                className="mt-6 bg-transparent"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCompatibility('all');
                  setSortBy('featured');
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              {featuredAssets.length > 0 && (
                <div className="grid gap-5 xl:grid-cols-3">
                  {featuredAssets.map((asset, index) => (
                    <article
                      key={`featured-${asset.id}`}
                      className="relative overflow-hidden rounded-3xl border border-border bg-card p-6"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%)]" />
                      <div className="relative space-y-5">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="rounded-full px-3 py-1 capitalize">
                            {categoryCopy[asset.category].label}
                          </Badge>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Star className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="text-6xl">{asset.image}</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Featured pick #{index + 1}</p>
                          <h3 className="mt-1 text-2xl font-bold text-foreground">{asset.name}</h3>
                          <p className="mt-2 text-sm text-muted-foreground">{asset.description}</p>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Starting at</p>
                            <p className="text-3xl font-bold text-primary">${asset.price.toLocaleString()}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {asset.compatibility.length} fitment{asset.compatibility.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {filteredAssets.map((asset) => (
                  <article
                    key={asset.id}
                    className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-primary/50 flex flex-col justify-between"
                  >
                    <div className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_55%),radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_42%)] px-6 py-8">
                      <div className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-black/10 blur-2xl" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="text-6xl">{asset.image}</div>
                        <Badge variant="outline" className="rounded-full px-3 py-1 capitalize">
                          {categoryCopy[asset.category].label}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-5 p-6">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-bold text-foreground">{asset.name}</h3>
                          <p className="text-xl font-bold text-primary">${asset.price.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{asset.description}</p>
                      </div>

                      <div className="rounded-2xl border border-border bg-background/80 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          Compatible vehicles
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {asset.compatibility.length > 0 ? (
                            asset.compatibility.slice(0, 4).map((vehicle) => {
                              const normalizedVehicle = normalizeCompatibility(vehicle);
                              return (
                              <span
                                key={`${asset.id}-${normalizedVehicle.id}`}
                                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                              >
                                {normalizedVehicle.name}
                              </span>
                              );
                            })
                          ) : (
                            <span className="text-sm text-muted-foreground">Universal or not assigned yet</span>
                          )}
                          {asset.compatibility.length > 4 && (
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              +{asset.compatibility.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {asset.compatibility.length} fitment{asset.compatibility.length === 1 ? '' : 's'}
                        </p>
                        <Button
                          className="gap-2"
                          onClick={() => {
                            addToCart({
                              itemId: asset.id,
                              itemType: 'accessory',
                              name: asset.name,
                              subtitle: categoryCopy[asset.category].label,
                              image: asset.image,
                              basePrice: asset.price,
                              quantity: 1,
                              customizations: [],
                            });
                            toast.success(`${asset.name} added to cart`);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
