import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

export interface LuggageListing {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  description: string;
  images: string[];
  category:
    | "carry-on"
    | "medium"
    | "large"
    | "extra-large"
    | "backpack"
    | "duffel"
    | "garage"
    | "shed"
    | "container"
    | "cell"
    | "large-space"
    | "pantry"
    | "other";
  type: "hardside" | "softside" | "hybrid";
  size: {
    height: number;
    width: number;
    depth: number;
    unit: "cm" | "inches" | "sqm";
  };
  features: string[];
  condition: "new" | "excellent" | "good" | "fair";
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
  addListing: (
    listing: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => Promise<void>;
  updateListing: (id: string, updates: Partial<LuggageListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  getListingById: (id: string) => LuggageListing | undefined;
  searchListings: (filters: SearchFilters) => LuggageListing[];
  isLoading: boolean;
}

interface SearchFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dateRange?: { start: string; end: string };
  features?: string[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<LuggageListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load listings from Supabase
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading listings:', error);
        return;
      }

      if (data) {
        const formattedListings: LuggageListing[] = data.map((item: any) => ({
          id: item.id,
          hostId: item.host_id,
          hostName: item.host_name,
          title: item.title,
          description: item.description,
          images: item.images || [],
          category: item.category,
          type: item.type,
          size: item.size,
          features: item.features || [],
          condition: item.condition,
          location: item.location,
          availability: item.availability,
          pricing: item.pricing,
          rating: item.rating || 0,
          reviewCount: item.review_count || 0,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
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
    return listings.filter((listing) => listing.hostId === userId);
  };

  const addListing = async (
    listingData: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to create a listing');
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            host_id: user.id,
            host_name: `${user.firstName} ${user.lastName}`,
            title: listingData.title,
            description: listingData.description,
            images: listingData.images,
            category: listingData.category,
            type: listingData.type,
            size: listingData.size,
            features: listingData.features,
            condition: listingData.condition,
            location: listingData.location,
            availability: listingData.availability,
            pricing: listingData.pricing,
            rating: 0,
            review_count: 0,
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const newListing: LuggageListing = {
          id: data.id,
          hostId: data.host_id,
          hostName: data.host_name,
          title: data.title,
          description: data.description,
          images: data.images || [],
          category: data.category,
          type: data.type,
          size: data.size,
          features: data.features || [],
          condition: data.condition,
          location: data.location,
          availability: data.availability,
          pricing: data.pricing,
          rating: data.rating || 0,
          reviewCount: data.review_count || 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        setListings((prev) => [newListing, ...prev]);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      throw error;
    }
  };

  const updateListing = async (id: string, updates: Partial<LuggageListing>) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing,
        ),
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  };

  const getListingById = (id: string): LuggageListing | undefined => {
    return listings.find((listing) => listing.id === id);
  };

  const searchListings = (filters: SearchFilters): LuggageListing[] => {
    return listings.filter((listing) => {
      if (filters.category && listing.category !== filters.category)
        return false;
      if (
        filters.location &&
        !listing.location.city
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      )
        return false;
      if (filters.minPrice && listing.pricing.dailyRate < filters.minPrice)
        return false;
      if (filters.maxPrice && listing.pricing.dailyRate > filters.maxPrice)
        return false;
      return true;
    });
  };

  // Get user-specific listings
  const userListings = user ? getUserListings(user.id) : [];

  const value = {
    listings,
    userListings,
    addListing,
    updateListing,
    deleteListing,
    getListingById,
    searchListings,
    isLoading,
  };

  return (
    <ListingsContext.Provider value={value}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
