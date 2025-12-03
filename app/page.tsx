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
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    </div>
  );
}