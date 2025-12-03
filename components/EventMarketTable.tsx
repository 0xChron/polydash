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
  if (vlr < 10) return 'bg-green-50 text-green-700';
  if (vlr < 50) return 'bg-yellow-50 text-yellow-700';
  if (vlr < 150) return 'bg-orange-50 text-orange-700';
  return 'bg-red-50 text-red-700';
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
        aValue = calculateVLR(a.volume, a.liquidity);
        bValue = calculateVLR(b.volume, b.liquidity);
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
      return <ArrowUpDown className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-gray-400" />;
    }
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-black" />;
    }
    return <ArrowDown className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 text-black" />;
  };

  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-4 md:p-8 text-center">
        <p className="text-gray-500 text-sm md:text-base">loading markets...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden p-4 md:p-8 text-center">
        <p className="text-gray-500 text-sm md:text-base">no markets found. try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="table-fixed min-w-[600px] md:min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50 border-b border-gray-200">
            <TableHead className="w-3 md:w-6"></TableHead>
            <TableHead className="w-6 md:w-8"></TableHead>
            <TableHead className="font-semibold text-gray-700 w-[26%] md:w-[29%] text-xs md:text-sm">market</TableHead>
            
            {/* Market-specific columns - only shown when expanded */}
            <TableHead className="text-center font-semibold text-gray-700 w-[7%] md:w-[6%] text-xs md:text-sm">yes</TableHead>
            <TableHead className="text-center font-semibold text-gray-700 w-[7%] md:w-[6%] text-xs md:text-sm">no</TableHead>
            <TableHead className="text-center font-semibold text-gray-700 w-[8%] md:w-[7%] text-xs md:text-sm">24h Δ</TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[11%] md:w-[9%] text-xs md:text-sm">
              <button
                onClick={() => handleSort('volume')}
                className="inline-flex items-center gap-0.5 md:gap-1 hover:text-black transition-colors ml-auto text-xs md:text-sm whitespace-nowrap"
              >
                vol
                <SortIcon columnKey="volume" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[11%] md:w-[9%] text-xs md:text-sm">
              <button
                onClick={() => handleSort('volume24hr')}
                className="inline-flex items-center gap-0.5 md:gap-1 hover:text-black transition-colors ml-auto text-xs md:text-sm whitespace-nowrap"
              >
                24h
                <SortIcon columnKey="volume24hr" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[11%] md:w-[9%] text-xs md:text-sm">
              <button
                onClick={() => handleSort('liquidity')}
                className="inline-flex items-center gap-0.5 md:gap-1 hover:text-black transition-colors ml-auto text-xs md:text-sm whitespace-nowrap"
              >
                liq
                <SortIcon columnKey="liquidity" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[8%] md:w-[7%] text-xs md:text-sm">
              <button
                onClick={() => handleSort('volumeToLiquidityRatio')}
                className="inline-flex items-center gap-0.5 md:gap-1 hover:text-black transition-colors ml-auto text-xs md:text-sm whitespace-nowrap"
              >
                vlr
                <SortIcon columnKey="volumeToLiquidityRatio" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[11%] md:w-[9%] pr-2 md:pr-6 text-xs md:text-sm">
              <button
                onClick={() => handleSort('endDate')}
                className="inline-flex items-center gap-0.5 md:gap-1 hover:text-black transition-colors ml-auto text-xs md:text-sm whitespace-nowrap"
              >
                end
                <SortIcon columnKey="endDate" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {currentEvents.map((event) => {
              const isExpanded = expandedEvents.has(event.eventId);
              const hasMarkets = event.markets && event.markets.length > 0;
              const eventVLR = calculateVLR(event.volume, event.liquidity);

              return (
                <React.Fragment key={event.eventId}>
                  {/* Event Row */}
                  <TableRow 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => hasMarkets && toggleEvent(event.eventId)}
                  >
                    <TableCell className="pl-1 md:pl-2">
                      {hasMarkets && (
                        <button 
                          className={`p-0.5 md:p-1 hover:bg-gray-200 rounded-sm transition-all duration-200 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:bg-gray-200 ${
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
                            <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="py-2 md:py-3">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={24}
                        height={24}
                        className="rounded object-cover aspect-square md:w-8 md:h-8"
                      />
                    </TableCell>  
                    <TableCell className="font-medium text-xs md:text-sm py-2 md:py-3">
                      <div className="flex flex-col gap-0.5 md:gap-1">
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
                          <span className="text-[10px] md:text-xs bg-blue-100 text-blue-700 px-1.5 md:px-2 py-0.5 rounded w-fit">
                            NEW
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Empty cells for market columns */}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>

                    <TableCell className="text-right font-medium text-xs md:text-sm py-2 md:py-3">
                      {formatCurrency(event.volume)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs md:text-sm py-2 md:py-3">
                      {formatCurrency(event.volume24hr)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs md:text-sm py-2 md:py-3">
                      {formatCurrency(event.liquidity)}
                    </TableCell>
                    <TableCell className="text-right py-2 md:py-3">
                      <span className={`inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${getVLRColorClass(eventVLR)}`}>
                        {eventVLR.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs md:text-sm pr-2 md:pr-6 py-2 md:py-3">
                      {formatDate(event.endDate)}
                    </TableCell>
                  </TableRow>

                  {/* Market Rows (shown when expanded) */}
                  {isExpanded && event.markets && event.markets.map((market) => {
                    const marketVLR = calculateVLR(market.volume, market.liquidity);
                    
                    return (
                      <TableRow 
                        key={market.marketId}
                        className="border-b hover:bg-blue-50/30 bg-gray-50/50"
                      >
                        <TableCell></TableCell>
                        <TableCell className="py-2 md:py-3">
                          <Image
                            src={market.image}
                            alt={market.question}
                            width={24}
                            height={24}
                            className="rounded object-cover aspect-square md:w-8 md:h-8"
                          />
                        </TableCell>
                        <TableCell className="pl-4 md:pl-8 py-2 md:py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[11px] md:text-sm line-clamp-2">{market.groupItemTitle}</span>
                          </div>
                        </TableCell>
                        
                        {/* Market-specific data */}
                        <TableCell className="text-center py-2 md:py-3">
                          <span className="inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium bg-green-50 text-green-700">
                            {formatPrice(market.outcomeYesPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-2 md:py-3">
                          <span className="inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium bg-red-50 text-red-700">
                            {formatPrice(market.outcomeNoPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center py-2 md:py-3">
                          <span className={`inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${
                            market.oneDayPriceChange >= 0 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {formatPercentage(market.oneDayPriceChange)}
                          </span>
                        </TableCell>

                        <TableCell className="text-right text-[11px] md:text-sm py-2 md:py-3">
                          {formatCurrency(market.volume)}
                        </TableCell>
                        <TableCell className="text-right text-[11px] md:text-sm py-2 md:py-3">
                          {formatCurrency(market.volume24hr)}
                        </TableCell>
                        <TableCell className="text-right text-[11px] md:text-sm py-2 md:py-3">
                          {formatCurrency(market.liquidity)}
                        </TableCell>
                        <TableCell className="text-right py-2 md:py-3">
                          <span className={`inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${getVLRColorClass(marketVLR)}`}>
                            {marketVLR.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-[11px] md:text-sm pr-2 md:pr-6 py-2 md:py-3">
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
        <div className="p-2 md:p-4 border-t border-gray-200">
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