"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react";
import { PolymarketEvent } from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    totalVolume: "",
    volume24hr: "",
    volume1wk: "",
    volume1mo: "",
    volume1yr: "",
    newEvents: false,
    featuredEvents: false,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.totalVolume) params.append('minTotalVolume', filters.totalVolume);
      if (filters.volume24hr) params.append('minVolume24hr', filters.volume24hr);
      if (filters.volume1wk) params.append('minVolume1wk', filters.volume1wk);
      if (filters.volume1mo) params.append('minVolume1mo', filters.volume1mo);
      if (filters.volume1yr) params.append('minVolume1yr', filters.volume1yr);
      if (filters.newEvents) params.append('new', 'true');
      if (filters.featuredEvents) params.append('featured', 'true');
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // Initial load

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      totalVolume: "",
      volume24hr: "",
      volume1wk: "",
      volume1mo: "",
      volume1yr: "",
      newEvents: false,
      featuredEvents: false,
    });
  };

  const applyFilters = () => {
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-medium text-black">
            polydash
          </div>

          <div className="flex">
            <button
              onClick={() => setActiveTab("events")}
              className="px-4 py-2 font-medium transition-colors text-black hover:text-black relative group"
            >
              <span className="relative">
                events
                <span 
                  className={`absolute -bottom-1 left-1/2 h-0.5 bg-black transition-all duration-300 ${
                    activeTab === "events"
                      ? "w-full -translate-x-1/2"
                      : "w-0 -translate-x-1/2 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
            <button
              onClick={() => setActiveTab("markets")}
              className="px-4 py-2 font-medium transition-colors text-black hover:text-black relative group"
            >
              <span className="relative">
                markets
                <span 
                  className={`absolute -bottom-1 left-1/2 h-0.5 bg-black transition-all duration-300 ${
                    activeTab === "markets"
                      ? "w-full -translate-x-1/2"
                      : "w-0 -translate-x-1/2 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
        <Button onClick={() => window.open("https://polymarket.com/?via=lakan", "_blank")}>
          <Image 
            src="icon-white.svg"
            alt="polymarket icon"
            width={32}
            height={32}
            className="hover:cursor-pointer"
          />
        </Button>
      </div>

      <div className="bg-white min-h-screen p-8">
        {activeTab === "events" ? 
          <>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="search active polymarket events"
                  className="rounded-full px-6 pl-12 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchEvents()}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-full px-6 gap-2 whitespace-nowrap">
                    <Filter className="h-4 w-4" />
                    filters
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
                          onChange={(e) => handleFilterChange("totalVolume", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume24hr" className="text-sm font-medium">
                          Minimum 24 Hour Volume ($)
                        </Label>
                        <Input
                          id="volume24hr"
                          type="number"
                          placeholder="0"
                          value={filters.volume24hr}
                          onChange={(e) => handleFilterChange("volume24hr", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume1wk" className="text-sm font-medium">
                          Minimum 1 Week Volume ($)
                        </Label>
                        <Input
                          id="volume1wk"
                          type="number"
                          placeholder="0"
                          value={filters.volume1wk}
                          onChange={(e) => handleFilterChange("volume1wk", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume1mo" className="text-sm font-medium">
                          Minimum 1 Month Volume ($)
                        </Label>
                        <Input
                          id="volume1mo"
                          type="number"
                          placeholder="0"
                          value={filters.volume1mo}
                          onChange={(e) => handleFilterChange("volume1mo", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume1yr" className="text-sm font-medium">
                          Minimum 1 Year Volume ($)
                        </Label>
                        <Input
                          id="volume1yr"
                          type="number"
                          placeholder="0"
                          value={filters.volume1yr}
                          onChange={(e) => handleFilterChange("volume1yr", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="newEvents"
                          checked={filters.newEvents}
                          onChange={(e) => handleFilterChange("newEvents", e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <Label htmlFor="newEvents" className="text-sm font-medium cursor-pointer">
                          New Events Only
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featuredEvents"
                          checked={filters.featuredEvents}
                          onChange={(e) => handleFilterChange("featuredEvents", e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <Label htmlFor="featuredEvents" className="text-sm font-medium cursor-pointer">
                          Featured Events Only
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                      <Button className="flex-1" onClick={applyFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* <EventTable events={events} loading={loading} /> */}
          </> : 
          <div>Markets content</div>
        }
      </div>
    </div>
  );
}