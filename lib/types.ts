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

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface CartCustomization {
  assetId: string;
  assetName: string;
  assetCategory: string;
  assetPrice: number;
}

export interface CartItem {
  vehicleId: string;
  vehicleName: string;
  vehicleModel: string;
  brandName: string;
  thumbnail: string;
  basePrice: number;
  customizations: CartCustomization[];
  customizationTotal: number;
  itemTotal: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string | { _id: string; name: string; email: string };
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  notes?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  statusCounts: Record<OrderStatus, number>;
  totalRevenue: number;
  totalOrders: number;
  recentOrders: Order[];
}
