"use client";

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function FilterPane() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  return (
    <>
      {/* Search and Filter Section */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search by event name..." 
                className="pl-10 h-12 text-base"
              />
            </div>
            
            {/* Filter Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="h-12 px-6 gap-2" size="lg">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">Filter Markets</h4>
                    <p className="text-sm text-slate-500">Refine your search with advanced criteria</p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Volume Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="volume" className="text-sm font-medium">
                        Minimum Volume ($)
                      </Label>
                      <Input
                        id="volume"
                        type="number"
                        placeholder="0"
                        className="w-full"
                      />
                    </div>

                    {/* Liquidity Filter */}
                    <div className="space-y-2">
                      <Label htmlFor="liquidity" className="text-sm font-medium">
                        Minimum Liquidity ($)
                      </Label>
                      <Input
                        id="liquidity"
                        type="number"
                        placeholder="0"
                        className="w-full"
                      />
                    </div>

                    {/* Start Date Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {startDate ? startDate.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {endDate ? endDate.toLocaleDateString() : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      Clear
                    </Button>
                    <Button className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </>
  )
}