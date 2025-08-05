import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { LuggageListing } from "@/contexts/ListingsContext";
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Package, 
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface ListingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: LuggageListing | null;
}

export function ListingDetailModal({ isOpen, onClose, listing }: ListingDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!listing) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const calculateSquareMeters = (
    height: number,
    width: number,
    unit: "cm" | "inches" | "sqm",
  ) => {
    if (unit === "sqm") return height;
    const multiplier = unit === "cm" ? 0.0001 : 0.00064516;
    return (height * width * multiplier).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="listing-detail-description">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {listing.title}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6" id="listing-detail-description">
          {/* Images Section */}
          {listing.images && listing.images.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {listing.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex justify-center mt-2 space-x-1">
                    {listing.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location.city}, {listing.location.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
                    {listing.reviewCount > 0 && ` (${listing.reviewCount})`}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{listing.description}</p>
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Information */}
              <div>
                <h3 className="font-semibold mb-2">Size & Condition</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 capitalize">{listing.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 capitalize">{listing.type}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="ml-2 capitalize">{listing.condition}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <span className="ml-2">
                      {listing.size && !isNaN(listing.size.height) && !isNaN(listing.size.width)
                        ? `${calculateSquareMeters(listing.size.height, listing.size.width, listing.size.unit)} m²`
                        : 'Not specified'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary">
                      ${listing.pricing.dailyRate}
                    </div>
                    <div className="text-sm text-muted-foreground">per day</div>
                  </div>

                  {listing.pricing.weeklyRate && (
                    <div className="text-center mb-2">
                      <div className="text-lg font-semibold">
                        ${listing.pricing.weeklyRate}
                      </div>
                      <div className="text-xs text-muted-foreground">per week</div>
                    </div>
                  )}

                  {listing.pricing.monthlyRate && (
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold">
                        ${listing.pricing.monthlyRate}
                      </div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                  )}

                  {listing.pricing.securityDeposit > 0 && (
                    <div className="text-center mb-4 p-2 bg-gray-50 rounded">
                      <div className="text-sm text-muted-foreground">Security Deposit</div>
                      <div className="font-semibold">${listing.pricing.securityDeposit}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {listing.pricing.isForRent && (
                      <Button className="w-full" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    )}
                    {listing.pricing.isForSale && (
                      <Button className="w-full" size="lg">
                        <Users className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Host Information */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Host</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {listing.hostName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{listing.hostName}</div>
                      <div className="text-sm text-muted-foreground">Member since {new Date(listing.createdAt).getFullYear()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 