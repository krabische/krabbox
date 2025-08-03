import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Badge } from "./ui/badge";

const periodOptions = [
  { value: 0, label: "1 Month", months: 1 },
  { value: 1, label: "3 Months", months: 3 },
  { value: 2, label: "6 Months", months: 6 },
  { value: 3, label: "1 Year", months: 12 },
];

export function SearchSection() {
  const [periodValue, setPeriodValue] = useState([0]); // Default to 1 month
  const currentPeriod = periodOptions[periodValue[0]];

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
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Pickup Date
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

        {/* Period Slider */}
        <div className="mt-6 pt-6 border-t">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Storage Period
              </label>
              <Badge variant="secondary" className="px-3 py-1">
                {currentPeriod.label}
              </Badge>
            </div>

            <div className="px-3">
              <Slider
                value={periodValue}
                onValueChange={setPeriodValue}
                max={3}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {periodOptions.map((option) => (
                  <span key={option.value}>{option.label}</span>
                ))}
              </div>
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
