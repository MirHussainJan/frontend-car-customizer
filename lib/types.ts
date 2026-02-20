export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: number;
  foundedYear?: number;
  country: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  brandId: string;
  vehicleModel: string; // Changed from 'model' to match backend
  year: number;
  basePrice: number;
  price?: number;
  modelUrl: string;
  thumbnail: string;
  description: string;
  engine?: string;
  horsepower?: number;
  torque?: number;
  acceleration?: number;
  topSpeed?: number;
  specs: {
    engine: string;
    horsepower: number;
    torque: number;
    zeroToSixty: number;
  };
  createdAt: Date;
  // Custom 3D model support
  customModelUrl?: string;
  customizations?: {
    colors?: Record<string, string>;
    selectedWheel?: number;
    selectedSpoiler?: number;
  };
}

export interface CustomizationAsset {
  id: string;
  name: string;
  category: 'paint' | 'wheels' | 'interior' | 'exterior' | 'performance';
  description: string;
  price: number;
  image: string;
  compatibility: string[];
  createdAt: Date;
}

export interface DashboardMetrics {
  totalBrands: number;
  totalVehicles: number;
  totalAssets: number;
  totalRevenue: number;
  monthlyGrowth: number;
  customerSatisfaction: number;
}
