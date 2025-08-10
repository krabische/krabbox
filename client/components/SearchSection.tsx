<<<<<<< HEAD
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarDays, MapPin, Search } from "lucide-react";

export function SearchSection() {
  const { t } = useLanguage();
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function SearchSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isForRent, setIsForRent] = useState(true);
  const [isForSale, setIsForSale] = useState(false);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (startDate) searchParams.set('startDate', startDate);
    if (endDate) searchParams.set('endDate', endDate);
    if (isForRent) searchParams.set('rent', 'true');
    if (isForSale) searchParams.set('sale', 'true');
    
    navigate(`/browse?${searchParams.toString()}`);
  };
>>>>>>> origin/main

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {t("search.where")}
            </label>
            <Input
<<<<<<< HEAD
              placeholder={t("search.placeholder")}
=======
              placeholder="Address, city, area..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
>>>>>>> origin/main
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
<<<<<<< HEAD
              {t("search.startDate")}
            </label>
            <Input
              type="date"
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {t("search.endDate")}
=======
              Start Date
>>>>>>> origin/main
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Search Button */}
          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-sm font-medium text-gray-700 opacity-0">
              {t("search.search")}
            </label>
            <Button 
              onClick={handleSearch}
              className="w-full h-10 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              {t("search.search")}
            </Button>
          </div>
        </div>

<<<<<<< HEAD
=======
        {/* Listing Type Selection */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Listing Type</Label>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rent"
                    checked={isForRent}
                    onCheckedChange={setIsForRent}
                  />
                  <Label htmlFor="rent" className="text-sm">For Rent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sale"
                    checked={isForSale}
                    onCheckedChange={setIsForSale}
                  />
                  <Label htmlFor="sale" className="text-sm">For Sale</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

>>>>>>> origin/main
        {/* Quick filters */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {t("filters.popularTypes")}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "garage", label: t("category.garage") },
              { key: "shed", label: t("category.shed") },
              { key: "pantry", label: t("category.pantry") },
              { key: "cell", label: t("category.cell") },
              { key: "container", label: t("category.container") },
              { key: "largeSpace", label: t("category.largeSpace") },
            ].map((type) => (
              <Button
                key={type.key}
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 hover:border-primary hover:text-primary"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
