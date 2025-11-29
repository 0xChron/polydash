// components/FilterPopover.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Filter, TrendingUp, Clock, Calendar, Droplets } from "lucide-react";

interface FilterState {
  totalVolume: [number, number];
  volume24hr: [number, number];
  volume1wk: [number, number];
  volume1mo: [number, number];
  volume1yr: [number, number];
  liquidity: [number, number];
  newEvents: boolean;
  featuredEvents: boolean;
  endingSoon: boolean;
  negRiskMarkets: boolean;
}

interface FilterPopoverProps {
  filters: FilterState;
  onFilterChange: (key: string, value: [number, number] | boolean) => void;
  onClear: () => void;
  onApply: () => void;
}

const formatVolume = (value: number): string => {
  if (value === 0) return "$0";
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

export default function FilterPopover({ filters, onFilterChange, onClear, onApply }: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-full px-6 gap-2 whitespace-nowrap">
          <Filter className="h-4 w-4" />
          filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg mb-1">filter events</h4>
            <p className="text-sm text-gray-500">refine your search with filters</p>
          </div>

          <div className="space-y-3">
            {/* Total Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="totalVolume" className="text-sm font-medium flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
                  all time volume
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.totalVolume[0])} - {formatVolume(filters.totalVolume[1])}
                </span>
              </div>
              <Slider
                id="totalVolume"
                min={0}
                max={1000000000}
                step={10000}
                value={filters.totalVolume}
                onValueChange={(value) => onFilterChange("totalVolume", value as [number, number])}
                className="w-full"
              />
            </div>

            {/* 24hr Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="volume24hr" className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  24 hour volume
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.volume24hr[0])} - {formatVolume(filters.volume24hr[1])}
                </span>
              </div>
              <Slider
                id="volume24hr"
                min={0}
                max={10000000}
                step={1000}
                value={filters.volume24hr}
                onValueChange={(value) => onFilterChange("volume24hr", value as [number, number])}
                className="w-full"
              />
            </div>

            {/* 1 Week Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="volume1wk" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  1 week volume
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.volume1wk[0])} - {formatVolume(filters.volume1wk[1])}
                </span>
              </div>
              <Slider
                id="volume1wk"
                min={0}
                max={50000000}
                step={5000}
                value={filters.volume1wk}
                onValueChange={(value) => onFilterChange("volume1wk", value as [number, number])}
                className="w-full"
              />
            </div>

            {/* 1 Month Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="volume1mo" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  1 month volume
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.volume1mo[0])} - {formatVolume(filters.volume1mo[1])}
                </span>
              </div>
              <Slider
                id="volume1mo"
                min={0}
                max={100000000}
                step={10000}
                value={filters.volume1mo}
                onValueChange={(value) => onFilterChange("volume1mo", value as [number, number])}
                className="w-full"
              />
            </div>

            {/* 1 Year Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="volume1yr" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-500" />
                  1 year volume
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.volume1yr[0])} - {formatVolume(filters.volume1yr[1])}
                </span>
              </div>
              <Slider
                id="volume1yr"
                min={0}
                max={1000000000}
                step={50000}
                value={filters.volume1yr}
                onValueChange={(value) => onFilterChange("volume1yr", value as [number, number])}
                className="w-full"
              />
            </div>

            {/* Liquidity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="liquidity" className="text-sm font-medium flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-gray-500" />
                  liquidity
                </Label>
                <span className="text-xs text-gray-500">
                  {formatVolume(filters.liquidity[0])} - {formatVolume(filters.liquidity[1])}
                </span>
              </div>
              <Slider
                id="liquidity"
                min={0}
                max={10000000}
                step={1000}
                value={filters.liquidity}
                onValueChange={(value) => onFilterChange("liquidity", value as [number, number])}
                className="w-full"
              />
            </div>
          </div>

          {/* Checkboxes in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newEvents"
                checked={filters.newEvents}
                onChange={(e) => onFilterChange("newEvents", e.target.checked)}
                className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black appearance-none checked:bg-black border-2 cursor-pointer"
                style={{
                  backgroundImage: filters.newEvents
                    ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                    : 'none',
                }}
              />
              <Label htmlFor="newEvents" className="text-sm font-medium cursor-pointer">
                new
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featuredEvents"
                checked={filters.featuredEvents}
                onChange={(e) => onFilterChange("featuredEvents", e.target.checked)}
                className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black appearance-none checked:bg-black border-2 cursor-pointer"
                style={{
                  backgroundImage: filters.featuredEvents
                    ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                    : 'none',
                }}
              />
              <Label htmlFor="featuredEvents" className="text-sm font-medium cursor-pointer">
                featured
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="endingSoon"
                checked={filters.endingSoon}
                onChange={(e) => onFilterChange("endingSoon", e.target.checked)}
                className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black appearance-none checked:bg-black border-2 cursor-pointer"
                style={{
                  backgroundImage: filters.endingSoon
                    ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                    : 'none',
                }}
              />
              <Label htmlFor="endingSoon" className="text-sm font-medium cursor-pointer">
                ending soon
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="negRiskMarkets"
                checked={filters.negRiskMarkets}
                onChange={(e) => onFilterChange("negRiskMarkets", e.target.checked)}
                className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black appearance-none checked:bg-black border-2 cursor-pointer"
                style={{
                  backgroundImage: filters.negRiskMarkets
                    ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                    : 'none',
                }}
              />
              <Label htmlFor="negRiskMarkets" className="text-sm font-medium cursor-pointer">
                negative risk
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button variant="outline" className="flex-1 rounded-full" onClick={onClear}>
              clear
            </Button>
            <Button className="flex-1 rounded-full" onClick={onApply}>
              apply filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}