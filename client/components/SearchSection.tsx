import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarDays, MapPin, Search } from "lucide-react";

export function SearchSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    startDate: "",
    endDate: ""
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.startDate) params.append('startDate', searchData.startDate);
    if (searchData.endDate) params.append('endDate', searchData.endDate);
    
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {t('search.where')}
            </label>
            <Input
              placeholder={t('search.placeholder')}
              value={searchData.location}
              onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {t('search.startDate')}
            </label>
            <Input
              type="date"
              value={searchData.startDate}
              onChange={(e) => setSearchData(prev => ({ ...prev, startDate: e.target.value }))}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              {t('search.endDate')}
            </label>
            <Input
              type="date"
              value={searchData.endDate}
              onChange={(e) => setSearchData(prev => ({ ...prev, endDate: e.target.value }))}
              className="border-gray-200 focus:border-primary"
            />
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 opacity-0">
              {t('search.search')}
            </label>
            <Button 
              onClick={handleSearch}
              className="w-full h-10 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              {t('search.search')}
            </Button>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('filters.popularTypes')}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'garage', label: t('category.garage') },
              { key: 'shed', label: t('category.shed') },
              { key: 'pantry', label: t('category.pantry') },
              { key: 'cell', label: t('category.cell') },
              { key: 'container', label: t('category.container') },
              { key: 'largeSpace', label: t('category.largeSpace') }
            ].map((type) => (
              <Button
                key={type.key}
                variant="outline"
                size="sm"
                onClick={() => {
                  const params = new URLSearchParams();
                  params.append('category', type.key);
                  navigate(`/browse?${params.toString()}`);
                }}
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
