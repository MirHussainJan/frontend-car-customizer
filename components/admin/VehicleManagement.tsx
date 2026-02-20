'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vehicle, Brand } from '@/lib/types';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, uploadVehicleModel, getAllBrands } from '@/lib/api';
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Upload,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface EditingVehicle extends Partial<Vehicle> {
  isNew?: boolean;
}

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<EditingVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || 'Unknown';
  };

  const handleAddVehicle = () => {
    setEditingVehicle({
      name: '',
      brandId: brands[0]?.id || '',
      vehicleModel: '',
      year: new Date().getFullYear(),
      basePrice: 0,
      modelUrl: '',
      thumbnail: '🏎️',
      description: '',
      specs: {
        engine: '',
        horsepower: 0,
        torque: 0,
        zeroToSixty: 0,
      },
      isNew: true,
    });
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        setVehicles(vehicles.filter((v) => v.id !== id));
        toast.success('Vehicle deleted successfully');
      } catch (error) {
        toast.error('Failed to delete vehicle');
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleSaveVehicle = async () => {
    if (!editingVehicle) return;

    try {
      setIsSaving(true);
      
      let modelUrl = editingVehicle.modelUrl || '';
      
      // Upload file if selected
      if (selectedFile) {
        setUploadProgress(10);
        const uploadResponse = await uploadVehicleModel(selectedFile);
        modelUrl = uploadResponse.modelUrl;
        setUploadProgress(100);
      }

      if (editingVehicle.isNew) {
        const { isNew, id, createdAt, updatedAt, ...vehicleData } = editingVehicle;
        const newVehicle = await createVehicle({
          ...vehicleData,
          modelUrl,
        } as Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>);
        setVehicles([...vehicles, newVehicle]);
        toast.success('Vehicle created successfully');
      } else if (editingVehicle.id) {
        const { isNew, ...vehicleData } = editingVehicle;
        const updatedVehicleData = await updateVehicle(editingVehicle.id, {
          ...vehicleData,
          modelUrl,
        });
        setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? updatedVehicleData : v)));
        toast.success('Vehicle updated successfully');
      }

      setIsModalOpen(false);
      setEditingVehicle(null);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to save vehicle');
      console.error('Error saving vehicle:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setEditingVehicle({
      ...editingVehicle!,
      modelUrl: file.name,
    });
  };

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-96">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button onClick={handleAddVehicle} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Vehicles Table */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Model
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Base Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Horsepower
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{vehicle.thumbnail}</span>
                      <div>
                        <p className="font-semibold text-foreground">
                          {vehicle.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.modelUrl.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{getBrandName(vehicle.brandId)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{vehicle.vehicleModel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{vehicle.year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">
                      ${vehicle.basePrice.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">
                      {vehicle.specs.horsepower}hp
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}

      {/* Vehicle Modal */}
      {isModalOpen && editingVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingVehicle.isNew ? 'Add Vehicle' : 'Edit Vehicle'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingVehicle(null);
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  value={editingVehicle.name}
                  onChange={(e) =>
                    setEditingVehicle({ ...editingVehicle, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Apex GT-R"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brand
                  </label>
                  <select
                    value={editingVehicle.brandId}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        brandId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.vehicleModel}
                    onChange={(e) =>
                      setEditingVehicle({ ...editingVehicle, vehicleModel: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., GT-R Premium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.year}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        year: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={editingVehicle.basePrice}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        basePrice: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  3D Model File (.glb)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted transition-colors">
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="model-upload"
                  />
                  <label htmlFor="model-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : editingVehicle.modelUrl
                        ? editingVehicle.modelUrl.split('/').pop()
                        : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      GLB/GLTF files only (max 50MB)
                    </span>
                  </label>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                {uploadProgress === 100 && (
                  <p className="text-xs text-green-500 mt-2">Upload complete!</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={editingVehicle.description}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="Vehicle description..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground">Specifications</h3>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Engine
                  </label>
                  <input
                    type="text"
                    value={editingVehicle.specs.engine}
                    onChange={(e) =>
                      setEditingVehicle({
                        ...editingVehicle,
                        specs: { ...editingVehicle.specs, engine: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Twin-Turbo V6"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Horsepower
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.specs.horsepower}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: {
                            ...editingVehicle.specs,
                            horsepower: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Torque
                    </label>
                    <input
                      type="number"
                      value={editingVehicle.specs.torque}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: {
                            ...editingVehicle.specs,
                            torque: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      0-60 (sec)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingVehicle.specs.zeroToSixty}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: {
                            ...editingVehicle.specs,
                            zeroToSixty: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-border pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingVehicle(null);
                  setSelectedFile(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveVehicle} 
                className="flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Vehicle
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
