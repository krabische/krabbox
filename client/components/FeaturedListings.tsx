import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Star, Clock } from "lucide-react";

const featuredListings = [
  {
    id: 1,
    title: "Premium Hardside Carry-On",
    location: "Downtown Hotel District",
    distance: "0.2 miles from you",
    price: 12,
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg",
    tags: ["Carry-On", "Hardside", "TSA Lock"],
    host: "Sarah M.",
    responseTime: "< 1 hour",
    size: { height: 56, width: 35, depth: 23 }
  },
  {
    id: 2,
    title: "Spacious Travel Duffel Bag",
    location: "Airport Terminal",
    distance: "0.1 miles from Terminal A",
    price: 8,
    rating: 4.8,
    reviews: 89,
    image: "/placeholder.svg",
    tags: ["Duffel", "Waterproof", "Large"],
    host: "Mike R.",
    responseTime: "< 30 mins",
    size: { height: 40, width: 70, depth: 30 }
  },
  {
    id: 3,
    title: "Luxury 4-Wheel Spinner",
    location: "Central Station",
    distance: "0.3 miles from station",
    price: 15,
    rating: 5.0,
    reviews: 203,
    image: "/placeholder.svg",
    tags: ["Large", "Spinner", "Premium"],
    host: "Emma L.",
    responseTime: "< 15 mins",
    size: { height: 76, width: 48, depth: 30 }
  },
  {
    id: 4,
    title: "Compact Travel Backpack",
    location: "University District",
    distance: "0.4 miles from campus",
    price: 6,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg",
    tags: ["Backpack", "Lightweight", "Compact"],
    host: "James K.",
    responseTime: "< 2 hours",
    size: { height: 45, width: 30, depth: 20 }
  }
];

export function FeaturedListings() {
  const calculateSquareMeters = (height: number, width: number, unit: 'cm' | 'inches' = 'cm') => {
    const heightInM = unit === 'cm' ? height / 100 : height * 0.0254;
    const widthInM = unit === 'cm' ? width / 100 : width * 0.0254;
    const squareMeters = heightInM * widthInM;
    return Math.round(squareMeters * 10) / 10;
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Luggage Near You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover high-quality luggage available for rent in your area. From carry-ons to large suitcases, find the perfect bag for your next trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Card key={listing.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    ${listing.price}/day
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
                      {listing.location}
                    </div>
                    <p className="text-xs text-muted-foreground">{listing.distance}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {listing.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({listing.reviews})
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {listing.responseTime}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      Hosted by <span className="font-medium">{listing.host}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Listings
          </Button>
        </div>
      </div>
    </section>
  );
}
