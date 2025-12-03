"use client";

import { useState, useEffect } from "react";
import { PolymarketEvent } from "@/lib/types";

interface FilterState {
  totalVolume: [number, number];
  volume24hr: [number, number];
  liquidity: [number, number];
  newEvents: boolean;
  endingSoon: boolean;
}

export function useEventFilters() {
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    totalVolume: [0, 1000000000],
    volume24hr: [0, 10000000],
    liquidity: [0, 10000000],
    newEvents: false,
    endingSoon: false,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.totalVolume[0] > 0) params.append('minTotalVolume', filters.totalVolume[0].toString());
      if (filters.totalVolume[1] < 1000000000) params.append('maxTotalVolume', filters.totalVolume[1].toString());
      
      if (filters.volume24hr[0] > 0) params.append('minVolume24hr', filters.volume24hr[0].toString());
      if (filters.volume24hr[1] < 10000000) params.append('maxVolume24hr', filters.volume24hr[1].toString());
      
      if (filters.liquidity[0] > 0) params.append('minLiquidity', filters.liquidity[0].toString());
      if (filters.liquidity[1] < 10000000) params.append('maxLiquidity', filters.liquidity[1].toString());
      
      if (filters.newEvents) params.append('new', 'true');
      if (filters.endingSoon) params.append('endingSoon', 'true');
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

  const handleFilterChange = (key: string, value: [number, number] | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      totalVolume: [0, 1000000000],
      volume24hr: [0, 10000000],
      liquidity: [0, 10000000],
      newEvents: false,
      endingSoon: false,
    });
  };

  const applyFilters = () => {
    fetchEvents();
  };

  return {
    events,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    clearFilters,
    applyFilters,
  };
}