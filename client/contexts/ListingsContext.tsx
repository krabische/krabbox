<<<<<<< HEAD
import React, { createContext, useContext, useState, ReactNode } from "react";
=======
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
>>>>>>> origin/main

export interface LuggageListing {
  id: string;
  hostId: string;
  hostName: string;
  contactNumber: string;
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
    | "other";
  type: "hardside" | "softside" | "hybrid";
  size: {
    height: number;
    width: number;
    depth: number;
<<<<<<< HEAD
    unit: "cm" | "inches";
=======
    unit: 'cm' | 'inches' | 'sqm';
>>>>>>> origin/main
  };
  area: number;
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
  isDeleted?: boolean;
}

interface ListingsContextType {
  listings: LuggageListing[];
  userListings: LuggageListing[];
<<<<<<< HEAD
  addListing: (
    listing: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => void;
  updateListing: (id: string, updates: Partial<LuggageListing>) => void;
  deleteListing: (id: string) => void;
=======
  addListing: (listing: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<LuggageListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
>>>>>>> origin/main
  getListingById: (id: string) => LuggageListing | undefined;
  searchListings: (filters: SearchFilters) => LuggageListing[];
}

interface SearchFilters {
  category?: string;
  type?: string;
  condition?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  dateRange?: { start: string; end: string };
  features?: string[];
  available?: boolean;
  minRentalDays?: number;
  maxRentalDays?: number;
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

export function ListingsProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const [listings, setListings] = useState<LuggageListing[]>([
    // Mock featured listings for initial display
    {
      id: "1",
      hostId: "host1",
      hostName: "Sarah M.",
      title: "Spacious Garage Storage",
      description:
        "Large secure garage with 24/7 access. Perfect for long-term storage of luggage and belongings.",
      images: ["/placeholder.svg"],
      category: "garage",
      type: "hardside",
      size: { height: 300, width: 500, depth: 400, unit: "cm" },
      features: [
        "24/7 Access",
        "Security Camera",
        "Climate Controlled",
        "Locked",
      ],
      condition: "excellent",
      location: {
        address: "123 Downtown St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 365,
      },
      pricing: {
        dailyRate: 25,
        weeklyRate: 150,
        monthlyRate: 500,
        securityDeposit: 200,
        isForSale: false,
        isForRent: true,
      },
      rating: 4.9,
      reviewCount: 127,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      hostId: "host2",
      hostName: "Mike R.",
      title: "Cozy Storage Shed",
      description:
        "Small but secure wooden shed in quiet neighborhood. Great for temporary storage.",
      images: ["/placeholder.svg"],
      category: "shed",
      type: "softside",
      size: { height: 200, width: 300, depth: 250, unit: "cm" },
      features: ["Waterproof", "Padlock", "Easy Access", "Clean"],
      condition: "good",
      location: {
        address: "456 Suburban Ave",
        city: "Brooklyn",
        state: "NY",
        zipCode: "11201",
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 90,
      },
      pricing: {
        dailyRate: 15,
        weeklyRate: 90,
        monthlyRate: 300,
        securityDeposit: 100,
        isForSale: false,
        isForRent: true,
      },
      rating: 4.7,
      reviewCount: 89,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      hostId: "host3",
      hostName: "Emma L.",
      title: "Modern Storage Container",
      description:
        "Industrial-grade storage container with advanced security systems. Perfect for valuable items.",
      images: ["/placeholder.svg"],
      category: "container",
      type: "hardside",
      size: { height: 250, width: 600, depth: 240, unit: "cm" },
      features: [
        "Steel Construction",
        "Digital Lock",
        "Insurance Included",
        "Fire Resistant",
      ],
      condition: "new",
      location: {
        address: "789 Industrial Blvd",
        city: "Queens",
        state: "NY",
        zipCode: "11373",
      },
      availability: {
        available: true,
        minRentalDays: 7,
        maxRentalDays: 365,
      },
      pricing: {
        dailyRate: 35,
        weeklyRate: 220,
        monthlyRate: 800,
        securityDeposit: 300,
        isForSale: true,
        sellPrice: 1500,
        isForRent: true,
      },
      rating: 5.0,
      reviewCount: 203,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      hostId: "host4",
      hostName: "James K.",
      title: "Basement Storage Cell",
      description:
        "Private basement storage with individual access. Clean, dry, and secure environment.",
      images: ["/placeholder.svg"],
      category: "cell",
      type: "hybrid",
      size: { height: 220, width: 200, depth: 300, unit: "cm" },
      features: ["Individual Access", "Dehumidifier", "Security Guard", "CCTV"],
      condition: "excellent",
      location: {
        address: "321 Storage Way",
        city: "Manhattan",
        state: "NY",
        zipCode: "10016",
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 180,
      },
      pricing: {
        dailyRate: 18,
        weeklyRate: 110,
        monthlyRate: 400,
        securityDeposit: 150,
        isForSale: false,
        isForRent: true,
      },
      rating: 4.8,
      reviewCount: 156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      hostId: "host5",
      hostName: "Lisa P.",
      title: "Large Warehouse Space",
      description:
        "Huge warehouse space perfect for multiple luggage items or large storage needs.",
      images: ["/placeholder.svg"],
      category: "large-space",
      type: "hardside",
      size: { height: 400, width: 1000, depth: 800, unit: "cm" },
      features: [
        "Forklift Access",
        "Loading Dock",
        "24/7 Security",
        "Climate Control",
      ],
      condition: "excellent",
      location: {
        address: "555 Warehouse District",
        city: "Bronx",
        state: "NY",
        zipCode: "10451",
      },
      availability: {
        available: true,
        minRentalDays: 7,
        maxRentalDays: 365,
      },
      pricing: {
        dailyRate: 75,
        weeklyRate: 450,
        monthlyRate: 1800,
        securityDeposit: 500,
        isForSale: false,
        isForRent: true,
      },
      rating: 4.9,
      reviewCount: 95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "6",
      hostId: "host6",
      hostName: "David H.",
      title: "Walk-in Pantry Storage",
      description:
        "Clean pantry space converted for storage. Temperature controlled and very secure.",
      images: ["/placeholder.svg"],
      category: "pantry",
      type: "softside",
      size: { height: 250, width: 150, depth: 200, unit: "cm" },
      features: [
        "Temperature Control",
        "Shelving Available",
        "Private Key",
        "Organized Space",
      ],
      condition: "good",
      location: {
        address: "888 Residential St",
        city: "Staten Island",
        state: "NY",
        zipCode: "10301",
      },
      availability: {
        available: true,
        minRentalDays: 1,
        maxRentalDays: 120,
      },
      pricing: {
        dailyRate: 12,
        weeklyRate: 70,
        monthlyRate: 250,
        securityDeposit: 75,
        isForSale: false,
        isForRent: true,
      },
      rating: 4.6,
      reviewCount: 78,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const getUserListings = (userId: string): LuggageListing[] => {
    return listings.filter((listing) => listing.hostId === userId);
  };

  const addListing = (
    listingData: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => {
    const newListing: LuggageListing = {
      ...listingData,
      id: Math.random().toString(36).substr(2, 9),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setListings((prev) => [newListing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<LuggageListing>) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing,
      ),
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
=======
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

          const area = parseFloat(item.square_meters) || 1;

          return {
            id: item.id.toString(),
            hostId: item.owner_id,
            hostName: item.host_name || 'Unknown Host',
            contactNumber: item.contact_number || '',
            title: item.title,
            description: item.description,
            images: images,
            category: item.category,
            type: item.type,
            size: { height: area, width: area, depth: 1, unit: 'sqm' },
            area,
            features: item.features ?? [],
            condition: item.condition,
            location: {
              address: item.address || '',
              city: item.location,
              state: item.state || '',
              zipCode: item.zip_code || ''
            },
            availability: {
              available: item.available,
              minRentalDays: item.min_rental_days,
              maxRentalDays: item.max_rental_days
            },
            pricing: {
              dailyRate: item.price,
              weeklyRate: item.weekly_rate,
              monthlyRate: item.monthly_rate,
              securityDeposit: item.security_deposit || 50,
              sellPrice: item.sell_price,
              isForSale: item.listing_type === 'sale',
              isForRent: item.listing_type === 'rent'
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
      }
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserListings = (userId: string): LuggageListing[] => {
    console.log('getUserListings called with userId:', userId);
    console.log('Available listings:', listings.length);
    const userListings = listings.filter(listing => {
      const matches = listing.hostId === userId;
      console.log(`Listing ${listing.id}: hostId="${listing.hostId}" vs userId="${userId}" matches=${matches}`);
      return matches;
    });
    console.log('Found user listings:', userListings.length, userListings);
    return userListings;
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
        host_name: listingData.hostName,
        square_meters: listingData.area,
        // Add all new fields
        category: listingData.category,
        type: listingData.type,
        condition: listingData.condition,
        features: listingData.features,
        contact_number: listingData.contactNumber,
        listing_type: listingData.pricing.isForSale
          ? 'sale'
          : listingData.pricing.isForRent
            ? 'rent'
            : 'rent',
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

      // Save to Supabase first, try with all fields
      let insertError = null as any;
      let data = null as any;
      try {
        const res = await supabase
          .from('listing')
          .insert([supabaseData])
          .select()
          .single();
        data = res.data;
        insertError = res.error;
      } catch (e) {
        insertError = e as any;
      }

      // If error mentions missing 'size' column, retry without it (already removed above)
      if (insertError && typeof insertError.message === 'string' && insertError.message.includes("'size'")) {
        console.warn("Supabase missing 'size' column, retrying insert without it");
        const retry = await supabase
          .from('listing')
          .insert([{...supabaseData}])
          .select()
          .single();
        data = retry.data;
        insertError = retry.error;
      }

      if (insertError) throw insertError;

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
      if (
        updates.pricing?.isForSale !== undefined ||
        updates.pricing?.isForRent !== undefined
      ) {
        const listingType = updates.pricing?.isForSale
          ? 'sale'
          : updates.pricing?.isForRent
            ? 'rent'
            : undefined;
        if (listingType) supabaseUpdates.listing_type = listingType;
      }
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
>>>>>>> origin/main
  };

  const getListingById = (id: string): LuggageListing | undefined => {
    return listings.find((listing) => listing.id === id);
  };

  const searchListings = (filters: SearchFilters): LuggageListing[] => {
<<<<<<< HEAD
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
=======
    return listings.filter(listing => {
      if (filters.category && listing.category !== filters.category) return false;
      if (filters.type && listing.type !== filters.type) return false;
      if (filters.condition && listing.condition !== filters.condition) return false;
      if (filters.location && !listing.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.features && !filters.features.every(f => listing.features.includes(f))) return false;
      if (filters.available !== undefined && listing.availability.available !== filters.available) return false;
      if (filters.minRentalDays && listing.availability.minRentalDays < filters.minRentalDays) return false;
      if (filters.maxRentalDays && listing.availability.maxRentalDays > filters.maxRentalDays) return false;
      if (filters.minPrice && listing.pricing.dailyRate < filters.minPrice) return false;
      if (filters.maxPrice && listing.pricing.dailyRate > filters.maxPrice) return false;
>>>>>>> origin/main
      return true;
    });
  };

<<<<<<< HEAD
  // Get user-specific listings (requires auth context)
  const userListings = getUserListings("current-user-id"); // This would use actual user ID from auth context

=======
>>>>>>> origin/main
  const value = {
    listings,
    userListings,
    addListing,
    updateListing,
    deleteListing,
    getListingById,
    searchListings,
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
