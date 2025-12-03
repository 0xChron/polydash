"use client";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterPopover from "@/components/FilterPopover";
import EventMarketTable from "@/components/EventMarketTable";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function MarketsPage() {
  const eventFilters = useEventFilters();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-white min-h-screen p-8">
        <div className="flex gap-4 mb-6">
          <SearchBar
            value={eventFilters.searchQuery}
            onChange={eventFilters.setSearchQuery}
            onSearch={eventFilters.applyFilters}
            placeholder="search events and markets"
          />
          <FilterPopover
            filters={eventFilters.filters}
            onFilterChange={eventFilters.handleFilterChange}
            onClear={eventFilters.clearFilters}
            onApply={eventFilters.applyFilters}
            type="markets"
          />  
        </div>

        <EventMarketTable events={eventFilters.events} loading={eventFilters.loading} />
      </div>
    </div>
  );
}