"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
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
  );
}