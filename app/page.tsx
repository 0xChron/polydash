"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterPopover from "@/components/FilterPopover";
import EventTable from "@/components/EventTable";
import MarketTable from "@/components/MarketTable";
import { useEventFilters } from "@/hooks/useEventFilters";
import { useMarketFilters } from "@/hooks/useMarketFilters";

export default function Home() {
  const [activeTab, setActiveTab] = useState("events");
  const eventFilters = useEventFilters();
  const marketFilters = useMarketFilters();

  const activeFilters = activeTab === "events" ? eventFilters : marketFilters;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white min-h-screen p-8">
        <div className="flex gap-4 mb-6">
          <SearchBar
            value={activeFilters.searchQuery}
            onChange={activeFilters.setSearchQuery}
            onSearch={activeFilters.applyFilters}
            placeholder={`search active polymarket ${activeTab}`}
          />
          <FilterPopover
            filters={activeFilters.filters}
            onFilterChange={activeFilters.handleFilterChange}
            onClear={activeFilters.clearFilters}
            onApply={activeFilters.applyFilters}
            type={activeTab as 'events' | 'markets'}
          />  
        </div>

        {activeTab === "events" ? (
          <EventTable events={eventFilters.events} loading={eventFilters.loading} />
        ) : (
          <MarketTable markets={marketFilters.markets} loading={marketFilters.loading} />
        )}
      </div>
    </div>
  );
}