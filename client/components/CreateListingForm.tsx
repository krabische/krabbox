import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useListings, LuggageListing } from "@/contexts/ListingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  DollarSign, 
  Package, 
  Info,
  Camera,
  Loader2
} from "lucide-react";

export function CreateListingForm() {
  const { user } = useAuth();
  const { addListing } = useListings();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    height: "",
    width: "",
    depth: "",
    unit: "cm" as "cm" | "inches",
    condition: "",
    features: [] as string[],
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    securityDeposit: "",
    sellPrice: "",
    isForSale: false,
    isForRent: true,
    minRentalDays: "1",
    maxRentalDays: "30"
  });

  const availableFeatures = [
    "TSA Lock", "4 Wheels", "2 Wheels", "Hard Shell", "Soft Shell", 
    "Expandable", "Lightweight", "Waterproof", "Compression Zippers",
    "Multiple Compartments", "Laptop Compartment", "USB Port",
    "Anti-Theft Zippers", "Warranty Included"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a file service here
      // For now, we'll use placeholder URLs
      const newImages = Array.from(files).map(() => `/placeholder.svg?${Math.random()}`);
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const listingData: Omit<LuggageListing, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> = {
        hostId: user.id,
        hostName: `${user.firstName} ${user.lastName}`,
        title: formData.title,
        description: formData.description,
        images: images.length > 0 ? images : ['/placeholder.svg'],
        category: formData.category as any,
        type: formData.type as any,
        size: {
          height: parseFloat(formData.height),
          width: parseFloat(formData.width),
          depth: parseFloat(formData.depth),
          unit: formData.unit
        },
        features: formData.features,
        condition: formData.condition as any,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        availability: {
          available: true,
          minRentalDays: parseInt(formData.minRentalDays),
          maxRentalDays: parseInt(formData.maxRentalDays)
        },
        pricing: {
          dailyRate: parseFloat(formData.dailyRate),
          weeklyRate: formData.weeklyRate ? parseFloat(formData.weeklyRate) : undefined,
          monthlyRate: formData.monthlyRate ? parseFloat(formData.monthlyRate) : undefined,
          securityDeposit: parseFloat(formData.securityDeposit),
          sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : undefined,
          isForSale: formData.isForSale,
          isForRent: formData.isForRent
        }
      };

      addListing(listingData);
      
      toast({
        title: "Listing Created!",
        description: "Your luggage listing has been posted successfully.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "",
        height: "",
        width: "",
        depth: "",
        unit: "cm",
        condition: "",
        features: [],
        address: "",
        city: "",
        state: "",
        zipCode: "",
        dailyRate: "",
        weeklyRate: "",
        monthlyRate: "",
        securityDeposit: "",
        sellPrice: "",
        isForSale: false,
        isForRent: true,
        minRentalDays: "1",
        maxRentalDays: "30"
      });
      setImages([]);
      setCurrentStep(1);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 4 && <div className={`w-12 h-0.5 ${currentStep > step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Premium Hardside Carry-On with TSA Lock"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your luggage in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garage">Garage</SelectItem>
                    <SelectItem value="shed">Shed</SelectItem>
                    <SelectItem value="pantry">Pantry</SelectItem>
                    <SelectItem value="cell">Storage Cell</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="large-space">Large Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardside">Hardside</SelectItem>
                    <SelectItem value="softside">Softside</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Condition *</Label>
              <RadioGroup 
                value={formData.condition} 
                onValueChange={(value) => handleInputChange("condition", value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">Excellent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">Good</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair">Fair</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Specifications & Features */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Specifications & Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Dimensions *</Label>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm">Height</Label>
                  <Input
                    type="number"
                    placeholder="56"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm">Width</Label>
                  <Input
                    type="number"
                    placeholder="35"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm">Depth</Label>
                  <Input
                    type="number"
                    placeholder="23"
                    value={formData.depth}
                    onChange={(e) => handleInputChange("depth", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="inches">inches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>



            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Images & Location */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Images & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Photos (Max 5)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Add Photos</span>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <div className="space-y-3">
                <Input
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Pricing & Availability */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing & Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Listing Type *</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="forRent"
                    checked={formData.isForRent}
                    onCheckedChange={(checked) => handleInputChange("isForRent", checked)}
                  />
                  <Label htmlFor="forRent">Available for Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="forSale"
                    checked={formData.isForSale}
                    onCheckedChange={(checked) => handleInputChange("isForSale", checked)}
                  />
                  <Label htmlFor="forSale">Available for Sale</Label>
                </div>
              </div>
            </div>

            {formData.isForRent && (
              <div className="space-y-4">
                <Label>Rental Pricing *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Daily Rate ($)</Label>
                    <Input
                      type="number"
                      placeholder="12.00"
                      step="0.01"
                      value={formData.dailyRate}
                      onChange={(e) => handleInputChange("dailyRate", e.target.value)}
                      required={formData.isForRent}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Weekly Rate ($)</Label>
                    <Input
                      type="number"
                      placeholder="70.00"
                      step="0.01"
                      value={formData.weeklyRate}
                      onChange={(e) => handleInputChange("weeklyRate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Monthly Rate ($)</Label>
                    <Input
                      type="number"
                      placeholder="250.00"
                      step="0.01"
                      value={formData.monthlyRate}
                      onChange={(e) => handleInputChange("monthlyRate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Security Deposit ($) *</Label>
                    <Input
                      type="number"
                      placeholder="100.00"
                      step="0.01"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                      required={formData.isForRent}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Min Rental Days</Label>
                    <Input
                      type="number"
                      value={formData.minRentalDays}
                      onChange={(e) => handleInputChange("minRentalDays", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Max Rental Days</Label>
                    <Input
                      type="number"
                      value={formData.maxRentalDays}
                      onChange={(e) => handleInputChange("maxRentalDays", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.isForSale && (
              <div className="space-y-2">
                <Label htmlFor="sellPrice">Sale Price ($) *</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  placeholder="150.00"
                  step="0.01"
                  value={formData.sellPrice}
                  onChange={(e) => handleInputChange("sellPrice", e.target.value)}
                  required={formData.isForSale}
                />
              </div>
            )}


          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={
              (currentStep === 1 && (!formData.title || !formData.description || !formData.category || !formData.type || !formData.condition)) ||
              (currentStep === 2 && (!formData.height || !formData.width || !formData.depth)) ||
              (currentStep === 3 && (!formData.address || !formData.city || !formData.state || !formData.zipCode))
            }
          >
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={isSubmitting || (!formData.isForRent && !formData.isForSale)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              "POST LISTING"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
