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
  isDeleted?: boolean;
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
      // First, load all listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('listing')
        .select('*')
        .order('created_at', { ascending: false });

      if (listingsError) {
        console.error('Error loading listings:', listingsError);
        return;
      }

      if (listingsData) {
        // Load all images for all listings
        const { data: imagesData, error: imagesError } = await supabase
          .from('listing_images')
          .select('*')
          .order('order_index', { ascending: true });

        if (imagesError) {
          console.error('Error loading images:', imagesError);
        }

        // Create a map of listing_id to images
        const imagesMap = new Map();
        if (imagesData) {
          imagesData.forEach((imageRecord: any) => {
            if (!imagesMap.has(imageRecord.listing_id)) {
              imagesMap.set(imageRecord.listing_id, []);
            }
            imagesMap.get(imageRecord.listing_id).push(imageRecord.image_url);
          });
        }

        const formattedListings: LuggageListing[] = listingsData.map((item: any) => {
          // Get images for this listing, fallback to main image_url if no images in listing_images
          const listingImages = imagesMap.get(item.id) || [];
          const images = listingImages.length > 0 ? listingImages : (item.image_url ? [item.image_url] : ['/placeholder.svg']);

          // Get user info for host name
          const hostName = item.host_name || 'Unknown Host';
          
          // Get square meters - try different possible field names
          const squareMeters = item.square_meters || item.square_meters || item.area || 1;

          return {
            id: item.id.toString(),
            hostId: item.owner_id,
            hostName: hostName,
            title: item.title,
            description: item.description,
            images: images,
            category: 'carry-on', // Default since we don't have category
            type: 'hardside', // Default since we don't have type
            size: { 
              height: parseFloat(squareMeters) || 1, 
              width: parseFloat(squareMeters) || 1, 
              depth: 1, 
              unit: 'sqm' 
            },
            features: [], // Default since we don't have features
            condition: 'excellent', // Default since we don't have condition
            location: {
              address: '',
              city: item.location,
              state: '',
              zipCode: ''
            },
            availability: {
              available: true,
              minRentalDays: 1,
              maxRentalDays: 30
            },
            pricing: {
              dailyRate: item.price,
              securityDeposit: 50,
              isForSale: false,
              isForRent: true
            },
            rating: 0,
            reviewCount: 0,
            createdAt: item.created_at,
            updatedAt: item.created_at,
            isDeleted: item.is_deleted || false
          };
        });

        setListings(formattedListings);
        console.log('Loaded listings from Supabase:', formattedListings);
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
      console.log('Starting to add listing with data:', listingData);
      
      // Prepare data for Supabase
      const supabaseData = {
        title: listingData.title,
        description: listingData.description,
        price: listingData.pricing.dailyRate,
        location: listingData.location.city,
        image_url: listingData.images[0] || '/placeholder.svg', // Keep main image for backward compatibility
        owner_id: listingData.hostId,
        host_name: listingData.hostName, // Save host name
        square_meters: listingData.size.height // Save square meters
      };
      
      console.log('Data to insert into Supabase:', supabaseData);

      // Save to Supabase first
      const { data, error } = await supabase
        .from('listing')
        .insert([supabaseData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw new Error(`Supabase error: ${error.message}`);
      }

      console.log('Supabase response:', data);

      // Save images to listing_images table
      if (listingData.images.length > 0) {
        const imageRecords = listingData.images.map((imageUrl, index) => ({
          listing_id: data.id,
          image_url: imageUrl,
          order_index: index
        }));

        const { error: imagesError } = await supabase
          .from('listing_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error saving images to listing_images:', imagesError);
          // Don't throw error here, as the listing was already created
        } else {
          console.log('Successfully saved images to listing_images table');
        }
      }

      // Create local listing object
      const newListing: LuggageListing = {
        ...listingData,
        id: data.id.toString(),
        rating: 0,
        reviewCount: 0,
        createdAt: data.created_at,
        updatedAt: data.created_at
      };

      setListings(prev => [newListing, ...prev]);
      
      console.log('Successfully saved listing to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error adding listing:', error);
      console.error('Error type:', typeof error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
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
