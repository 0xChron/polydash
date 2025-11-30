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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface MarketTableProps {
  markets: PolymarketMarket[];
  loading: boolean;
}

type SortKey = 'totalVolume' | 'volume24hr' | 'liquidity' | 'endDate';
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
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden p-8 text-center">
        <p className="text-gray-500">Loading markets...</p>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden p-8 text-center">
        <p className="text-gray-500">No markets found. Try adjusting your filters.</p>
      </div>
    );
  }


  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50">
            <TableHead className="w-16 pl-6"></TableHead>
            <TableHead className="font-semibold text-gray-700">Market</TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700">
              <button
                onClick={() => handleSort('totalVolume')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                Total Volume
                <SortIcon columnKey="totalVolume" />
              </button>
            </TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700">
              <button
                onClick={() => handleSort('volume24hr')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                24 Hour Volume
                <SortIcon columnKey="volume24hr" />
              </button>
            </TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700">
              <button
                onClick={() => handleSort('liquidity')}
                className="inline-flex items-center gap-1.5 hover:text-black transition-colors ml-auto"
              >
                Liquidity
                <SortIcon columnKey="liquidity" />
              </button>
            </TableHead>
            
            <TableHead className="text-right font-semibold text-gray-700 pr-6">
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
          {currentMarkets.map((market) => (
            <TableRow 
              key={market.marketId} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => window.open(`https://polymarket.com/event/${market.slug}`, '_blank')}
            >
              <TableCell className="pl-6">
                {market.image ? (
                  <img 
                    src={market.image} 
                    alt={market.title}
                    className="rounded-md object-cover aspect-square"
                    height={32}
                    width={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">?</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium max-w-md">
                <div className="truncate">{market.title}</div>
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
              <TableCell className="text-right font-medium text-gray-900 pr-6">
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