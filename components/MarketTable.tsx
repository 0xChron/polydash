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
import { PolymarketMarket } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
  return `${(value * 100).toFixed(2)}%`;
}

const formatPrice = (value: number): string => {
  if (value === 1) return "$1";
  if (value === 0) return "$0";
  return `${(value * 100).toFixed(2)}¢`;
};

// Helper to get color classes for Yes price
const getYesPriceColor = (price: number) => {
  return 'text-green-700 bg-green-50';
};

// Helper to get color classes for No price
const getNoPriceColor = (price: number) => {
  return 'text-red-700 bg-red-50';
};

interface MarketTableProps {
  markets: PolymarketMarket[];
  loading: boolean;
}

type SortKey = 'totalVolume' | 'volume24hr' | 'liquidity' | 'endDate' | 'outcomeYesPrice' | 'outcomeNoPrice' | 'oneDayPriceChange';
type SortOrder = 'asc' | 'desc' | null;

const ITEMS_PER_PAGE = 50;

export default function MarketTable({ markets, loading }: MarketTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // Handle sort
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Cycle through: desc -> asc -> null
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
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedMarkets = useMemo(() => {
    if (!sortKey || !sortOrder) return markets;

    return [...markets].sort((a, b) => {
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
  }, [markets, sortKey, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedMarkets.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentMarkets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedMarkets.slice(startIndex, endIndex);
  }, [sortedMarkets, currentPage]);
  
  // Reset to page 1 when markets change (e.g., after filtering)
  useMemo(() => {
    setCurrentPage(1);
  }, [markets.length]);

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
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">Loading markets...</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">No markets found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50 border-b border-gray-200">
            <TableHead className="w-16 pl-6"></TableHead>
            <TableHead className="font-semibold text-gray-700 w-[35%]">Market</TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700 w-[7%]">
              <button
                onClick={() => handleSort('outcomeYesPrice')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                Yes
                <SortIcon columnKey="outcomeYesPrice" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[7%]">
              <button
                onClick={() => handleSort('outcomeNoPrice')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                No
                <SortIcon columnKey="outcomeNoPrice" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[9%]">
              <button
                onClick={() => handleSort('oneDayPriceChange')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                24h change
                <SortIcon columnKey="oneDayPriceChange" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[10%]">
              <button
                onClick={() => handleSort('totalVolume')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                Total Volume
                <SortIcon columnKey="totalVolume" />
              </button>
            </TableHead>

            <TableHead className="text-right font-semibold text-gray-700 w-[10%]">
              <button
                onClick={() => handleSort('volume24hr')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                24h Volume
                <SortIcon columnKey="volume24hr" />
              </button>
            </TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700 w-[9%]">
              <button
                onClick={() => handleSort('liquidity')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                Liquidity
                <SortIcon columnKey="liquidity" />
              </button>
            </TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700 w-[9%] pr-6">
              <button
                onClick={() => handleSort('endDate')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                End Date
                <SortIcon columnKey="endDate" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMarkets.map((market, index) => (
            <TableRow 
              key={market.marketId} 
              className={`
                cursor-pointer transition-all duration-200 h-20 border-b border-gray-100
                hover:bg-blue-50/50 hover:shadow-md hover:scale-[1.01] hover:z-10
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              `}
              onClick={() => window.open(`https://polymarket.com/market/${market.slug}`, '_blank')}
            >
              <TableCell className="pl-6 rounded-l-lg">
                {market.image ? (
                  <img 
                    src={market.image} 
                    alt={market.title}
                    className="rounded-lg object-cover aspect-square ring-2 ring-gray-200"
                    height={32}
                    width={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ring-2 ring-gray-200">
                    <span className="text-xs text-gray-500 font-semibold">?</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <div className="line-clamp-3 leading-snug">{market.title}</div>
              </TableCell>
              <TableCell className="text-right">
                <span className={`inline-block px-2.5 py-1 rounded-full font-semibold text-sm ${getYesPriceColor(market.outcomeYesPrice)}`}>
                  {formatPrice(market.outcomeYesPrice)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`inline-block px-2.5 py-1 rounded-full font-semibold text-sm ${getNoPriceColor(market.outcomeNoPrice)}`}>
                  {formatPrice(market.outcomeNoPrice)}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">
                <span className={market.oneDayPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {market.oneDayPriceChange >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(market.oneDayPriceChange))}
                </span>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(market.totalVolume)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(market.volume24hr)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(market.liquidity)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900 pr-6 rounded-r-lg">
                {formatDate(market.endDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={sortedMarkets.length}
      />
    </div>
  )
}