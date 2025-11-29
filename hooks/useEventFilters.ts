"use client";

import { useState, useEffect } from "react";
import { PolymarketEvent } from "@/lib/types";

interface FilterState {
  totalVolume: string;
  volume24hr: string;
  volume1wk: string;
  volume1mo: string;
  volume1yr: string;
  newEvents: boolean;
  featuredEvents: boolean;
}

export function useEventFilters() {
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    totalVolume: "",
    volume24hr: "",
    volume1wk: "",
    volume1mo: "",
    volume1yr: "",
    newEvents: false,
    featuredEvents: false,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.totalVolume) params.append('minTotalVolume', filters.totalVolume);
      if (filters.volume24hr) params.append('minVolume24hr', filters.volume24hr);
      if (filters.volume1wk) params.append('minVolume1wk', filters.volume1wk);
      if (filters.volume1mo) params.append('minVolume1mo', filters.volume1mo);
      if (filters.volume1yr) params.append('minVolume1yr', filters.volume1yr);
      if (filters.newEvents) params.append('new', 'true');
      if (filters.featuredEvents) params.append('featured', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      totalVolume: "",
      volume24hr: "",
      volume1wk: "",
      volume1mo: "",
      volume1yr: "",
      newEvents: false,
      featuredEvents: false,
    });
  };

  return {
    events,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    clearFilters,
    applyFilters: fetchEvents,
  };
}