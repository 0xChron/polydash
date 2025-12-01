"use client";

import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterPopover from "@/components/FilterPopover";
import MarketTable from "@/components/MarketTable";
import { useMarketFilters } from "@/hooks/useMarketFilters";

export default function MarketsPage() {
  const marketFilters = useMarketFilters();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-white min-h-screen p-8">
        <div className="flex gap-4 mb-6">
          <SearchBar
            value={marketFilters.searchQuery}
            onChange={marketFilters.setSearchQuery}
            onSearch={marketFilters.applyFilters}
            placeholder="search active polymarket markets"
          />
          <FilterPopover
            filters={marketFilters.filters}
            onFilterChange={marketFilters.handleFilterChange}
            onClear={marketFilters.clearFilters}
            onApply={marketFilters.applyFilters}
            type="markets"
          />  
        </div>

        <MarketTable markets={marketFilters.markets} loading={marketFilters.loading} />
      </div>
    </div>
  );
}