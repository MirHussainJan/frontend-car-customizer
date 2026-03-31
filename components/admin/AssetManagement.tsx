'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomizationAsset, Vehicle } from '@/lib/types';
import { getAllAssets, createAsset, updateAsset, deleteAsset, getAllVehicles } from '@/lib/api';
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface EditingAsset extends Partial<CustomizationAsset> {
  isNew?: boolean;
  compatibility?: string[];
}

const categories = ['paint', 'wheels', 'interior', 'exterior', 'performance'];

const categoryColors: Record<string, string> = {
  paint: 'bg-blue-100 text-blue-700',
  wheels: 'bg-gray-100 text-gray-700',
  interior: 'bg-purple-100 text-purple-700',
  exterior: 'bg-orange-100 text-orange-700',
  performance: 'bg-green-100 text-green-700',
};

export function AssetManagement() {
  const [assets, setAssets] = useState<CustomizationAsset[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<EditingAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [assetsData, vehiclesData] = await Promise.all([
        getAllAssets(),
        getAllVehicles()
      ]);
      setAssets(assetsData);
      setVehicles(vehiclesData);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCompatibilityIds = (asset?: Partial<CustomizationAsset> & { compatibility?: Array<string | { id?: string }> }) => {
    return (asset?.compatibility || []).map((entry) => {
      if (typeof entry === 'string') return entry;
      return entry.id || '';
    }).filter(Boolean);
  };

  const handleAddAsset = () => {
    setEditingAsset({
      name: '',
      category: 'paint',
      description: '',
      price: 0,
      image: '🎨',
      compatibility: [],
      isNew: true,
    });
    setIsModalOpen(true);
  };

  const handleEditAsset = (asset: CustomizationAsset) => {
    setEditingAsset({
      ...asset,
      compatibility: getCompatibilityIds(asset),
    });
    setIsModalOpen(true);
  };

  const handleDeleteAsset = async (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAsset(id);
        setAssets(assets.filter((a) => a.id !== id));
        toast.success('Asset deleted successfully');
      } catch (error) {
        toast.error('Failed to delete asset');
        console.error('Error deleting asset:', error);
      }
    }
  };

  const handleSaveAsset = async () => {
    if (!editingAsset) return;

    try {
      setIsSaving(true);
      if (editingAsset.isNew) {
        const { isNew, id, createdAt, updatedAt, ...assetData } = editingAsset;
        const payload = {
          ...assetData,
          compatibility: getCompatibilityIds(editingAsset),
        };
        const newAsset = await createAsset(payload as Omit<CustomizationAsset, 'id' | 'createdAt' | 'updatedAt'>);
        setAssets([...assets, newAsset]);
        toast.success('Asset created successfully');
      } else if (editingAsset.id) {
        const { isNew, ...assetData } = editingAsset;
        const payload = {
          ...assetData,
          compatibility: getCompatibilityIds(editingAsset),
        };
        const updatedAssetData = await updateAsset(editingAsset.id, payload);
        setAssets(assets.map((a) => (a.id === editingAsset.id ? updatedAssetData : a)));
        toast.success('Asset updated successfully');
      }

      setIsModalOpen(false);
      setEditingAsset(null);
    } catch (error) {
      toast.error('Failed to save asset');
      console.error('Error saving asset:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVehicleCompatibility = (vehicleId: string) => {
    if (!editingAsset) return;

    const compatibilityIds = getCompatibilityIds(editingAsset);
    const compatibility = compatibilityIds.includes(vehicleId)
      ? compatibilityIds.filter((id) => id !== vehicleId)
      : [...compatibilityIds, vehicleId];

    setEditingAsset({
      ...editingAsset,
      compatibility,
    });
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-96">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={handleAddAsset} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Asset
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={!filterCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory('')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Assets Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="text-5xl">{asset.image}</div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAsset(asset)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {asset.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    categoryColors[asset.category]
                  }`}
                >
                  {asset.category}
                </span>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-2xl font-bold text-primary">
                  ${asset.price.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Compatible with {asset.compatibility.length} vehicle
                  {asset.compatibility.length !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-1">
                  {asset.compatibility.map((vehicleId) => {
                    const compatibilityId = typeof vehicleId === 'string' ? vehicleId : vehicleId.id;
                    const compatibilityName = typeof vehicleId === 'string' ? vehicles.find((v) => v.id === vehicleId)?.name : vehicleId.name;
                    return (
                      <span
                        key={compatibilityId}
                        className="text-xs bg-muted text-foreground px-2 py-1 rounded"
                      >
                        {compatibilityName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Asset Modal */}
      {isModalOpen && editingAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingAsset.isNew ? 'Add Asset' : 'Edit Asset'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAsset(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={editingAsset.name}
                  onChange={(e) =>
                    setEditingAsset({ ...editingAsset, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Metallic Sapphire Blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={editingAsset.category}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      category: e.target.value as CustomizationAsset['category'],
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary capitalize"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={editingAsset.image}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      image: e.target.value.slice(0, 2),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-2xl"
                  placeholder="🎨"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={editingAsset.description}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="Asset description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={editingAsset.price}
                  onChange={(e) =>
                    setEditingAsset({
                      ...editingAsset,
                      price: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Vehicle Compatibility
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <label
                      key={vehicle.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={getCompatibilityIds(editingAsset).includes(vehicle.id)}
                        onChange={() => toggleVehicleCompatibility(vehicle.id)}
                        className="w-4 h-4 rounded border-border cursor-pointer"
                      />
                      <span className="text-foreground text-sm">{vehicle.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAsset(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveAsset} 
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Asset
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
