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
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Calendar, 
  MapPin, 
  Star, 
  CreditCard, 
  Shield, 
  Clock,
  User,
  Package,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Phone
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();

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
  const serviceFee = Math.round(subtotal * 0.1);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Booking Confirmed!",
        description: `Your storage space has been booked for ${days} ${days === 1 ? 'day' : 'days'}.`,
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

  const minDate = new Date().toISOString().split('T')[0];
  const minReturnDate = checkInDate || minDate;

  // Mock phone number - in real app this would come from listing data
  const hostPhoneNumber = "+1 (555) 123-4567";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {t('common.book')} Storage Space
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6" style={{ maxHeight: 'calc(95vh - 140px)' }}>
          <div className="space-y-6 pb-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {listing.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  {/* Image dots indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Listing Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location.address}, {listing.location.city}, {listing.location.state}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
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
                <Badge variant="outline" className="capitalize">
                  {listing.condition}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{listing.description}</p>
            </div>

            {/* Date Selection */}
            <Card>
              <CardContent className="p-4">
                <Label className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4" />
                  Select Dates
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin" className="text-sm">{t('search.pickup')} Date</Label>
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
                    <Label htmlFor="checkout" className="text-sm">{t('search.return')} Date</Label>
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
              </CardContent>
            </Card>

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
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {listing.hostName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Hosted by {listing.hostName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Usually responds in a few hours
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Contact: {hostPhoneNumber}</span>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {listing.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs justify-start">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-green-50 p-3 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Your booking is protected by LugSpace's guarantee policy</span>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-white p-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('common.cancel')}
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
                  {t('common.pay')} ${total}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
