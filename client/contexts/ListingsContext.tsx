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
  category: 'garage' | 'shed' | 'pantry' | 'cell' | 'container' | 'large-space';
  type: 'hardside' | 'softside' | 'hybrid';
  size: {
    height: number;
    width: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  area?: number;
  contactNumber?: string;
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
  isArchived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ListingsContextType {
  listings: LuggageListing[];
  userListings: LuggageListing[];
  archivedListings: LuggageListing[];
  addListing: (listing: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<LuggageListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  archiveListing: (id: string) => Promise<void>;
  unarchiveListing: (id: string) => Promise<void>;
  getListingById: (id: string) => LuggageListing | undefined;
  searchListings: (filters: SearchFilters) => LuggageListing[];
  refreshListings: () => Promise<void>;
  isLoading: boolean;
}

interface SearchFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dateRange?: { start: string; end: string };
  features?: string[];
  type?: 'sale' | 'rent' | 'both';
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<LuggageListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load listings from Supabase
  const loadListings = async () => {
    setIsLoading(true);
    try {
      console.log('Loading listings from Supabase...');

      // First check if table exists by doing a simple count query
      const { count, error: countError } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Table access error:', countError.message);
        if (countError.message.includes('relation "public.listings" does not exist')) {
          console.log('Listings table does not exist, using mock data');
          setListings(getMockListings());
          return;
        }
      }

      // If table exists, proceed with full query
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error loading listings:', error.message, error.details, error.hint);
        console.log('Falling back to mock data due to database error');
        // Fallback to mock data if database fails
        setListings(getMockListings());
      } else {
        console.log('Successfully loaded listings from Supabase:', data?.length || 0, 'listings');
        // Transform Supabase data to our interface
        const transformedListings = data?.map(transformSupabaseListing) || [];
        setListings(transformedListings);
      }
    } catch (error) {
      console.error('Unexpected error loading listings:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      console.log('Falling back to mock data due to unexpected error');
      // Fallback to mock data
      setListings(getMockListings());
    } finally {
      setIsLoading(false);
    }
  };

  // Transform Supabase listing to our interface
  const transformSupabaseListing = (data: any): LuggageListing => ({
    id: data.id,
    hostId: data.host_id,
    hostName: data.host_name || 'Anonymous Host',
    title: data.title,
    description: data.description || '',
    images: data.images || ['/placeholder.svg'],
    category: data.category || 'garage',
    type: data.type || 'hardside',
    size: {
      height: data.size_height || 200,
      width: data.size_width || 300,
      depth: data.size_depth || 250,
      unit: data.size_unit || 'cm'
    },
    area: data.area,
    contactNumber: data.contact_number,
    features: data.features || [],
    condition: data.condition || 'good',
    location: {
      address: data.location_address || '',
      city: data.location_city || '',
      state: data.location_state || '',
      zipCode: data.location_zip_code || ''
    },
    availability: {
      available: data.available !== false,
      minRentalDays: data.min_rental_days || 1,
      maxRentalDays: data.max_rental_days || 365
    },
    pricing: {
      dailyRate: data.daily_rate || 10,
      weeklyRate: data.weekly_rate,
      monthlyRate: data.monthly_rate,
      securityDeposit: data.security_deposit || 50,
      sellPrice: data.sell_price,
      isForSale: data.is_for_sale || false,
      isForRent: data.is_for_rent !== false
    },
    rating: data.rating || 0,
    reviewCount: data.review_count || 0,
    isArchived: data.is_archived || false,
    archivedAt: data.archived_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  });

  // Get mock listings for fallback
  const getMockListings = (): LuggageListing[] => [
    {
      id: '1',
      hostId: 'host1',
      hostName: 'Sarah M.',
      title: 'Spacious Garage Storage',
      description: 'Large secure garage with 24/7 access. Perfect for long-term storage of luggage and belongings.',
      images: ['/placeholder.svg'],
      category: 'garage',
      type: 'hardside',
      size: { height: 300, width: 500, depth: 400, unit: 'cm' },
      features: ['24/7 Access', 'Security Camera', 'Climate Controlled', 'Locked'],
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
        maxRentalDays: 365
      },
      pricing: {
        dailyRate: 25,
        weeklyRate: 150,
        monthlyRate: 500,
        securityDeposit: 200,
        isForSale: false,
        isForRent: true
      },
      rating: 4.9,
      reviewCount: 127,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      hostId: 'host2',
      hostName: 'Mike R.',
      title: 'Cozy Storage Shed',
      description: 'Small but secure wooden shed in quiet neighborhood. Great for temporary storage.',
      images: ['/placeholder.svg'],
      category: 'shed',
      type: 'softside',
      size: { height: 200, width: 300, depth: 250, unit: 'cm' },
      features: ['Waterproof', 'Padlock', 'Easy Access', 'Clean'],
      condition: 'good',
      location: {
        address: '456 Suburban Ave',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 90
      },
      pricing: {
        dailyRate: 15,
        weeklyRate: 90,
        monthlyRate: 300,
        securityDeposit: 100,
        isForSale: false,
        isForRent: true
      },
      rating: 4.7,
      reviewCount: 89,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      hostId: 'host3',
      hostName: 'Emma L.',
      title: 'Modern Storage Container',
      description: 'Industrial-grade storage container with advanced security systems. Perfect for valuable items.',
      images: ['/placeholder.svg'],
      category: 'container',
      type: 'hardside',
      size: { height: 250, width: 600, depth: 240, unit: 'cm' },
      features: ['Steel Construction', 'Digital Lock', 'Insurance Included', 'Fire Resistant'],
      condition: 'new',
      location: {
        address: '789 Industrial Blvd',
        city: 'Queens',
        state: 'NY',
        zipCode: '11373'
      },
      availability: {
        available: true,
        minRentalDays: 7,
        maxRentalDays: 365
      },
      pricing: {
        dailyRate: 35,
        weeklyRate: 220,
        monthlyRate: 800,
        securityDeposit: 300,
        isForSale: true,
        sellPrice: 1500,
        isForRent: true
      },
      rating: 5.0,
      reviewCount: 203,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Load listings on mount
  useEffect(() => {
    loadListings();
  }, []);

  const getUserListings = (userId: string): LuggageListing[] => {
    return listings.filter(listing => listing.hostId === userId);
  };

  const addListing = async (listingData: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          host_id: listingData.hostId,
          host_name: listingData.hostName,
          title: listingData.title,
          description: listingData.description,
          images: listingData.images,
          category: listingData.category,
          type: listingData.type,
          size_height: listingData.size.height,
          size_width: listingData.size.width,
          size_depth: listingData.size.depth,
          size_unit: listingData.size.unit,
          area: listingData.area,
          contact_number: listingData.contactNumber,
          features: listingData.features,
          condition: listingData.condition,
          location_address: listingData.location.address,
          location_city: listingData.location.city,
          location_state: listingData.location.state,
          location_zip_code: listingData.location.zipCode,
          available: listingData.availability.available,
          min_rental_days: listingData.availability.minRentalDays,
          max_rental_days: listingData.availability.maxRentalDays,
          daily_rate: listingData.pricing.dailyRate,
          weekly_rate: listingData.pricing.weeklyRate,
          monthly_rate: listingData.pricing.monthlyRate,
          security_deposit: listingData.pricing.securityDeposit,
          sell_price: listingData.pricing.sellPrice,
          is_for_sale: listingData.pricing.isForSale,
          is_for_rent: listingData.pricing.isForRent
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding listing:', error);
        throw error;
      }

      if (data) {
        const newListing = transformSupabaseListing(data);
        setListings(prev => [newListing, ...prev]);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      // Fallback to local state update
      const newListing: LuggageListing = {
        ...listingData,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setListings(prev => [newListing, ...prev]);
    }
  };

  const updateListing = async (id: string, updates: Partial<LuggageListing>) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.type) updateData.type = updates.type;
      if (updates.condition) updateData.condition = updates.condition;
      if (updates.features) updateData.features = updates.features;
      if (updates.images) updateData.images = updates.images;
      if (updates.area) updateData.area = updates.area;
      if (updates.contactNumber) updateData.contact_number = updates.contactNumber;

      if (updates.size) {
        updateData.size_height = updates.size.height;
        updateData.size_width = updates.size.width;
        updateData.size_depth = updates.size.depth;
        updateData.size_unit = updates.size.unit;
      }

      if (updates.location) {
        updateData.location_address = updates.location.address;
        updateData.location_city = updates.location.city;
        updateData.location_state = updates.location.state;
        updateData.location_zip_code = updates.location.zipCode;
      }

      if (updates.availability) {
        updateData.available = updates.availability.available;
        updateData.min_rental_days = updates.availability.minRentalDays;
        updateData.max_rental_days = updates.availability.maxRentalDays;
      }

      if (updates.pricing) {
        updateData.daily_rate = updates.pricing.dailyRate;
        updateData.weekly_rate = updates.pricing.weeklyRate;
        updateData.monthly_rate = updates.pricing.monthlyRate;
        updateData.security_deposit = updates.pricing.securityDeposit;
        updateData.sell_price = updates.pricing.sellPrice;
        updateData.is_for_sale = updates.pricing.isForSale;
        updateData.is_for_rent = updates.pricing.isForRent;
      }

      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating listing:', error);
        throw error;
      }

      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing
        )
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      // Fallback to local state update
      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing
        )
      );
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting listing:', error);
        throw error;
      }

      setListings(prev => prev.filter(listing => listing.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      // Fallback to local state update
      setListings(prev => prev.filter(listing => listing.id !== id));
    }
  };

  const archiveListing = async (id: string) => {
    try {
      const { error } = await supabase
        .rpc('archive_listing', { listing_id: id });

      if (error) {
        console.error('Error archiving listing:', error);
        throw error;
      }

      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? {
                ...listing,
                isArchived: true,
                archivedAt: new Date().toISOString(),
                availability: { ...listing.availability, available: false }
              }
            : listing
        )
      );
    } catch (error) {
      console.error('Error archiving listing:', error);
      // Fallback to local state update
      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? {
                ...listing,
                isArchived: true,
                archivedAt: new Date().toISOString(),
                availability: { ...listing.availability, available: false }
              }
            : listing
        )
      );
    }
  };

  const unarchiveListing = async (id: string) => {
    try {
      const { error } = await supabase
        .rpc('unarchive_listing', { listing_id: id });

      if (error) {
        console.error('Error unarchiving listing:', error);
        throw error;
      }

      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? {
                ...listing,
                isArchived: false,
                archivedAt: undefined,
                availability: { ...listing.availability, available: true }
              }
            : listing
        )
      );
    } catch (error) {
      console.error('Error unarchiving listing:', error);
      // Fallback to local state update
      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? {
                ...listing,
                isArchived: false,
                archivedAt: undefined,
                availability: { ...listing.availability, available: true }
              }
            : listing
        )
      );
    }
  };

  const getListingById = (id: string): LuggageListing | undefined => {
    return listings.find(listing => listing.id === id);
  };

  const searchListings = (filters: SearchFilters): LuggageListing[] => {
    return listings.filter(listing => {
      // Exclude archived listings from search results
      if (listing.isArchived) return false;

      if (filters.category && listing.category !== filters.category) return false;
      if (filters.location && !listing.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.minPrice && listing.pricing.dailyRate < filters.minPrice) return false;
      if (filters.maxPrice && listing.pricing.dailyRate > filters.maxPrice) return false;

      // Filter by sale/rent type
      if (filters.type === 'sale' && !listing.pricing.isForSale) return false;
      if (filters.type === 'rent' && !listing.pricing.isForRent) return false;

      return true;
    });
  };

  const refreshListings = async () => {
    await loadListings();
  };

  // Get user-specific listings (excluding archived)
  const userListings = user ? getUserListings(user.id).filter(listing => !listing.isArchived) : [];

  // Get user's archived listings
  const archivedListings = user ? getUserListings(user.id).filter(listing => listing.isArchived) : [];

  const value = {
    listings,
    userListings,
    archivedListings,
    addListing,
    updateListing,
    deleteListing,
    archiveListing,
    unarchiveListing,
    getListingById,
    searchListings,
    refreshListings,
    isLoading
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
