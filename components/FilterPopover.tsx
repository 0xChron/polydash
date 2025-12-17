"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Filter, TrendingUp, Clock, Calendar, Droplets, TrendingDown } from "lucide-react";
import { useState } from "react";

interface FilterState {
  totalVolume: [number, number];
  volume24hr: [number, number];
  volume1wk?: [number, number];
  volume1mo: [number, number];
  volume1yr?: [number, number];
  liquidity: [number, number];
  yesPrice?: [number, number];
  noPrice?: [number, number];
  newEvents?: boolean;
  featuredEvents?: boolean;
  newMarkets?: boolean;
  featuredMarkets?: boolean;
  endingSoon: boolean;
  negRiskMarkets: boolean;
}

interface FilterPopoverProps {
  filters: FilterState;
  onFilterChange: (key: string, value: [number, number] | boolean) => void;
  onClear: () => void;
  onApply: () => void;
  type?: 'events' | 'markets';
}

const formatVolume = (value: number): string => {
  if (value === 0) return "$0";
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

const formatPrice = (value: number): string => {
  if (value === 1) return "$1";
  if (value === 0) return "$0";
  return `${(value * 100).toFixed(0)}¢`;
};

export default function FilterPopover({ filters, onFilterChange, onClear, onApply, type = 'events' }: FilterPopoverProps) {
  const isNew = type === 'events' ? filters.newEvents : filters.newMarkets;
  const newKey = type === 'events' ? 'newEvents' : 'newMarkets';

  // Local state for price inputs - initialize empty
  const [yesPriceLow, setYesPriceLow] = useState('');
  const [yesPriceHigh, setYesPriceHigh] = useState('');
  const [noPriceLow, setNoPriceLow] = useState('');
  const [noPriceHigh, setNoPriceHigh] = useState('');

  const handleYesPriceChange = (low: string, high: string) => {
    const lowValue = low === '' ? 0 : parseFloat(low);
    const highValue = high === '' ? 1 : parseFloat(high) / 100;
    onFilterChange("yesPrice", [lowValue / 100, highValue]);
  };

  const handleNoPriceChange = (low: string, high: string) => {
    const lowValue = low === '' ? 0 : parseFloat(low);
    const highValue = high === '' ? 1 : parseFloat(high) / 100;
    onFilterChange("noPrice", [lowValue / 100, highValue]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-sm px-6 gap-2 whitespace-nowrap">
          <Filter className="h-4 w-4" />
          filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 max-h-[80vh] overflow-y-auto" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-lg mb-1">filter {type}</h4>
            <p className="text-sm text-gray-500">refine your search with filters</p>
          </div>

          <div className="space-y-3">
            {/* Total Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="totalVolume" className="text-sm font-medium flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
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
                  <Clock className="h-3.5 w-3.5" />
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

            {/* Liquidity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="liquidity" className="text-sm font-medium flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5" />
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

            {/* Yes Price Input - Only for Markets */}
            {type === 'markets' && filters.yesPrice && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5 w-28">
                    <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    yes price (¢)
                  </Label>
                  <div className="flex gap-2 flex-1">
                    <Input
                      type="number"
                      placeholder="low"
                      className="rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                      min={0}
                      max={100}
                      value={yesPriceLow}
                      onChange={(e) => {
                        setYesPriceLow(e.target.value);
                        handleYesPriceChange(e.target.value, yesPriceHigh);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="high"
                      className="rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                      min={0}
                      max={100}
                      value={yesPriceHigh}
                      onChange={(e) => {
                        setYesPriceHigh(e.target.value);
                        handleYesPriceChange(yesPriceLow, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* No Price Input - Only for Markets */}
            {type === 'markets' && filters.noPrice && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5 w-28">
                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                    no price (¢)
                  </Label>
                  <div className="flex gap-2 flex-1">
                    <Input
                      type="number"
                      placeholder="low"
                      className="rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                      min={0}
                      max={100}
                      value={noPriceLow}
                      onChange={(e) => {
                        setNoPriceLow(e.target.value);
                        handleNoPriceChange(e.target.value, noPriceHigh);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="high"
                      className="rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                      min={0}
                      max={100}
                      value={noPriceHigh}
                      onChange={(e) => {
                        setNoPriceHigh(e.target.value);
                        handleNoPriceChange(noPriceLow, e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkboxes in 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new"
                checked={isNew}
                onChange={(e) => onFilterChange(newKey, e.target.checked)}
                className="w-4 h-4 rounded-full border-gray-300 text-black focus:ring-black appearance-none checked:bg-black border-2 cursor-pointer"
                style={{
                  backgroundImage: isNew
                    ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")'
                    : 'none',
                }}
              />
              <Label htmlFor="new" className="text-sm font-medium cursor-pointer">
                new markets
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
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button variant="outline" className="flex-1 rounded-sm" onClick={onClear}>
              clear
            </Button>
            <Button className="flex-1 rounded-sm" onClick={onApply}>
              apply filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}