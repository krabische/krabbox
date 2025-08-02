import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LuggageListing {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  description: string;
  images: string[];
  category: 'carry-on' | 'medium' | 'large' | 'extra-large' | 'backpack' | 'duffel' | 'other';
  type: 'hardside' | 'softside' | 'hybrid';
  size: {
    height: number;
    width: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  features: string[];
  condition: 'new' | 'excellent' | 'good' | 'fair';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  availability: {
    available: boolean;
    minRentalDays: number;
    maxRentalDays: number;
  };
  pricing: {
    dailyRate: number;
    weeklyRate?: number;
    monthlyRate?: number;
    securityDeposit: number;
    sellPrice?: number;
    isForSale: boolean;
    isForRent: boolean;
  };
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ListingsContextType {
  listings: LuggageListing[];
  userListings: LuggageListing[];
  addListing: (listing: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => void;
  updateListing: (id: string, updates: Partial<LuggageListing>) => void;
  deleteListing: (id: string) => void;
  getListingById: (id: string) => LuggageListing | undefined;
  searchListings: (filters: SearchFilters) => LuggageListing[];
}

interface SearchFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dateRange?: { start: string; end: string };
  features?: string[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<LuggageListing[]>([
    // Mock featured listings for initial display
    {
      id: '1',
      hostId: 'host1',
      hostName: 'Sarah M.',
      title: 'Premium Hardside Carry-On',
      description: 'Professional grade hardside carry-on with TSA lock. Perfect for business travel.',
      images: ['/placeholder.svg'],
      category: 'carry-on',
      type: 'hardside',
      size: { height: 56, width: 35, depth: 23, unit: 'cm' },
      weight: 3.2,
      features: ['TSA Lock', '4 Wheels', 'Hard Shell', 'Expandable'],
      condition: 'excellent',
      location: {
        address: '123 Downtown St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 30
      },
      pricing: {
        dailyRate: 12,
        weeklyRate: 70,
        monthlyRate: 250,
        securityDeposit: 100,
        isForSale: false,
        isForRent: true
      },
      rules: ['No smoking', 'Return in same condition', 'Report any damage immediately'],
      rating: 4.9,
      reviewCount: 127,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const getUserListings = (userId: string): LuggageListing[] => {
    return listings.filter(listing => listing.hostId === userId);
  };

  const addListing = (listingData: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => {
    const newListing: LuggageListing = {
      ...listingData,
      id: Math.random().toString(36).substr(2, 9),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<LuggageListing>) => {
    setListings(prev =>
      prev.map(listing =>
        listing.id === id
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing
      )
    );
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const getListingById = (id: string): LuggageListing | undefined => {
    return listings.find(listing => listing.id === id);
  };

  const searchListings = (filters: SearchFilters): LuggageListing[] => {
    return listings.filter(listing => {
      if (filters.category && listing.category !== filters.category) return false;
      if (filters.location && !listing.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minPrice && listing.pricing.dailyRate < filters.minPrice) return false;
      if (filters.maxPrice && listing.pricing.dailyRate > filters.maxPrice) return false;
      return true;
    });
  };

  // Get user-specific listings (requires auth context)
  const userListings = getUserListings('current-user-id'); // This would use actual user ID from auth context

  const value = {
    listings,
    userListings,
    addListing,
    updateListing,
    deleteListing,
    getListingById,
    searchListings
  };

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}
