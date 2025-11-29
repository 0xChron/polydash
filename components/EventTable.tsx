// components/EventTable.tsx
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
import { PolymarketEvent } from "@/lib/types";
import { Pagination } from "@/components/ui/pagination";

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

interface EventTableProps {
  events: PolymarketEvent[];
  loading: boolean;
}

const ITEMS_PER_PAGE = 50;

export default function EventTable({ events, loading }: EventTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  
  // Get current page items
  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return events.slice(startIndex, endIndex);
  }, [events, currentPage]);

  // Reset to page 1 when events change (e.g., after filtering)
  useMemo(() => {
    setCurrentPage(1);
  }, [events.length]);

  if (loading) {
    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden p-8 text-center">
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full border border-gray-200 rounded-lg overflow-hidden p-8 text-center">
        <p className="text-gray-500">No events found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50">
            <TableHead className="w-16 pl-6"></TableHead>
            <TableHead className="font-semibold text-gray-700">Event</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Total Volume</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">24 Hour Volume</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Liquidity</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEvents.map((event) => (
            <TableRow 
              key={event.eventId} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => window.open(`https://polymarket.com/event/${event.slug}`, '_blank')}
            >
              <TableCell className="pl-6">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="rounded-md object-cover aspect-square"
                  height={32}
                  width={32}
                />
              </TableCell>
              <TableCell className="font-medium max-w-md">
                <div className="truncate">{event.title}</div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.totalVolume)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.volume24hr)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.liquidity)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900 pr-6">
                {formatDate(event.endDate)}
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
        totalItems={events.length}
      />
    </div>
  );
}