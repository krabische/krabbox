import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CalendarDays, MapPin, Search } from "lucide-react";

export function SearchSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (startDate) searchParams.set('startDate', startDate);
    if (endDate) searchParams.set('endDate', endDate);
    
    navigate(`/browse?${searchParams.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Where
            </label>
            <Input
              placeholder="Address, city, area..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Search Button */}
          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-sm font-medium text-gray-700 opacity-0">
              Search
            </label>
            <Button 
              onClick={handleSearch}
              className="w-full h-10 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* End Date */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Popular storage types:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Garage",
              "Shed",
              "Pantry",
              "Storage Cell",
              "Container",
              "Large Space",
            ].map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 hover:border-primary hover:text-primary"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
