"use client";

import { useState, useEffect } from "react";
import { PolymarketMarket } from "@/lib/types";

interface FilterState {
  totalVolume: [number, number];
  volume24hr: [number, number];
  volume1mo: [number, number];
  liquidity: [number, number];
  yesPrice: [number, number];
  noPrice: [number, number];
  newMarkets: boolean;
  featuredMarkets: boolean;
  endingSoon: boolean;
  negRiskMarkets: boolean;
}

export function useMarketFilters() {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    totalVolume: [0, 1000000000],
    volume24hr: [0, 10000000],
    volume1mo: [0, 100000000],
    liquidity: [0, 10000000],
    yesPrice: [0, 1],
    noPrice: [0, 1],
    newMarkets: false,
    featuredMarkets: false,
    endingSoon: false,
    negRiskMarkets: false,
  });

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.totalVolume[0] > 0) params.append('minTotalVolume', filters.totalVolume[0].toString());
      if (filters.totalVolume[1] < 1000000000) params.append('maxTotalVolume', filters.totalVolume[1].toString());
      
      if (filters.volume24hr[0] > 0) params.append('minVolume24hr', filters.volume24hr[0].toString());
      if (filters.volume24hr[1] < 1000000) params.append('maxVolume24hr', filters.volume24hr[1].toString());

      if (filters.volume1mo[0] > 0) params.append('minVolume1mo', filters.volume1mo[0].toString());
      if (filters.volume1mo[1] < 100000000) params.append('maxVolume1mo', filters.volume1mo[1].toString());

      if (filters.liquidity[0] > 0) params.append('minLiquidity', filters.liquidity[0].toString());
      if (filters.liquidity[1] < 10000000) params.append('maxLiquidity', filters.liquidity[1].toString());

      if (filters.yesPrice[0] > 0) params.append('minYesPrice', filters.yesPrice[0].toString());
      if (filters.yesPrice[1] < 1) params.append('maxYesPrice', filters.yesPrice[1].toString());

      if (filters.noPrice[0] > 0) params.append('minNoPrice', filters.noPrice[0].toString());
      if (filters.noPrice[1] < 1) params.append('maxNoPrice', filters.noPrice[1].toString());

      if (filters.newMarkets) params.append('new', 'true');
      if (filters.featuredMarkets) params.append('featured', 'true');
      if (filters.endingSoon) params.append('endingSoon', 'true');
      if (filters.negRiskMarkets) params.append('negRisk', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/markets?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setMarkets(data.data);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const handleFilterChange = (key: string, value: [number, number] | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      totalVolume: [0, 1000000000],
      volume24hr: [0, 10000000],
      volume1mo: [0, 100000000],
      liquidity: [0, 10000000],
      yesPrice: [0, 1],
      noPrice: [0, 1],
      newMarkets: false,
      featuredMarkets: false,
      endingSoon: false,
      negRiskMarkets: false,
    });
  };

  return {
    markets,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    clearFilters,
    applyFilters: fetchMarkets,
  };
}