"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterPopover from "@/components/FilterPopover";
import EventTable from "@/components/EventTable";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function Home() {
  const [activeTab, setActiveTab] = useState("events");
  const {
    events,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    clearFilters,
    applyFilters,
  } = useEventFilters();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white min-h-screen p-8">
        {activeTab === "events" ? (
          <>
            <div className="flex gap-4 mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={applyFilters}
              />
              <FilterPopover
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={clearFilters}
                onApply={applyFilters}
              />
            </div>
            <EventTable events={events} loading={loading} />
          </>
        ) : (
          <div>Markets content</div>
        )}
      </div>
    </div>
  );
}