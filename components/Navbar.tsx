"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <div className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-medium text-black font-['Fredoka']">
          polydash
        </div>


        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent className="max-w-sm text-center">
              <p>
                events are the overarching occurrences that host multiple markets. 
                they represent the main topics or happenings being predicted.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent className="max-w-sm text-center">
              <p>
                markets are specific prediction questions within an event.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="px-4 py-2 font-medium transition-colors text-gray-500 hover:text-gray-500 relative group"
              >
                traders
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm text-center">
              coming soon!
            </TooltipContent>
          </Tooltip>
        </div>

      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            size="icon"
            className="hover:cursor-pointer rounded-full" 
            onClick={() => window.open("https://polymarket.com/?via=lakan", "_blank")}>
                <Image 
                  src="icon-white.svg"
                  alt="polymarket icon"
                  width={32}
                  height={32}
                  
                />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm text-center">
          <p>visit polymarket</p>
        </TooltipContent>
      </Tooltip>

    </div>
  );
}