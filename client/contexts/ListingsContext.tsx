import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

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
    unit: 'cm' | 'inches' | 'sqm';
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
  addListing: (listing: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Promise<void>;
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
  const [listings, setListings] = useState<LuggageListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [userListings, setUserListings] = useState<LuggageListing[]>([]);

  // Load listings from Supabase
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading listings:', error);
        return;
      }

      if (data) {
        const formattedListings: LuggageListing[] = data.map((item: any) => ({
          id: item.id,
          hostId: item.host_id,
          hostName: item.host_name || 'Unknown Host',
          title: item.title,
          description: item.description,
          images: item.images || ['/placeholder.svg'],
          category: item.category,
          type: item.type,
          size: item.size,
          features: item.features || [],
          condition: item.condition,
          location: item.location,
          availability: {
            available: item.is_available,
            minRentalDays: 1,
            maxRentalDays: 30
          },
          pricing: item.pricing,
          rating: item.rating || 0,
          reviewCount: item.review_count || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));

        setListings(formattedListings);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserListings = (userId: string): LuggageListing[] => {
    return listings.filter(listing => listing.hostId === userId);
  };

  useEffect(() => {
    if (user?.id) {
      setUserListings(getUserListings(user.id));
    } else {
      setUserListings([]);
    }
  }, [user, listings]);

  const addListing = async (listingData: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            host_id: listingData.hostId,
            host_name: listingData.hostName,
            title: listingData.title,
            description: listingData.description,
            images: listingData.images,
            category: listingData.category,
            type: listingData.type,
            size: listingData.size,
            features: listingData.features,
            condition: listingData.condition,
            location: listingData.location,
            pricing: listingData.pricing,
            is_available: listingData.availability.available,
            rating: 0,
            review_count: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding listing:', error);
        throw error;
      }

      if (data) {
        const newListing: LuggageListing = {
          ...listingData,
          id: data.id,
          rating: 0,
          reviewCount: 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setListings(prev => [newListing, ...prev]);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
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
