'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brand } from '@/lib/types';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '@/lib/api';
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface EditingBrand extends Partial<Brand> {
  isNew?: boolean;
}

export function BrandManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<EditingBrand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrand = () => {
    setEditingBrand({
      name: '',
      logo: '🏛️',
      description: '',
      founded: new Date().getFullYear(),
      country: '',
      isNew: true,
    });
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = async (id: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
        setBrands(brands.filter((b) => b.id !== id));
        toast.success('Brand deleted successfully');
      } catch (error) {
        toast.error('Failed to delete brand');
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleSaveBrand = async () => {
    if (!editingBrand) return;

    try {
      setIsSaving(true);
      if (editingBrand.isNew) {
        const { isNew, id, createdAt, updatedAt, ...brandData } = editingBrand;
        const newBrand = await createBrand(brandData as Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>);
        setBrands([...brands, newBrand]);
        toast.success('Brand created successfully');
      } else if (editingBrand.id) {
        const { isNew, ...brandData } = editingBrand;
        const updatedBrandData = await updateBrand(editingBrand.id, brandData);
        setBrands(brands.map((b) => (b.id === editingBrand.id ? updatedBrandData : b)));
        toast.success('Brand updated successfully');
      }

      setIsModalOpen(false);
      setEditingBrand(null);
    } catch (error) {
      toast.error('Failed to save brand');
      console.error('Error saving brand:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button onClick={handleAddBrand} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Brand
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Brands Grid */
        <div className="grid grid-cols-1 h-full md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
          <Card key={brand.id} className="p-6 h-full hover:shadow-lg transition-shadow">
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{brand.logo}</div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {brand.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-semibold text-foreground">{brand.founded}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="font-semibold text-foreground">{brand.country}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Brand Modal */}
      {isModalOpen && editingBrand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingBrand.isNew ? 'Add Brand' : 'Edit Brand'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBrand(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={(e) =>
                    setEditingBrand({ ...editingBrand, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Apex Motors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Logo (Emoji)
                </label>
                <input
                  type="text"
                  value={editingBrand.logo}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      logo: e.target.value.slice(0, 2),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-2xl"
                  placeholder="🏛️"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={editingBrand.description}
                  onChange={(e) =>
                    setEditingBrand({
                      ...editingBrand,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Brand description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={editingBrand.founded}
                    onChange={(e) =>
                      setEditingBrand({
                        ...editingBrand,
                        founded: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editingBrand.country}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, country: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., USA"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBrand(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveBrand} 
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Brand
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
