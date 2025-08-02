import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { LuggageListing } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Star, 
  CreditCard, 
  Shield, 
  Clock,
  User,
  Package,
  Loader2
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: LuggageListing | null;
}

export function BookingModal({ isOpen, onClose, listing }: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!listing) return null;

  const calculateDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays();
  const subtotal = days * listing.pricing.dailyRate;
  const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
  const total = subtotal + serviceFee + listing.pricing.securityDeposit;

  const handlePayment = async () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Please select dates",
        description: "Both pickup and return dates are required.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with Stripe, PayPal, etc.
      toast({
        title: "Booking Confirmed!",
        description: `Your luggage rental has been booked for ${days} ${days === 1 ? 'day' : 'days'}.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const minReturnDate = checkInDate || minDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Book Luggage Rental
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location.city}, {listing.location.state}
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">
                      {listing.rating > 0 ? listing.rating.toFixed(1) : 'New'}
                    </span>
                    {listing.reviewCount > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        ({listing.reviewCount})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">${listing.pricing.dailyRate}</div>
                  <div className="text-sm text-muted-foreground">per day</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Select Dates
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkin" className="text-sm">Pickup Date</Label>
                <Input
                  id="checkin"
                  type="date"
                  min={minDate}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout" className="text-sm">Return Date</Label>
                <Input
                  id="checkout"
                  type="date"
                  min={minReturnDate}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          {days > 0 && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold">Pricing Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>${listing.pricing.dailyRate} × {days} {days === 1 ? 'day' : 'days'}</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security deposit (refundable)</span>
                    <span>${listing.pricing.securityDeposit}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Host Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {listing.hostName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">Hosted by {listing.hostName}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Usually responds in a few hours
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {listing.features.slice(0, 6).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your booking is protected by LugSpace's guarantee policy</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing || !checkInDate || !checkOutDate}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${total}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
