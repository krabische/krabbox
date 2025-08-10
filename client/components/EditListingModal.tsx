import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useListings, LuggageListing } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  X,
  MapPin,
  DollarSign,
  Package,
  Info,
  Camera,
  Loader2,
  Edit,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditListingModalProps {
  listing: LuggageListing;
  children?: React.ReactNode;
}

export function EditListingModal({ listing, children }: EditListingModalProps) {
  const { updateListing } = useListings();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>(listing.images || []);
  const [formData, setFormData] = useState({
    title: listing.title,
    description: listing.description,
    category: listing.category,
    type: listing.type,
    squareMeters: listing.area?.toString() || "",
    condition: listing.condition,
    features: listing.features || [],
    address: listing.location.address,
    city: listing.location.city,
    state: listing.location.state,
    zipCode: listing.location.zipCode,
    phoneNumber: listing.contactNumber || "",
    dailyRate: listing.pricing.dailyRate.toString(),
    weeklyRate: listing.pricing.weeklyRate?.toString() || "",
    monthlyRate: listing.pricing.monthlyRate?.toString() || "",
    securityDeposit: listing.pricing.securityDeposit.toString(),
    sellPrice: listing.pricing.sellPrice?.toString() || "",
    isForSale: listing.pricing.isForSale,
    isForRent: listing.pricing.isForRent,
    minRentalDays: listing.availability.minRentalDays.toString(),
    maxRentalDays: listing.availability.maxRentalDays.toString(),
  });

  const availableFeatures = [
    "TSA Lock",
    "4 Wheels",
    "2 Wheels",
    "Hard Shell",
    "Soft Shell",
    "Expandable",
    "Lightweight",
    "Waterproof",
    "Compression Zippers",
    "Multiple Compartments",
    "Laptop Compartment",
    "USB Port",
    "Anti-Theft Zippers",
    "Warranty Included",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      try {
        const uploadedUrls = [];

        for (const file of Array.from(files)) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `listings/${fileName}`;

          const { data, error } = await supabase.storage
            .from("listings")
            .upload(filePath, file);

          if (error) {
            console.error("Error uploading image:", error);
            toast({
              title: "Upload Error",
              description: "Failed to upload image. Please try again.",
              variant: "destructive",
            });
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("listings").getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        }

        setImages((prev) => [...prev, ...uploadedUrls].slice(0, 5));

        toast({
          title: "Images Uploaded",
          description: `${uploadedUrls.length} image(s) uploaded successfully.`,
        });
      } catch (error) {
        console.error("Error uploading images:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates: Partial<LuggageListing> = {
        title: formData.title,
        description: formData.description,
        images: images.length > 0 ? images : ["/placeholder.svg"],
        category: formData.category as any,
        type: formData.type as any,
        size: {
          height: parseFloat(formData.squareMeters) || 1,
          width: 1,
          depth: 1,
          unit: "sqm",
        },
        area: parseFloat(formData.squareMeters) || 1,
        contactNumber: formData.phoneNumber,
        features: formData.features,
        condition: formData.condition as any,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        availability: {
          available: true,
          minRentalDays: parseInt(formData.minRentalDays),
          maxRentalDays: parseInt(formData.maxRentalDays),
        },
        pricing: {
          dailyRate: parseFloat(formData.dailyRate),
          weeklyRate: formData.weeklyRate
            ? parseFloat(formData.weeklyRate)
            : undefined,
          monthlyRate: formData.monthlyRate
            ? parseFloat(formData.monthlyRate)
            : undefined,
          securityDeposit: parseFloat(formData.securityDeposit),
          sellPrice: formData.sellPrice
            ? parseFloat(formData.sellPrice)
            : undefined,
          isForSale: formData.isForSale,
          isForRent: formData.isForRent,
        },
      };

      await updateListing(listing.id, updates);

      toast({
        title: t("listing.updated"),
        description: t("listing.updatedDescription"),
      });

      setOpen(false);
      setCurrentStep(1);
    } catch (error: any) {
      console.error("EditListingModal error:", error);
      const errorMessage =
        error?.message || "Failed to update listing. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            {t("common.edit")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("listing.edit")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${currentStep > step ? "bg-primary" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t("listing.basicInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("listing.title")} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("listing.description")} *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("listing.category")} *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="garage">
                          {t("category.garage")}
                        </SelectItem>
                        <SelectItem value="shed">
                          {t("category.shed")}
                        </SelectItem>
                        <SelectItem value="pantry">
                          {t("category.pantry")}
                        </SelectItem>
                        <SelectItem value="cell">
                          {t("category.cell")}
                        </SelectItem>
                        <SelectItem value="container">
                          {t("category.container")}
                        </SelectItem>
                        <SelectItem value="large-space">
                          {t("category.largeSpace")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("listing.type")} *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <Label>{t("listing.condition")} *</Label>
                  <RadioGroup
                    value={formData.condition}
                    onValueChange={(value) =>
                      handleInputChange("condition", value)
                    }
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">{t("common.new")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <Label htmlFor="excellent">{t("common.excellent")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="good" />
                      <Label htmlFor="good">{t("common.good")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="fair" />
                      <Label htmlFor="fair">{t("common.fair")}</Label>
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
                  {t("listing.specifications")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{t("listing.area")} *</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.squareMeters}
                    onChange={(e) =>
                      handleInputChange("squareMeters", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>{t("listing.features")}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
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
                  {t("listing.imagesLocation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{t("listing.photos")}</Label>
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
                          <span className="text-sm text-gray-600">
                            {t("listing.addPhotos")}
                          </span>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("listing.location")} *
                  </Label>
                  <div className="space-y-3">
                    <Input
                      placeholder={t("listing.streetAddress")}
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <Input
                        placeholder={t("listing.city")}
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder={t("listing.state")}
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder={t("listing.zipCode")}
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      {t("listing.contactPhone")} *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      required
                    />
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
                  {t("listing.pricingAvailability")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{t("listing.listingType")} *</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="forRent"
                        checked={formData.isForRent}
                        onCheckedChange={(checked) =>
                          handleInputChange("isForRent", checked)
                        }
                      />
                      <Label htmlFor="forRent">
                        {t("listing.availableForRent")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="forSale"
                        checked={formData.isForSale}
                        onCheckedChange={(checked) =>
                          handleInputChange("isForSale", checked)
                        }
                      />
                      <Label htmlFor="forSale">
                        {t("listing.availableForSale")}
                      </Label>
                    </div>
                  </div>
                </div>

                {formData.isForRent && (
                  <div className="space-y-4">
                    <Label>{t("listing.rentalPricing")} *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">
                          {t("listing.dailyRate")}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.dailyRate}
                          onChange={(e) =>
                            handleInputChange("dailyRate", e.target.value)
                          }
                          required={formData.isForRent}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          {t("listing.weeklyRate")}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.weeklyRate}
                          onChange={(e) =>
                            handleInputChange("weeklyRate", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          {t("listing.monthlyRate")}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.monthlyRate}
                          onChange={(e) =>
                            handleInputChange("monthlyRate", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm">
                          {t("listing.securityDeposit")} *
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.securityDeposit}
                          onChange={(e) =>
                            handleInputChange("securityDeposit", e.target.value)
                          }
                          required={formData.isForRent}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          {t("listing.minRentalDays")}
                        </Label>
                        <Input
                          type="number"
                          value={formData.minRentalDays}
                          onChange={(e) =>
                            handleInputChange("minRentalDays", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm">
                          {t("listing.maxRentalDays")}
                        </Label>
                        <Input
                          type="number"
                          value={formData.maxRentalDays}
                          onChange={(e) =>
                            handleInputChange("maxRentalDays", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.isForSale && (
                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">
                      {t("listing.salePrice")} *
                    </Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      value={formData.sellPrice}
                      onChange={(e) =>
                        handleInputChange("sellPrice", e.target.value)
                      }
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
              {t("common.previous")}
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              >
                {t("common.next")}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  isSubmitting || (!formData.isForRent && !formData.isForSale)
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("listing.updating")}
                  </>
                ) : (
                  t("listing.updateListing")
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
