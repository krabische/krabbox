import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { LuggageListing } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  User, 
  Star,
  MapPin,
  Package,
  Loader2
} from "lucide-react";

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: LuggageListing | null;
}

export function ContactSellerModal({ isOpen, onClose, listing }: ContactSellerModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to contact sellers.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate sending message to seller
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send a message through your messaging system
      console.log("Message to seller:", {
        from: user.email,
        to: listing.ownerId,
        listing: listing.id,
        message: message
      });
      
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${listing.ownerName}. They will receive it via email.`,
      });
      
      setMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Contact Seller
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listing Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2 text-sm">{listing.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.address}, {listing.state}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {listing.ownerName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{listing.ownerName}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>
                      {listing.rating > 0 ? `${listing.rating.toFixed(1)} rating` : 'New seller'}
                    </span>
                    {listing.reviewCount > 0 && (
                      <span className="ml-1">({listing.reviewCount} reviews)</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Package className="h-3 w-3 mr-1" />
                    Member since {new Date(listing.createdAt).getFullYear()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder={`Hi ${listing.ownerName.split(' ')[0]}, I'm interested in your ${listing.title}. Could you provide more details about...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-1">💡 Tips for messaging sellers:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ask specific questions about condition and features</li>
                <li>Inquire about pickup/delivery options</li>
                <li>Be polite and professional</li>
                <li>Mention your timeline for purchase</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !message.trim()} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>

          {!user && (
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>You need to be logged in to contact sellers.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
