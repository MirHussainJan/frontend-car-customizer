'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
import { ChevronLeft, ChevronRight, Heart, Share2, Download, RotateCw, Loader2 } from 'lucide-react';
import { getVehicleById, getBrandById, getAllAssets } from '@/lib/api';
import { Vehicle, Brand, CustomizationAsset } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface VehicleDetailProps {
  vehicleId: string;
}

export function VehicleDetail({ vehicleId }: VehicleDetailProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [assets, setAssets] = useState<CustomizationAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#C41E3A');
  const [selectedWheels, setSelectedWheels] = useState('premium-alloy');
  const [selectedSpoiler, setSelectedSpoiler] = useState('sport');
  const [modelRotation, setModelRotation] = useState(0);
  
  // 3D Model states
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [wheelMaterials, setWheelMaterials] = useState<any[]>([]);
  const [spoilerMaterials, setSpoilerMaterials] = useState<any[]>([]);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState(0);
  const [selectedSpoilerIndex, setSelectedSpoilerIndex] = useState(-1);
  const [modelSrc, setModelSrc] = useState<string | null>(null);
  
  const modelViewerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadVehicleData();
  }, [vehicleId]);

  const loadVehicleData = async () => {
    try {
      setIsLoading(true);
      const vehicleData = await getVehicleById(vehicleId);
      setVehicle(vehicleData);
      
      // Load the 3D model from the vehicle's modelUrl
      if (vehicleData.modelUrl) {
        // If modelUrl is a relative path, prepend the backend base URL (without /api)
        const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL 
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
          : 'http://localhost:5000';
        const modelUrl = vehicleData.modelUrl.startsWith('http') 
          ? vehicleData.modelUrl 
          : `${backendBaseUrl}${vehicleData.modelUrl}`;
        
        console.log('Loading model from:', modelUrl);
        
        // Verify the URL is a GLB file
        if (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf')) {
          setModelSrc(modelUrl);
        } else {
          console.warn('Invalid model URL - not a GLB/GLTF file:', modelUrl);
          toast.error('Invalid 3D model format');
        }
      }
      
      if (vehicleData.brandId) {
        const brandData = await getBrandById(vehicleData.brandId);
        setBrand(brandData);
      }
      
      const assetsData = await getAllAssets();
      setAssets(assetsData);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      console.error('Error loading vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const paintColors = [
    { name: 'Racing Red', hex: '#C41E3A' },
    { name: 'Midnight Black', hex: '#1a1a1a' },
    { name: 'Glacier White', hex: '#f5f5f5' },
    { name: 'Ocean Blue', hex: '#0066cc' },
    { name: 'Silver Storm', hex: '#c0c0c0' },
    { name: 'Gold Metallic', hex: '#ffd700' },
  ];

  const wheels = [
    { id: 'premium-alloy', name: 'Premium Alloy', price: 2500 },
    { id: 'carbon-fiber', name: 'Carbon Fiber', price: 4200 },
    { id: 'forged-light', name: 'Forged Lightweight', price: 3800 },
    { id: 'classic-chrome', name: 'Classic Chrome', price: 1800 },
  ];

  const spoilers = [
    { id: 'none', name: 'None', price: 0 },
    { id: 'sport', name: 'Sport', price: 1200 },
    { id: 'racing', name: 'Racing Pro', price: 2500 },
    { id: 'carbon-race', name: 'Carbon Racing', price: 3800 },
  ];

  // Helper functions for 3D model manipulation
  const extractNumber = (name: string) => {
    const m = String(name || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
  };

  const setMaterialVisible = (mat: any, visible: boolean) => {
    if (!mat) return;
    const rgba = visible ? [1, 1, 1, 1] : [1, 1, 1, 0];
    if (mat.setAlphaMode) mat.setAlphaMode(visible ? 'OPAQUE' : 'BLEND');
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  };

  const showOnly = (arr: any[], indexToShow: number) => {
    arr.forEach((m, i) => setMaterialVisible(m, i === indexToShow));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file);
      setModelSrc(url);
      setSelectedMaterialIndex(0);
      setWheelMaterials([]);
      setSpoilerMaterials([]);
      setSelectedWheelIndex(0);
      setSelectedSpoilerIndex(-1);
    }
  };

  const selectWheel = (index: number) => {
    if (!wheelMaterials.length || index < 0 || index >= wheelMaterials.length) return;
    showOnly(wheelMaterials, index);
    setSelectedWheelIndex(index);
    console.log('Wheel selected:', wheelMaterials[index]?.name);
  };

  const selectSpoilerNone = () => {
    spoilerMaterials.forEach(m => setMaterialVisible(m, false));
    setSelectedSpoilerIndex(-1);
    console.log('Spoiler: None');
  };

  const selectSpoilerByIndex = (index: number) => {
    if (!spoilerMaterials.length || index < 0 || index >= spoilerMaterials.length) return;
    showOnly(spoilerMaterials, index);
    setSelectedSpoilerIndex(index);
    console.log('Spoiler selected:', spoilerMaterials[index]?.name);
  };

  const changeColor = (index: number, color: any) => {
    if (materials.length === 0 || index < 0 || index >= materials.length) return;
    
    // Convert hex color string to RGBA array if needed
    if (typeof color === 'string') {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        color = [r / 255, g / 255, b / 255, 1];
      } else {
        color = [1, 1, 1, 1];
      }
    }
    
    materials[index].pbrMetallicRoughness.setBaseColorFactor(color);
  };

  const resetColor = (index: number) => {
    changeColor(index, [1, 1, 1, 1]); // White multiplier (original color)
  };

  const resetAllColors = () => {
    materials.forEach((material) => {
      material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
    });
  };

  // Load model materials when model loads
  useEffect(() => {
    console.log('🎯 useEffect triggered, modelSrc:', modelSrc);
    
    if (!modelSrc) {
      console.log('❌ No modelSrc, skipping');
      return;
    }
    
    let isMounted = true;
    let listenerAttached = false;
    
    const handleLoad = (modelViewer: any) => {
      console.log('🔍 Model loaded! Inspecting GLB structure...');
      console.log('📦 ModelViewer:', modelViewer);
      console.log('🎨 Model:', modelViewer.model);
      console.log('🔧 Model properties:', Object.keys(modelViewer.model || {}));
      
      const loadedMaterials = modelViewer.model.materials || [];
      console.log('🎨 Total materials count:', loadedMaterials.length);
      console.log('📋 All materials:', loadedMaterials);
      console.log('📝 Material names:', loadedMaterials.map((m: any) => m.name));
      
      if (isMounted) {
        setMaterials(loadedMaterials);
        
        const wheels = loadedMaterials
          .filter((m: any) => /wheel/i.test(m.name))
          .sort((a: any, b: any) => extractNumber(a.name) - extractNumber(b.name));
        const spoilers = loadedMaterials
          .filter((m: any) => /spoiler/i.test(m.name))
          .sort((a: any, b: any) => extractNumber(a.name) - extractNumber(b.name));
        
        setWheelMaterials(wheels);
        setSpoilerMaterials(spoilers);
        console.log(`🎡 Wheels found (${wheels.length}):`, wheels.map((m: any) => m.name));
        console.log(`🚗 Spoilers found (${spoilers.length}):`, spoilers.map((m: any) => m.name));
        
        if (loadedMaterials.length > 0) {
          setSelectedMaterialIndex(0);
          console.log('✅ First material selected:', loadedMaterials[0].name);
        } else {
          console.warn('⚠️ No materials found in the GLB model!');
        }

        if (wheels.length) {
          showOnly(wheels, 0);
          setSelectedWheelIndex(0);
          console.log('✅ Initial wheel set to:', wheels[0].name);
        }
        if (spoilers.length) {
          spoilers.forEach((m: any) => setMaterialVisible(m, false));
          setSelectedSpoilerIndex(-1);
          console.log('✅ All spoilers hidden initially');
        }
      }
    };
    
    // Try to attach listener with retries
    const tryAttachListener = (attempt = 1, maxAttempts = 10) => {
      if (!isMounted) return;
      
      const modelViewer = modelViewerRef.current;
      console.log(`🔍 Attempt ${attempt}/${maxAttempts} - ModelViewer ref:`, modelViewer);
      
      if (modelViewer) {
        console.log('✅ ModelViewer ref exists, attaching load listener...');
        
        const loadHandler = () => handleLoad(modelViewer);
        modelViewer.addEventListener('load', loadHandler);
        listenerAttached = true;
        console.log('📡 Load event listener attached');
        
        // Check if model is already loaded
        if (modelViewer.loaded) {
          console.log('⚡ Model already loaded, triggering handleLoad immediately');
          handleLoad(modelViewer);
        }
        
        return () => {
          console.log('🧹 Cleanup: removing load listener');
          modelViewer.removeEventListener('load', loadHandler);
        };
      } else if (attempt < maxAttempts) {
        console.log(`⏳ ModelViewer ref not ready yet, will retry in ${attempt * 50}ms...`);
        setTimeout(() => tryAttachListener(attempt + 1, maxAttempts), attempt * 50);
      } else {
        console.error('❌ Failed to attach listener after', maxAttempts, 'attempts');
      }
    };
    
    const cleanup = tryAttachListener();
    
    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [modelSrc]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle || !brand) {
    return <div className="text-center py-20 text-muted-foreground">Vehicle not found</div>;
  }

  const wheelPrice = wheels.find(w => w.id === selectedWheels)?.price || 0;
  const spoilerPrice = spoilers.find(s => s.id === selectedSpoiler)?.price || 0;
  const totalPrice = vehicle.basePrice + wheelPrice + spoilerPrice;

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-foreground">{brand.name}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{vehicle.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* 3D Customizer Section */}
          <div className="space-y-4">
            <div className="relative h-96 lg:h-[500px] rounded-xl border border-border bg-card overflow-hidden">
              {modelSrc ? (
                <model-viewer
                  ref={modelViewerRef}
                  src={modelSrc}
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  tone-mapping="neutral"
                  shadow-intensity="1"
                  className="w-full h-full"
                  style={{ '--poster-color': 'transparent' }}
                >
                  <div className="progress-bar hide" slot="progress-bar">
                    <div className="update-bar bg-primary h-2 rounded-full"></div>
                  </div>
                  <Button
                    slot="ar-button"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                  >
                    View in AR
                  </Button>
                </model-viewer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
                  <div
                    className="relative z-10 text-7xl transition-transform duration-300 select-none cursor-grab active:cursor-grabbing"
                    style={{ transform: `rotateY(${modelRotation}deg)` }}
                  >
                    {brand.logo}
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="relative z-10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Upload 3D Model (.glb/.gltf)
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {/* Navigation Arrows for fallback */}
                  <button
                    onClick={() => setModelRotation(prev => prev - 15)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground transition-colors z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setModelRotation(prev => prev + 15)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground transition-colors z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setModelRotation(0)}
                    className="absolute bottom-4 left-4 p-2 rounded-lg bg-background border border-border hover:bg-muted text-foreground transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">Engine</p>
                <p className="font-semibold text-foreground">{vehicle.engine}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">Top Speed</p>
                <p className="font-semibold text-foreground">{vehicle.topSpeed} mph</p>
              </div>
            </div>
          </div>

          {/* Details and Customization */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-primary font-semibold mb-1">{brand.name}</p>
                  <h1 className="text-4xl font-bold text-foreground">{vehicle.name}</h1>
                </div>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                    }`}
                  />
                </button>
              </div>
              <div className="flex gap-4">
                <p className="text-3xl font-bold text-primary">${((vehicle.basePrice || vehicle.price || 0) / 1000).toFixed(0)}K</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-border bg-transparent">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border bg-transparent">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">Horsepower</p>
                <p className="text-2xl font-bold text-foreground">{vehicle.specs?.horsepower || vehicle.horsepower || 0}</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">0-60 mph</p>
                <p className="text-2xl font-bold text-foreground">{vehicle.specs?.zeroToSixty || vehicle.acceleration || 0}s</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">Torque</p>
                <p className="text-2xl font-bold text-foreground">{vehicle.specs?.torque || vehicle.torque || 0} lb-ft</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">Top Speed</p>
                <p className="text-2xl font-bold text-foreground">{vehicle.topSpeed || 0} mph</p>
              </div>
            </div>

            {/* Customization Tabs */}
            <Tabs defaultValue="paint" className="w-full">
              <TabsList className="w-full bg-card border border-border">
                <TabsTrigger value="paint" className="flex-1">Paint</TabsTrigger>
                <TabsTrigger value="wheels" className="flex-1">Wheels</TabsTrigger>
                <TabsTrigger value="spoiler" className="flex-1">Spoiler</TabsTrigger>
              </TabsList>

              {/* Paint Colors */}
              <TabsContent value="paint" className="space-y-4 mt-4">
                {materials.length > 0 && modelSrc ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Part:</label>
                      <select
                        value={selectedMaterialIndex}
                        onChange={(e) => setSelectedMaterialIndex(parseInt(e.target.value))}
                        className="w-full p-2 border rounded-md bg-background"
                      >
                        {materials.map((material, index) => (
                          <option key={index} value={index}>
                            {material.name || `Material ${index}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Choose Color:</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="color"
                          onChange={(e) => {
                            changeColor(selectedMaterialIndex, e.target.value);
                            setSelectedColor(e.target.value);
                          }}
                          className="w-12 h-12 cursor-pointer rounded border"
                        />
                        <Button
                          onClick={() => {
                            resetAllColors();
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Reset All
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {paintColors.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => {
                            changeColor(selectedMaterialIndex, color.hex);
                            setSelectedColor(color.hex);
                          }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedColor === color.hex
                              ? 'border-primary bg-card'
                              : 'border-border hover:border-primary/50 bg-card/50'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-md mb-2 border border-border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <p className="text-xs font-semibold text-foreground">{color.name}</p>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {paintColors.map(color => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color.hex)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedColor === color.hex
                            ? 'border-primary bg-card'
                            : 'border-border hover:border-primary/50 bg-card/50'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-md mb-2 border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-semibold text-foreground">{color.name}</p>
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Wheels */}
              <TabsContent value="wheels" className="space-y-4 mt-4">
                {wheelMaterials.length > 0 && modelSrc ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Select from detected wheel options:</p>
                    <div className="space-y-3">
                      {wheelMaterials.map((wheel, index) => (
                        <button
                          key={wheel.name || index}
                          onClick={() => selectWheel(index)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            selectedWheelIndex === index
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 bg-card/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">{wheel.name || `Wheel ${index + 1}`}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {wheels.map(wheel => (
                      <button
                        key={wheel.id}
                        onClick={() => setSelectedWheels(wheel.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedWheels === wheel.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-card/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{wheel.name}</p>
                          <p className="text-primary font-bold">${wheel.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Spoiler */}
              <TabsContent value="spoiler" className="space-y-4 mt-4">
                {spoilerMaterials.length > 0 && modelSrc ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Select from detected spoiler options:</p>
                    <div className="space-y-3">
                      <button
                        onClick={selectSpoilerNone}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedSpoilerIndex === -1
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-card/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">None</p>
                        </div>
                      </button>
                      {spoilerMaterials.map((spoiler, index) => (
                        <button
                          key={spoiler.name || index}
                          onClick={() => selectSpoilerByIndex(index)}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            selectedSpoilerIndex === index
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 bg-card/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-foreground">{spoiler.name || `Spoiler ${index + 1}`}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {spoilers.map(spoiler => (
                      <button
                        key={spoiler.id}
                        onClick={() => setSelectedSpoiler(spoiler.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedSpoiler === spoiler.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50 bg-card/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{spoiler.name}</p>
                          <p className="text-primary font-bold">${spoiler.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Price Summary and CTA */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle Base</span>
                  <span className="text-foreground font-semibold">${(vehicle.price / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Wheels</span>
                  <span className="text-foreground font-semibold">${(wheelPrice / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spoiler</span>
                  <span className="text-foreground font-semibold">${(spoilerPrice / 1000).toFixed(1)}K</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${(totalPrice / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full border-border bg-transparent">
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
