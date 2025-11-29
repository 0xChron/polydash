"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter } from "lucide-react";

interface FilterState {
  totalVolume: string;
  volume24hr: string;
  volume1wk: string;
  volume1mo: string;
  volume1yr: string;
  newEvents: boolean;
  featuredEvents: boolean;
}

interface FilterPopoverProps {
  filters: FilterState;
  onFilterChange: (key: string, value: string | boolean) => void;
  onClear: () => void;
  onApply: () => void;
}

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
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-1">filter events</h4>
            <p className="text-sm text-gray-500">refine your search with filters</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="totalVolume" className="text-sm font-medium">
                minimum all time vol ($)
              </Label>
              <Input
                id="totalVolume"
                type="number"
                placeholder="0"
                value={filters.totalVolume}
                onChange={(e) => onFilterChange("totalVolume", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume24hr" className="text-sm font-medium">
                minimum 24 hour volume ($)
              </Label>
              <Input
                id="volume24hr"
                type="number"
                placeholder="0"
                value={filters.volume24hr}
                onChange={(e) => onFilterChange("volume24hr", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume1wk" className="text-sm font-medium">
                minimum 1 week volume ($)
              </Label>
              <Input
                id="volume1wk"
                type="number"
                placeholder="0"
                value={filters.volume1wk}
                onChange={(e) => onFilterChange("volume1wk", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume1mo" className="text-sm font-medium">
                minimum 1 month volume ($)
              </Label>
              <Input
                id="volume1mo"
                type="number"
                placeholder="0"
                value={filters.volume1mo}
                onChange={(e) => onFilterChange("volume1mo", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volume1yr" className="text-sm font-medium">
                minimum 1 year volume ($)
              </Label>
              <Input
                id="volume1yr"
                type="number"
                placeholder="0"
                value={filters.volume1yr}
                onChange={(e) => onFilterChange("volume1yr", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newEvents"
                checked={filters.newEvents}
                onChange={(e) => onFilterChange("newEvents", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="newEvents" className="text-sm font-medium cursor-pointer">
                new events only
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featuredEvents"
                checked={filters.featuredEvents}
                onChange={(e) => onFilterChange("featuredEvents", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <Label htmlFor="featuredEvents" className="text-sm font-medium cursor-pointer">
                featured events only
              </Label>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={onClear}>
              clear
            </Button>
            <Button className="flex-1" onClick={onApply}>
              apply filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}