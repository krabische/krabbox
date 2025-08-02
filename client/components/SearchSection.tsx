import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";

export function SearchSection() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Where
            </label>
            <Input
              placeholder="Airport, hotel, city..."
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Pickup
            </label>
            <Input
              type="date"
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Return
            </label>
            <Input
              type="date"
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 opacity-0">
              Search
            </label>
            <Button className="w-full h-10 bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Popular sizes:</p>
          <div className="flex flex-wrap gap-2">
            {["Carry-on", "Medium", "Large", "Extra Large", "Backpack", "Duffel"].map((size) => (
              <Button
                key={size}
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 hover:border-primary hover:text-primary"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
