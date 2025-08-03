import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Loader2 } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending email to alex.s19499@gmail.com
      // In a real implementation, this would call your backend API
      const emailData = {
        to: "alex.s19499@gmail.com",
        from: formData.email,
        subject: `[LugSpace Support] ${formData.category}: ${formData.subject}`,
        message: `
Name: ${formData.name}
Email: ${formData.email}
Category: ${formData.category}
Subject: ${formData.subject}

Message:
${formData.message}
        `
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Email would be sent:", emailData);
      
      toast({
        title: "Message Sent!",
        description: "Your support request has been sent to our team. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
      onClose();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly at alex.s19499@gmail.com",
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
            <Mail className="h-5 w-5 text-primary" />
            Contact Support
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="booking-issue">Booking Issue</SelectItem>
                <SelectItem value="payment-problem">Payment Problem</SelectItem>
                <SelectItem value="account-help">Account Help</SelectItem>
                <SelectItem value="listing-question">Listing Question</SelectItem>
                <SelectItem value="technical-issue">Technical Issue</SelectItem>
                <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Please provide details about your issue or question..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
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

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>You can also reach us directly at:</p>
          <p className="font-medium">alex.s19499@gmail.com</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
