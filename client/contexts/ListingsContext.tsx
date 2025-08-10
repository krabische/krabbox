import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export interface LuggageListing {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  imageUrl: string;
  images: string[];
  squareMeters: number;
  address: string;
  state: string;
  zipCode: string;
  isAvailable: boolean;
  category?: "garage" | "shed" | "pantry" | "cell" | "container" | "large-space";
  type?: "hardside" | "softside" | "hybrid";
  size?: {
    height: number;
    width: number;
    depth: number;
    unit: "cm" | "inches";
  };
  area?: number;
  contactNumber?: string;
  features?: string[];
  condition?: "new" | "excellent" | "good" | "fair";
  location?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  availability?: {
    available: boolean;
    minRentalDays: number;
    maxRentalDays: number;
  };
  pricing?: {
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
  addListing: (
    listing: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => Promise<void>;
  updateListing: (
    id: string,
    updates: Partial<LuggageListing>,
  ) => Promise<void>;
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
  type?: "sale" | "rent" | "both";
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<LuggageListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load listings from Supabase
  const loadListings = async () => {
    setIsLoading(true);
    try {
      console.log("Loading listings from Supabase...");

      // First check if table exists by doing a simple count query
      const { count, error: countError } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error("Table access error:", countError.message);
        if (
          countError.message.includes(
            'relation "public.listings" does not exist',
          )
        ) {
          console.log("Listing table does not exist, using mock data");
          setListings(getMockListings());
          return;
        }
      }

      // If table exists, proceed with full query
      const { data, error } = await supabase
        .from("listings")
        .select("*, listing_images(image_url)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Supabase error loading listings:",
          error.message,
          error.details,
          error.hint,
        );
        console.log("Falling back to mock data due to database error");
        // Fallback to mock data if database fails
        setListings(getMockListings());
      } else {
        console.log(
          "Successfully loaded listings from Supabase:",
          data?.length || 0,
          "listings",
        );
        // Transform Supabase data to our interface
        const transformedListings = data?.map(transformSupabaseListing) || [];
        setListings(transformedListings);
      }
    } catch (error) {
      console.error("Unexpected error loading listings:", error);
      console.log("Error details:", JSON.stringify(error, null, 2));
      console.log("Falling back to mock data due to unexpected error");
      // Fallback to mock data
      setListings(getMockListings());
    } finally {
      setIsLoading(false);
    }
  };

  // Transform Supabase listing to our interface
  const transformSupabaseListing = (data: any): LuggageListing => ({
    id: data.id,
    ownerId: data.owner_id,
    ownerName: data.owner_name || "Anonymous Owner",
    title: data.title,
    description: data.description || "",
    imageUrl: data.image_url || "/placeholder.svg",
    images:
      (data.listing_images || []).map((img: any) => img.image_url) || [
        data.image_url || "/placeholder.svg",
      ],
    squareMeters: data.square_meters || 0,
    address: data.address || "",
    state: data.state || "",
    zipCode: data.zip_code || "",
    isAvailable: data.is_available !== false,
    location: {
      address: data.address || "",
      city: "",
      state: data.state || "",
      zipCode: data.zip_code || "",
    },
    pricing: {
      dailyRate: 0,
      weeklyRate: undefined,
      monthlyRate: undefined,
      securityDeposit: 0,
      sellPrice: undefined,
      isForSale: false,
      isForRent: false,
    },
    rating: data.rating || 0,
    reviewCount: data.review_count || 0,
    isArchived: data.is_archived || false,
    archivedAt: data.archived_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });

  // Get mock listings for fallback
  const getMockListings = (): LuggageListing[] => [
    {
      id: "1",
      ownerId: "owner1",
      ownerName: "Sarah M.",
      title: "Spacious Garage Storage",
      description:
        "Large secure garage with 24/7 access. Perfect for long-term storage of luggage and belongings.",
      imageUrl: "/placeholder.svg",
      images: ["/placeholder.svg"],
      squareMeters: 50,
      address: "123 Downtown St",
      state: "NY",
      zipCode: "10001",
      isAvailable: true,
      rating: 4.9,
      reviewCount: 127,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      ownerId: "owner2",
      ownerName: "Mike R.",
      title: "Cozy Storage Shed",
      description:
        "Small but secure wooden shed in quiet neighborhood. Great for temporary storage.",
      imageUrl: "/placeholder.svg",
      images: ["/placeholder.svg"],
      squareMeters: 30,
      address: "456 Suburban Ave",
      state: "NY",
      zipCode: "11201",
      isAvailable: true,
      rating: 4.7,
      reviewCount: 89,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      ownerId: "owner3",
      ownerName: "Emma L.",
      title: "Modern Storage Container",
      description:
        "Industrial-grade storage container with advanced security systems. Perfect for valuable items.",
      imageUrl: "/placeholder.svg",
      images: ["/placeholder.svg"],
      squareMeters: 40,
      address: "789 Industrial Blvd",
      state: "NY",
      zipCode: "11373",
      isAvailable: true,
      rating: 5.0,
      reviewCount: 203,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Load listings on mount
  useEffect(() => {
    loadListings();
  }, []);

  const getUserListings = (userId: string): LuggageListing[] => {
    return listings.filter((listing) => listing.ownerId === userId);
  };

  const addListing = async (
    listingData: Omit<
      LuggageListing,
      "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount"
    >,
  ) => {
    try {
      console.log("Adding listing to Supabase...");
      const { data, error } = await supabase
        .from("listings")
        .insert({
          owner_id: listingData.ownerId,
          owner_name: listingData.ownerName,
          title: listingData.title,
          description: listingData.description,
          image_url: listingData.imageUrl || listingData.images?.[0],
          square_meters: listingData.squareMeters,
          address: listingData.address,
          state: listingData.state,
          zip_code: listingData.zipCode,
          is_available: listingData.isAvailable,
        })
        .select("*, listing_images(image_url)")
        .single();

      if (!error && data && listingData.images?.length) {
        const imagesData = listingData.images.map((url, index) => ({
          listing_id: data.id,
          image_url: url,
          order_index: index,
        }));
        await supabase.from("listing_images").insert(imagesData);
      }

      if (error) {
        console.error(
          "Supabase error adding listing:",
          error.message,
          error.details,
        );
        throw new Error(`Failed to add listing: ${error.message}`);
      }

      if (data) {
        console.log("Successfully added listing to Supabase");
        const newListing = transformSupabaseListing(data);
        setListings((prev) => [newListing, ...prev]);
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      console.log("Falling back to local state update");
      // Fallback to local state update
      const newListing: LuggageListing = {
        ...listingData,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
    }
  };

  const updateListing = async (
    id: string,
    updates: Partial<LuggageListing>,
  ) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.imageUrl) updateData.image_url = updates.imageUrl;
      if (updates.squareMeters !== undefined)
        updateData.square_meters = updates.squareMeters;
      if (updates.address) updateData.address = updates.address;
      if (updates.state) updateData.state = updates.state;
      if (updates.zipCode) updateData.zip_code = updates.zipCode;
      if (updates.isAvailable !== undefined)
        updateData.is_available = updates.isAvailable;

      const { error } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", id);

      if (!error && updates.images) {
        await supabase.from("listing_images").delete().eq("listing_id", id);
        const imagesData = updates.images.map((url, index) => ({
          listing_id: id,
          image_url: url,
          order_index: index,
        }));
        await supabase.from("listing_images").insert(imagesData);
      }

      if (error) {
        console.error("Error updating listing:", error);
        throw error;
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing,
        ),
      );
    } catch (error) {
      console.error("Error updating listing:", error);
      // Fallback to local state update
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
            : listing,
        ),
      );
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) {
        console.error("Error deleting listing:", error);
        throw error;
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
      // Fallback to local state update
      setListings((prev) => prev.filter((listing) => listing.id !== id));
    }
  };

  const archiveListing = async (id: string) => {
    try {
      const { error } = await supabase.rpc("archive_listing", {
        listing_id: id,
      });

      if (error) {
        console.error("Error archiving listing:", error);
        throw error;
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                isArchived: true,
                archivedAt: new Date().toISOString(),
                availability: { ...listing.availability, available: false },
              }
            : listing,
        ),
      );
    } catch (error) {
      console.error("Error archiving listing:", error);
      // Fallback to local state update
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                isArchived: true,
                archivedAt: new Date().toISOString(),
                availability: { ...listing.availability, available: false },
              }
            : listing,
        ),
      );
    }
  };

  const unarchiveListing = async (id: string) => {
    try {
      const { error } = await supabase.rpc("unarchive_listing", {
        listing_id: id,
      });

      if (error) {
        console.error("Error unarchiving listing:", error);
        throw error;
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                isArchived: false,
                archivedAt: undefined,
                availability: { ...listing.availability, available: true },
              }
            : listing,
        ),
      );
    } catch (error) {
      console.error("Error unarchiving listing:", error);
      // Fallback to local state update
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id
            ? {
                ...listing,
                isArchived: false,
                archivedAt: undefined,
                availability: { ...listing.availability, available: true },
              }
            : listing,
        ),
      );
    }
  };

  const getListingById = (id: string): LuggageListing | undefined => {
    return listings.find((listing) => listing.id === id);
  };

  const searchListings = (filters: SearchFilters): LuggageListing[] => {
    return listings.filter((listing) => {
      // Exclude archived listings from search results
      if (listing.isArchived) return false;

      if (filters.location) {
        const search = filters.location.toLowerCase();
        if (
          !listing.address.toLowerCase().includes(search) &&
          !listing.state.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const refreshListings = async () => {
    await loadListings();
  };

  // Get user-specific listings (excluding archived)
  const userListings = user
    ? getUserListings(user.id).filter((listing) => !listing.isArchived)
    : [];

  // Get user's archived listings
  const archivedListings = user
    ? getUserListings(user.id).filter((listing) => listing.isArchived)
    : [];

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
