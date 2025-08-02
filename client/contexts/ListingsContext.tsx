import React, { createContext, useContext, useState, ReactNode } from "react";

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
    | "other";
  type: "hardside" | "softside" | "hybrid";
  size: {
    height: number;
    width: number;
    depth: number;
    unit: "cm" | "inches";
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
  ) => void;
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

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

export function ListingsProvider({ children }: { children: ReactNode }) {
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

  // Get user-specific listings (requires auth context)
  const userListings = getUserListings("current-user-id"); // This would use actual user ID from auth context

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
