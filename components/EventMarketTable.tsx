'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PolymarketEvent, PolymarketMarket } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, ChevronDown } from "lucide-react";
import React from "react";
import Image from "next/image";

const formatCurrency = (value: number) => {
  if (value > 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value > 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value > 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(2)}%`;
}

const formatPrice = (value: number): string => {
  return `${(value * 100).toFixed(1)}¢`;
};

const calculateVLR = (volume: number, liquidity: number): number => {
  if (liquidity === 0 || !liquidity) return 0;
  return volume / liquidity;
};

const getVLRColorClass = (vlr: number): string => {
  if (vlr === 0) return 'bg-red-50 text-red-700';
  if (vlr < 0.1) return 'bg-orange-50 text-orange-700';
  if (vlr < 3) return 'bg-yellow-50 text-yellow-700';
  if (vlr < 20) return 'bg-green-50 text-green-700';
  return 'bg-orange-50 text-orange-700';
};

interface EventMarketTableProps {
  events: PolymarketEvent[];
  loading: boolean;
}

type SortKey = 'volume' | 'volume24hr' | 'liquidity' | 'volumeToLiquidityRatio' | 'endDate';
type SortOrder = 'asc' | 'desc' | null;

const ITEMS_PER_PAGE = 50;

export default function EventMarketTable({ events, loading }: EventMarketTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  // Handle sort
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortOrder === 'desc') {
        setSortOrder('asc');
      } else if (sortOrder === 'asc') {
        setSortOrder(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const sortedEvents = useMemo(() => {
    if (!sortKey || !sortOrder) return events;

    return [...events].sort((a, b) => {
      let aValue: number | Date;
      let bValue: number | Date;

      if (sortKey === 'endDate') {
        aValue = new Date(a[sortKey]);
        bValue = new Date(b[sortKey]);
      } else if (sortKey === 'volumeToLiquidityRatio') {
        aValue = calculateVLR(a.volume24hr, a.liquidity);
        bValue = calculateVLR(b.volume24hr, b.liquidity);
      } else {
        aValue = a[sortKey];
        bValue = b[sortKey];
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [events, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  
  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedEvents.slice(startIndex, endIndex);
  }, [sortedEvents, currentPage]);
  
  useMemo(() => {
    setCurrentPage(1);
  }, [events.length]);

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-3.5 w-3.5 text-black" />;
    }
    return <ArrowDown className="h-3.5 w-3.5 text-black" />;
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">loading markets...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">no markets found. try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      {/* Scrollable container with fixed height */}
      <div className="overflow-auto max-h-[calc(100vh-300px)]">
        <Table className="min-w-[1000px]">
          <TableHeader className="sticky top-0 z-10 bg-gray-50">
            <TableRow className="hover:bg-transparent border-b border-gray-200">
              <TableHead className="w-[40px] min-w-[40px] bg-gray-50"></TableHead>
              <TableHead className="w-[50px] min-w-[50px] bg-gray-50"></TableHead>
              <TableHead className="font-semibold text-gray-700 w-[300px] min-w-[200px] bg-gray-50">market</TableHead>
              
              {/* Market-specific columns */}
              <TableHead className="text-center font-semibold text-gray-700 w-[80px] min-w-[80px] bg-gray-50">yes</TableHead>
              <TableHead className="text-center font-semibold text-gray-700 w-[80px] min-w-[80px] bg-gray-50">no</TableHead>
              <TableHead className="text-center font-semibold text-gray-700 w-[90px] min-w-[90px] bg-gray-50">24h Δ</TableHead>

              <TableHead className="text-right font-semibold text-gray-700 w-[110px] min-w-[100px] bg-gray-50">
                <button
                  onClick={() => handleSort('volume')}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors ml-auto whitespace-nowrap"
                >
                  volume
                  <SortIcon columnKey="volume" />
                </button>
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700 w-[110px] min-w-[100px] bg-gray-50">
                <button
                  onClick={() => handleSort('volume24hr')}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors ml-auto whitespace-nowrap"
                >
                  24h vol
                  <SortIcon columnKey="volume24hr" />
                </button>
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700 w-[110px] min-w-[100px] bg-gray-50">
                <button
                  onClick={() => handleSort('liquidity')}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors ml-auto whitespace-nowrap"
                >
                  liquidity
                  <SortIcon columnKey="liquidity" />
                </button>
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700 w-[90px] min-w-[90px] bg-gray-50">
                <button
                  onClick={() => handleSort('volumeToLiquidityRatio')}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors ml-auto whitespace-nowrap"
                >
                  vol-liq ratio
                  <SortIcon columnKey="volumeToLiquidityRatio" />
                </button>
              </TableHead>

              <TableHead className="text-right font-semibold text-gray-700 w-[120px] min-w-[100px] pr-6 bg-gray-50">
                <button
                  onClick={() => handleSort('endDate')}
                  className="inline-flex items-center gap-1 hover:text-black transition-colors ml-auto whitespace-nowrap"
                >
                  end date
                  <SortIcon columnKey="endDate" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEvents.map((event) => {
              const isExpanded = expandedEvents.has(event.eventId);
              const hasMarkets = event.markets && event.markets.length > 0;
              const eventVLR = calculateVLR(event.volume24hr, event.liquidity);

              return (
                <React.Fragment key={event.eventId}>
                  {/* Event Row */}
                  <TableRow 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => hasMarkets && toggleEvent(event.eventId)}
                  >
                    <TableCell className="pl-2 min-w-[40px]">
                      {hasMarkets && (
                        <button 
                          className={`p-1 hover:bg-gray-200 rounded-sm transition-all duration-200 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:bg-gray-200 ${
                            isExpanded 
                              ? "shadow-[inset_0_3px_6px_rgba(0.1,0.1,0.1,0.1)] translate-y-[2px] bg-gray-200" 
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEvent(event.eventId);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="py-3 min-w-[50px]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={32}
                        height={32}
                        className="rounded object-cover aspect-square"
                      />
                    </TableCell>  
                    <TableCell className="font-medium py-3 min-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://polymarket.com/event/${event.slug}`, '_blank');
                              }}
                              className="line-clamp-2 text-left hover:underline"
                            >
                              {event.title}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xl text-center">
                            <p>{event.description}</p>
                          </TooltipContent>
                        </Tooltip>
                        {event.new && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded w-fit">
                            NEW
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Empty cells for market columns */}
                    <TableCell className="min-w-[80px]"></TableCell>
                    <TableCell className="min-w-[80px]"></TableCell>
                    <TableCell className="min-w-[90px]"></TableCell>

                    <TableCell className="text-right font-medium py-3 min-w-[100px]">
                      {formatCurrency(event.volume)}
                    </TableCell>
                    <TableCell className="text-right font-medium py-3 min-w-[100px]">
                      {formatCurrency(event.volume24hr)}
                    </TableCell>
                    <TableCell className="text-right font-medium py-3 min-w-[100px]">
                      {formatCurrency(event.liquidity)}
                    </TableCell>
                    <TableCell className="text-right py-3 min-w-[90px]">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getVLRColorClass(eventVLR)}`}>
                        {eventVLR.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium pr-6 py-3 min-w-[100px]">
                      {formatDate(event.endDate)}
                    </TableCell>
                  </TableRow>

                  {/* Market Rows (shown when expanded) */}
                  {isExpanded && event.markets && event.markets.map((market) => {
                    const marketVLR = calculateVLR(market.volume24hr, market.liquidity);
                    
                    return (
                      <TableRow 
                        key={market.marketId}
                        className="border-b hover:bg-blue-50/30 bg-gray-50/50"
                      >
                        <TableCell className="min-w-[40px]"></TableCell>
                        <TableCell className="py-3 min-w-[50px]">
                          <Image
                            src={market.image}
                            alt={market.question}
                            width={32}
                            height={32}
                            className="rounded object-cover aspect-square"
                          />
                        </TableCell>
                        <TableCell className="pl-8 py-3 min-w-[200px]">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm line-clamp-2">{market.groupItemTitle}</span>
                          </div>
                        </TableCell>
                        
                        {/* Market-specific data */}
                        <TableCell className="text-center py-3 min-w-[80px]">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                            {formatPrice(market.outcomeYesPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-3 min-w-[80px]">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700">
                            {formatPrice(market.outcomeNoPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-3 min-w-[90px]">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            market.oneDayPriceChange >= 0 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {formatPercentage(market.oneDayPriceChange)}
                          </span>
                        </TableCell>

                        <TableCell className="text-right py-3 min-w-[100px]">
                          {formatCurrency(market.volume)}
                        </TableCell>
                        <TableCell className="text-right py-3 min-w-[100px]">
                          {formatCurrency(market.volume24hr)}
                        </TableCell>
                        <TableCell className="text-right py-3 min-w-[100px]">
                          {formatCurrency(market.liquidity)}
                        </TableCell>
                        <TableCell className="text-right py-3 min-w-[90px]">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getVLRColorClass(marketVLR)}`}>
                            {marketVLR.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6 py-3 min-w-[100px]">
                          {formatDate(event.endDate)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={events.length}
          />
        </div>
      )}
    </div>
  );
}