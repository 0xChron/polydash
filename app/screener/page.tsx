"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterPopover from "@/components/FilterPopover";
import CategoryFilters from "@/components/CategoryFilters";
import EventMarketTable from "@/components/EventMarketTable";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function MarketsPage() {
  const eventFilters = useEventFilters();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (eventFilters.events.length > 0 && eventFilters.events[0].fetchDate) {
      setLastUpdated(eventFilters.events[0].fetchDate);
    }
  }, [eventFilters.events]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-white min-h-screen p-4 md:p-8">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-4">
          <SearchBar
            value={eventFilters.searchQuery}
            onChange={eventFilters.setSearchQuery}
            onSearch={eventFilters.applyFilters}
            placeholder="search markets (e.g., fed rates, elections, nba, etc.)"
          />
          <FilterPopover
            filters={eventFilters.filters}
            onFilterChange={eventFilters.handleFilterChange}
            onClear={eventFilters.clearFilters}
            onApply={eventFilters.applyFilters}
            type="markets"
          />  
        </div>

        <div className="mb-4 md:mb-6">
          <CategoryFilters
            selectedCategories={eventFilters.selectedCategories}
            onCategoryToggle={eventFilters.handleCategoryToggle}
          />
        </div>

        {lastUpdated && !eventFilters.loading && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              data last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}

        <EventMarketTable events={eventFilters.events} loading={eventFilters.loading} />
      </div>
    </div>
  );
}