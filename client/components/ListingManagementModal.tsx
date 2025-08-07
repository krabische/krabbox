import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { LuggageListing } from "@/contexts/ListingsContext";
import { 
  MapPin, 
  Star, 
  Package, 
  X,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface ListingManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: LuggageListing | null;
  onDelete: (id: string) => void;
  onEdit: (listing: LuggageListing) => void;
}

export function ListingManagementModal({ 
  isOpen, 
  onClose, 
  listing, 
  onDelete, 
  onEdit 
}: ListingManagementModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { toast } = useToast();

  if (!listing) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here you would check if the listing has any bookings
      // For now, we'll simulate this check
      const hasBookings = false; // This should be checked from your database
      
      if (hasBookings) {
        toast({
          title: "Cannot Delete",
          description: "This listing cannot be deleted because it has active bookings.",
          variant: "destructive",
        });
        return;
      }

      // Mark as deleted in Supabase
      const { error } = await supabase
        .from('listing')
        .update({ is_deleted: true })
        .eq('id', listing.id);

      if (error) {
        throw error;
      }

      await onDelete(listing.id);
      setIsDeleted(true);
      toast({
        title: "Listing Deleted",
        description: "Your listing has been marked as deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    onEdit(listing);
    onClose();
  };

  if (isDeleted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Listing Deleted
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Your listing "{listing.title}" has been marked as deleted.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Manage Listing
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location.city}, {listing.location.state}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{listing.rating > 0 ? listing.rating.toFixed(1) : "New"}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ${listing.pricing.dailyRate}/day
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {listing.condition}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning about bookings */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Important Notice</h4>
                  <p className="text-sm text-yellow-700">
                    If this listing has active bookings, you will not be able to delete it. 
                    Deleted listings will be hidden from search but remain visible in your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Listing"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 