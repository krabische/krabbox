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
    updateListing: (id: string, updates: Partial<LuggageListing>) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
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
        .select(`
          *,
          profiles:owner_id (
            full_name,
            email
          )
        `)
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

        const formattedListings: LuggageListing[] = listingsData
          // Exclude deleted or unavailable listings
          .filter((item: any) => !item.is_deleted && item.available !== false)
          .map((item: any) => {
          // Get images for this listing, fallback to main image_url if no images in listing_images
          const listingImages = imagesMap.get(item.id) || [];
          const images = listingImages.length > 0 ? listingImages : (item.image_url ? [item.image_url] : ['/placeholder.svg']);

          // Get user info for host name
          const hostName = item.profiles?.full_name || item.host_name || 'Unknown Host';
          
          // Get square meters - try different possible field names
          const squareMeters = item.square_meters || item.square_meters || item.area || 1;

          return {
            id: item.id.toString(),
            hostId: item.owner_id,
            hostName: hostName,
            // Debug info
            _debug: {
              owner_id: item.owner_id,
              user_id: user?.id,
              isOwner: item.owner_id === user?.id
            },
            title: item.title,
            description: item.description,
            images: images,
            category: item.category || 'carry-on',
            type: item.type || 'hardside',
            size: { 
              height: parseFloat(squareMeters) || 1, 
              width: parseFloat(squareMeters) || 1, 
              depth: 1, 
              unit: 'sqm' 
            },
            features: item.features || [],
            condition: item.condition || 'excellent',
            location: {
              address: item.address || '',
              city: item.location,
              state: item.state || '',
              zipCode: item.zip_code || ''
            },
            availability: {
              available: item.available !== false,
              minRentalDays: item.min_rental_days || 1,
              maxRentalDays: item.max_rental_days || 30
            },
            pricing: {
              dailyRate: item.price,
              weeklyRate: item.weekly_rate,
              monthlyRate: item.monthly_rate,
              securityDeposit: item.security_deposit || 50,
              sellPrice: item.sell_price,
              isForSale: item.listing_type === 'sale',
              isForRent: item.listing_type !== 'sale'
            },
            rating: item.rating || 0,
            reviewCount: item.review_count || 0,
            createdAt: item.created_at,
            updatedAt: item.created_at,
            isDeleted: item.is_deleted || false
          };
        });

        setListings(formattedListings);
        console.log('Loaded listings from Supabase:', formattedListings);
        console.log('Total listings loaded:', formattedListings.length);
        console.log('Available listings:', formattedListings.filter(l => !l.isDeleted && l.availability.available).length);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserListings = (userId: string): LuggageListing[] => {
    const userListings = listings.filter(listing => listing.hostId === userId && !listing.isDeleted);
    console.log('getUserListings called for userId:', userId);
    console.log('All listings:', listings.length);
    console.log('User listings found:', userListings.length);
    console.log('User listings:', userListings);
    return userListings;
  };

  useEffect(() => {
    if (user?.id) {
      const userListings = getUserListings(user.id);
      console.log('User listings:', userListings);
      setUserListings(userListings);
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
        host_name: listingData.hostName,
        square_meters: listingData.size.height,
        // Add all new fields
        category: listingData.category,
        type: listingData.type,
        condition: listingData.condition,
        features: listingData.features,
        contact_number: listingData.hostName, // You might want to get this from user profile
        listing_type: listingData.pricing.isForSale ? 'sale' : 'rent',
        weekly_rate: listingData.pricing.weeklyRate,
        monthly_rate: listingData.pricing.monthlyRate,
        security_deposit: listingData.pricing.securityDeposit,
        min_rental_days: listingData.availability.minRentalDays,
        max_rental_days: listingData.availability.maxRentalDays,
        sell_price: listingData.pricing.sellPrice,
        address: listingData.location.address,
        state: listingData.location.state,
        zip_code: listingData.location.zipCode,
        available: listingData.availability.available
      };
      
      console.log('Creating listing with hostId:', listingData.hostId);
      console.log('Supabase data:', supabaseData);
      
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
      
      // Reload listings to ensure everything is in sync
      await loadListings();
      
      console.log('Successfully saved listing to Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error adding listing:', error);
      console.error('Error type:', typeof error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      throw error;
    }
  };

  const updateListing = async (id: string, updates: Partial<LuggageListing>): Promise<void> => {
    try {
      const supabaseUpdates: any = {};

      if (updates.title !== undefined) supabaseUpdates.title = updates.title;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.pricing?.dailyRate !== undefined) supabaseUpdates.price = updates.pricing.dailyRate;
      if (updates.location?.city !== undefined) supabaseUpdates.location = updates.location.city;
      if (updates.images && updates.images.length > 0) supabaseUpdates.image_url = updates.images[0];
      if (updates.category !== undefined) supabaseUpdates.category = updates.category;
      if (updates.type !== undefined) supabaseUpdates.type = updates.type;
      if (updates.condition !== undefined) supabaseUpdates.condition = updates.condition;
      if (updates.features !== undefined) supabaseUpdates.features = updates.features;
      if (updates.pricing?.weeklyRate !== undefined) supabaseUpdates.weekly_rate = updates.pricing.weeklyRate;
      if (updates.pricing?.monthlyRate !== undefined) supabaseUpdates.monthly_rate = updates.pricing.monthlyRate;
      if (updates.pricing?.securityDeposit !== undefined) supabaseUpdates.security_deposit = updates.pricing.securityDeposit;
      if (updates.availability?.minRentalDays !== undefined) supabaseUpdates.min_rental_days = updates.availability.minRentalDays;
      if (updates.availability?.maxRentalDays !== undefined) supabaseUpdates.max_rental_days = updates.availability.maxRentalDays;
      if (updates.pricing?.sellPrice !== undefined) supabaseUpdates.sell_price = updates.pricing.sellPrice;
      if (updates.location?.address !== undefined) supabaseUpdates.address = updates.location.address;
      if (updates.location?.state !== undefined) supabaseUpdates.state = updates.location.state;
      if (updates.location?.zipCode !== undefined) supabaseUpdates.zip_code = updates.location.zipCode;
      if (updates.availability?.available !== undefined) supabaseUpdates.available = updates.availability.available;
      if (updates.pricing?.isForSale !== undefined) supabaseUpdates.listing_type = updates.pricing.isForSale ? 'sale' : 'rent';
      if (updates.size?.height !== undefined) supabaseUpdates.square_meters = updates.size.height;

      const { error } = await supabase
        .from('listing')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) throw error;

      if (updates.images) {
        const { error: deleteError } = await supabase
          .from('listing_images')
          .delete()
          .eq('listing_id', id);

        if (deleteError) {
          console.error('Error deleting existing images:', deleteError);
        }

        if (updates.images.length > 0) {
          const imageRecords = updates.images.map((url, index) => ({
            listing_id: id,
            image_url: url,
            order_index: index,
          }));

          const { error: insertError } = await supabase
            .from('listing_images')
            .insert(imageRecords);

          if (insertError) {
            console.error('Error saving images:', insertError);
          }
        }
      }

      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing
        )
      );

      await loadListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listing')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) {
        console.error('Error deleting listing:', error);
      }

      // Mark listing as deleted locally instead of removing it
      setListings(prev =>
        prev.map(listing =>
          listing.id === id
            ? {
                ...listing,
                isDeleted: true,
                availability: {
                  ...listing.availability,
                  available: false
                }
              }
            : listing
        )
      );
    } catch (err) {
      console.error('Unexpected error deleting listing:', err);
    }
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
