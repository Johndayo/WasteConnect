export interface User {
  id: string;
  name: string;
  email: string;
  type: 'generator' | 'recycler' | 'upcycler' | 'energy_expert';
  company?: string;
  location: string;
  avatar?: string;
  rating: number;
  verified: boolean;
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
}