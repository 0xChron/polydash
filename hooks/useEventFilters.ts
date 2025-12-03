"use client";

import { useState, useEffect } from "react";
import { PolymarketEvent } from "@/lib/types";

interface FilterState {
  totalVolume: [number, number];
  volume24hr: [number, number];
  liquidity: [number, number];
  yesPrice: [number, number];
  noPrice: [number, number];
  newMarkets: boolean; 
  endingSoon: boolean;
}

export function useEventFilters() {
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    totalVolume: [0, 1000000000],
    volume24hr: [0, 10000000],
    liquidity: [0, 10000000],
    yesPrice: [0, 1],
    noPrice: [0, 1],
    newMarkets: false,
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
      
      if (filters.yesPrice[0] > 0) params.append('minYesPrice', filters.yesPrice[0].toString());
      if (filters.yesPrice[1] < 1) params.append('maxYesPrice', filters.yesPrice[1].toString());
      
      if (filters.noPrice[0] > 0) params.append('minNoPrice', filters.noPrice[0].toString());
      if (filters.noPrice[1] < 1) params.append('maxNoPrice', filters.noPrice[1].toString());
      
      if (filters.newMarkets) params.append('newMarkets', 'true');
      if (filters.endingSoon) params.append('endingSoon', 'true');
      if (searchQuery) params.append('search', searchQuery);
      
      // Add categories to query params
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(category => {
          params.append('categories', category);
        });
      }

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

  // Auto-fetch when categories change
  useEffect(() => {
    fetchEvents();
  }, [selectedCategories]);

  const handleFilterChange = (key: string, value: [number, number] | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      // If clicking the same category, deselect it
      if (prev.includes(category)) {
        return [];
      } else {
        // Otherwise, select only this category (single selection)
        return [category];
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      totalVolume: [0, 1000000000],
      volume24hr: [0, 10000000],
      liquidity: [0, 10000000],
      yesPrice: [0, 1],
      noPrice: [0, 1],
      newMarkets: false,
      endingSoon: false,
    });
    setSelectedCategories([]);
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
    selectedCategories,
    handleCategoryToggle,
    clearFilters,
    applyFilters,
  };
}