import { useState, useEffect } from "react";
import { useListings, LuggageListing } from "@/contexts/ListingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BookingModal } from "@/components/BookingModal";
import { ContactSellerModal } from "@/components/ContactSellerModal";
import {
  Search,
  MapPin,
  Star,
  Filter,
  SlidersHorizontal,
  Calendar,
  Users,
  Package,
} from "lucide-react";

export default function Browse() {
  const { listings, searchListings } = useListings();
  const { t } = useLanguage();

  // Debug: Log listings count
  useEffect(() => {
    console.log("Browse: Listings count:", listings.length);
    console.log("Browse: Listings:", listings);
  }, [listings]);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRangeSlider, setPriceRangeSlider] = useState([0, 100]);
  const [sizeRangeSlider, setSizeRangeSlider] = useState([0, 1.0]);
  const [saleRentType, setSaleRentType] = useState("both");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedListing, setSelectedListing] = useState<LuggageListing | null>(
    null,
  );
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Set initial values from URL params
  useEffect(() => {
    const location = searchParams.get("location");
    const category = searchParams.get("category");
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");

    if (location) setSearchTerm(location);
    if (category) setSelectedCategory(category);
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  }, [searchParams]);

  const calculateSquareMeters = (
    height: number,
    width: number,
    unit: "cm" | "inches",
  ) => {
    // Convert to meters if needed
    const heightInM = unit === "cm" ? height / 100 : height * 0.0254;
    const widthInM = unit === "cm" ? width / 100 : width * 0.0254;
    const squareMeters = heightInM * widthInM;
    return Math.round(squareMeters * 10) / 10; // Round to 1 decimal place
  };

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const filteredListings = listings.filter((listing) => {
    // Exclude archived listings
    if (listing.isArchived) return false;

    if (selectedCategory !== "all" && listing.category !== selectedCategory)
      return false;
    if (
      searchTerm &&
      !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !listing.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !listing.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    // Sale/Rent type filter
    if (saleRentType === "sale" && !listing.pricing.isForSale) return false;
    if (saleRentType === "rent" && !listing.pricing.isForRent) return false;

    // Price range filter
    const price = listing.pricing.dailyRate;
    if (price < priceRangeSlider[0] || price > priceRangeSlider[1])
      return false;

    // Size range filter (square meters)
    const squareMeters = calculateSquareMeters(
      listing.size.height,
      listing.size.width,
      listing.size.unit,
    );
    if (squareMeters < sizeRangeSlider[0] || squareMeters > sizeRangeSlider[1])
      return false;

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-10":
          if (price >= 10) return false;
          break;
        case "10-20":
          if (price < 10 || price > 20) return false;
          break;
        case "20-50":
          if (price < 20 || price > 50) return false;
          break;
        case "over-50":
          if (price <= 50) return false;
          break;
      }
    }

    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.pricing.dailyRate - b.pricing.dailyRate;
      case "price-high":
        return b.pricing.dailyRate - a.pricing.dailyRate;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const handleBookListing = (listing: LuggageListing) => {
    setSelectedListing(listing);
    setBookingModalOpen(true);
  };

  const handleContactSeller = (listing: LuggageListing) => {
    setSelectedListing(listing);
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-6">{t("browse.title")}</h1>

          {/* Search Bar */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("browse.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  className="w-40"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  className="w-40"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("browse.allCategories")}</SelectItem>
                <SelectItem value="garage">{t("category.garage")}</SelectItem>
                <SelectItem value="shed">{t("category.shed")}</SelectItem>
                <SelectItem value="pantry">{t("category.pantry")}</SelectItem>
                <SelectItem value="cell">{t("category.cell")}</SelectItem>
                <SelectItem value="container">
                  {t("category.container")}
                </SelectItem>
                <SelectItem value="large-space">
                  {t("category.largeSpace")}
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-10">Under $10/day</SelectItem>
                <SelectItem value="10-20">$10-20/day</SelectItem>
                <SelectItem value="20-50">$20-50/day</SelectItem>
                <SelectItem value="over-50">Over $50/day</SelectItem>
              </SelectContent>
            </Select>

            <Select value={saleRentType} onValueChange={setSaleRentType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("search.saleRentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">{t("search.both")}</SelectItem>
                <SelectItem value="rent">{t("search.forRent")}</SelectItem>
                <SelectItem value="sale">{t("search.forSale")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Range Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {t("browse.priceRange")}: ${priceRangeSlider[0]} - $
                {priceRangeSlider[1]} {t("browse.perDay")}
              </label>
              <Slider
                value={priceRangeSlider}
                onValueChange={setPriceRangeSlider}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {t("browse.sizeRange")}: {sizeRangeSlider[0]} -{" "}
                {sizeRangeSlider[1]} m²
              </label>
              <Slider
                value={sizeRangeSlider}
                onValueChange={setSizeRangeSlider}
                max={1.0}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {sortedListings.length} {t("browse.optionsAvailable")}
          </p>
        </div>

        {sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing) => (
              <Card
                key={listing.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-800"
                    >
                      ${listing.pricing.dailyRate}/day
                    </Badge>
                    {listing.pricing.isForSale && listing.pricing.sellPrice && (
                      <Badge
                        variant="outline"
                        className="bg-white/90 text-green-700 border-green-300"
                      >
                        {t("search.forSale")}: ${listing.pricing.sellPrice}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="outline"
                      className="bg-white/90 text-gray-800 capitalize"
                    >
                      {listing.category.replace("-", " ")}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {listing.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.address}, {listing.state}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {listing.features.slice(0, 3).map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {listing.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{listing.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {listing.rating > 0
                            ? listing.rating.toFixed(1)
                            : t("common.new")}
                        </span>
                        {listing.reviewCount > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({listing.reviewCount})
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={
                          listing.condition === "new" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {t(`common.${listing.condition}`)}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">
                            {listing.ownerName}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {listing.size.height}×{listing.size.width}×
                          {listing.size.depth} {listing.size.unit}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {calculateSquareMeters(
                          listing.size.height,
                          listing.size.width,
                          listing.size.unit,
                        )}{" "}
                        m²
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {listing.pricing.isForRent && (
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleBookListing(listing)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {t("common.rent")}
                        </Button>
                      )}
                      {listing.pricing.isForSale && (
                        <Button
                          variant={
                            listing.pricing.isForRent ? "outline" : "default"
                          }
                          className="flex-1"
                          size="sm"
                          onClick={() => handleContactSeller(listing)}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {t("common.buy")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later for new
              listings.
            </p>
            <Button variant="outline">Clear Filters</Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        listing={selectedListing}
      />
      <ContactSellerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        listing={selectedListing}
      />
    </div>
  );
}
