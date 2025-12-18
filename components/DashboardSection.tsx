'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PolymarketEvent, PolymarketMarket } from "@/lib/types";

const formatCurrency = (value: number) => {
  if (value > 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value > 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value > 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(2)}%`;
};

const formatPrice = (value: number): string => {
  return `${(value * 100).toFixed(1)}¢`;
};

interface DashboardSectionProps {
  title: string;
  items: (PolymarketEvent | PolymarketMarket)[];
  type: 'event' | 'market';
  metricType: 'volume24hr' | 'liquidity' | 'priceChange' | 'controversy' | 'confidentBets';
  description: string;
  viewAllLink?: string;
}

export default function DashboardSection({ 
  title, 
  items, 
  type, 
  metricType,
  description,
  viewAllLink = '/screener'
}: DashboardSectionProps) {
  
  const getMetricValue = (item: PolymarketEvent | PolymarketMarket) => {
    switch (metricType) {
      case 'volume24hr':
        return formatCurrency(item.volume24hr);
      case 'liquidity':
        return formatCurrency(item.liquidity);
      case 'priceChange':
        if ('oneDayPriceChange' in item) {
          return formatPercentage(item.oneDayPriceChange);
        }
        return 'N/A';
      case 'controversy':
        if ('outcomeYesPrice' in item) {
          return formatPrice(item.outcomeYesPrice);
        }
        return 'N/A';
      case 'confidentBets':
        if ('outcomeYesPrice' in item && 'outcomeNoPrice' in item) {
          const maxPrice = Math.max(item.outcomeYesPrice || 0, item.outcomeNoPrice || 0);
          return formatPrice(maxPrice);
        }
        return 'N/A';
      default:
        return '';
    }
  };

  const getMetricBadgeClass = (item: PolymarketEvent | PolymarketMarket) => {
    if (metricType === 'priceChange' && 'oneDayPriceChange' in item) {
      return item.oneDayPriceChange >= 0 
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-700 border border-red-200';
    }
    if (metricType === 'controversy') {
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    }
    if (metricType === 'confidentBets' && 'outcomeYesPrice' in item && 'outcomeNoPrice' in item) {
      const yesPrice = item.outcomeYesPrice || 0;
      const noPrice = item.outcomeNoPrice || 0;
      return yesPrice > noPrice
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  };

  const getItemTitle = (item: PolymarketEvent | PolymarketMarket) => {
    if (type === 'event') {
      return (item as PolymarketEvent).title;
    }
    return (item as PolymarketMarket).question;
  };

  const getItemImage = (item: PolymarketEvent | PolymarketMarket) => {
    return item.image || '/placeholder.png';
  };

  const getItemLink = (item: PolymarketEvent | PolymarketMarket) => {
    if (type === 'event') {
      return `https://polymarket.com/event/${(item as PolymarketEvent).slug}`;
    }
    return `https://polymarket.com/market/${(item as PolymarketMarket).slug}`;
  };

  return (
    <Card className="flex flex-col h-[450px]">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-xs">
            ({description})
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <a
                key={type === 'event' ? (item as PolymarketEvent).eventId : (item as PolymarketMarket).marketId}
                href={getItemLink(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="shrink-0 w-8 h-8 relative rounded overflow-hidden bg-gray-200">
                  <Image
                    src={getItemImage(item)}
                    alt={getItemTitle(item)}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {getItemTitle(item)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {type === 'event' ? 'Event' : 'Market'}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${getMetricBadgeClass(item)}`}>
                  {getMetricValue(item)}
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}