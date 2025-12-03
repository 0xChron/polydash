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

interface EventMarketTableProps {
  events: PolymarketEvent[];
  loading: boolean;
}

type SortKey = 'volume' | 'volume24hr' | 'liquidity' | 'endDate';
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
      <Table className="table-fixed">
      <TableHeader>
        <TableRow className="hover:bg-transparent bg-gray-50 border-b border-gray-200">
          <TableHead className="w-12"></TableHead>
          <TableHead className="w-16"></TableHead>
          <TableHead className="font-semibold text-gray-700 w-[40%]">market</TableHead>
          
          {/* Market-specific columns - only shown when expanded */}
          <TableHead className="text-center font-semibold text-gray-700 w-[6%]">yes</TableHead>
          <TableHead className="text-center font-semibold text-gray-700 w-[6%]">no</TableHead>
          <TableHead className="text-center font-semibold text-gray-700 w-[7%]">24h Δ</TableHead>

          <TableHead className="text-right font-semibold text-gray-700 w-[9%]">
            <button
              onClick={() => handleSort('volume')}
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
            >
              total vol
              <SortIcon columnKey="volume" />
            </button>
          </TableHead>

          <TableHead className="text-right font-semibold text-gray-700 w-[8%]">
            <button
              onClick={() => handleSort('volume24hr')}
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
            >
              24h vol
              <SortIcon columnKey="volume24hr" />
            </button>
          </TableHead>

          <TableHead className="text-right font-semibold text-gray-700 w-[8%]">
            <button
              onClick={() => handleSort('liquidity')}
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
            >
              liquidity
              <SortIcon columnKey="liquidity" />
            </button>
          </TableHead>

          <TableHead className="text-right font-semibold text-gray-700 w-[8%] pr-6">
            <button
              onClick={() => handleSort('endDate')}
              className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
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

            return (
              <React.Fragment key={event.eventId}>
                {/* Event Row */}
                <TableRow 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => hasMarkets && toggleEvent(event.eventId)}
                >
                  <TableCell className="pl-4">
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
                  <TableCell>
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={40}
                      height={40}
                      className="rounded object-cover aspect-square"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{event.title}</span>
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
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>

                  <TableCell className="text-right font-medium">
                    {formatCurrency(event.volume)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(event.volume24hr)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(event.liquidity)}
                  </TableCell>
                  <TableCell className="text-right text-gray-600 pr-6">
                    {formatDate(event.endDate)}
                  </TableCell>
                </TableRow>

                {/* Market Rows (shown when expanded) */}
                {isExpanded && event.markets && event.markets.map((market) => (
                  <TableRow 
                    key={market.marketId}
                    className="border-b hover:bg-blue-50/30 bg-gray-50/50"
                  >
                    <TableCell></TableCell>
                    <TableCell>
                      <Image
                        src={market.image}
                        alt={market.question}
                        width={32}
                        height={32}
                        className="rounded object-cover aspect-square"
                      >
                      </Image>
                    </TableCell>
                    <TableCell className="pl-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{market.groupItemTitle}</span>
                        {market.groupItemTitle && (
                          <span className="text-xs text-gray-500">{market.groupItemTitle}</span>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Market-specific data */}
                    <TableCell className="text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                        {formatPrice(market.outcomeYesPrice)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700">
                        {formatPrice(market.outcomeNoPrice)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        market.oneDayPriceChange >= 0 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {formatPercentage(market.oneDayPriceChange)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-sm">
                      {formatCurrency(market.volume)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(market.volume24hr)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(market.liquidity)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {formatDate(event.endDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

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