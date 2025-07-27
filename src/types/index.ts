export interface User {
  id: string;
  name: string;
  email: string;
  type: 'generator' | 'recycler' | 'upcycler' | 'energy_expert';
  company?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  avatar?: string;
  rating: number;
  verified: boolean;
  joinedDate: Date;
  completedProjects: number;
  certifications: string[];
  description?: string;
  website?: string;
  phone?: string;
}

export interface WasteListing {
  id: string;
  title: string;
  description: string;
  category: WasteCategory;
  quantity: number;
  unit: string;
  location: string;
  images: string[];
  generator: User;
  price?: number;
  availableFrom: Date;
  tags: string[];
  status: 'available' | 'pending' | 'collected';
  coordinates?: {
    lat: number;
    lng: number;
  };
  environmentalImpact?: {
    co2Saved: number;
    wasteReduced: number;
  };
}

export interface ServiceProvider {
  id: string;
  user: User;
  services: string[];
  specializations: string[];
  capacity: string;
  certifications: string[];
  portfolio: PortfolioItem[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export type WasteCategory = 
  | 'plastic'
  | 'metal'
  | 'paper'
  | 'glass'
  | 'electronic'
  | 'organic'
  | 'textile'
  | 'construction'
  | 'hazardous'
  | 'other';

export interface Connection {
  id: string;
  wasteListing: WasteListing;
  provider: ServiceProvider;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed';
  proposedPrice?: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedCompletion?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  connectionId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: string[];
}

export interface AnalyticsData {
  totalWasteProcessed: number;
  co2Saved: number;
  activeConnections: number;
  monthlyGrowth: number;
  wasteByCategory: { category: string; amount: number; percentage: number }[];
  monthlyStats: { month: string; waste: number; co2: number; connections: number }[];
  topProviders: { name: string; projects: number; rating: number }[];
  environmentalImpact: {
    treesEquivalent: number;
    energySaved: number;
    landfillDiverted: number;
  };
}