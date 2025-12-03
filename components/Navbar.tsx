"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-10 py-4 bg-white shadow-md">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="text-xl md:text-2xl font-medium text-black font-['Fredoka']">
            <button
              onClick={() => router.push("/")}
              className="hover:cursor-pointer"
            >
              polydash
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => router.push("/screener")}
                  className={`
                    px-4 py-2 font-medium transition-all duration-200 hover:cursor-pointer
                    text-black rounded-sm
                    ${pathname === "/screener"
                      ? "shadow-[inset_0_3px_6px_rgba(0.1,0.1,0.1,0.1)] translate-y-0.5 bg-gray-200" 
                      : "hover:bg-gray-50 active:translate-y-0.5 active:bg-gray-200"
                    }
                  `}
                >
                  screener
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm text-center">
                <p>
                  all current active markets on polymarket.
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="px-4 py-2 font-medium transition-all duration-200 text-gray-400 rounded-sm hover:bg-gray-50"
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

        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-gray-50 rounded-sm transition-all duration-200 active:bg-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-sm bg-black hover:bg-gray-800 transition-all duration-200"
                onClick={() => window.open("https://polymarket.com/?via=lakan", "_blank")}>
                    <Image 
                      src="icon-white.svg"
                      alt="polymarket icon"
                      width={24}
                      height={24}
                      className="md:w-8 md:h-8"
                    />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm text-center">
              <p>visit polymarket</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-lg border-t border-gray-200 md:hidden">
          <div className="flex flex-col p-4 gap-2">
            <button
              onClick={() => {
                router.push("/screener");
                setMobileMenuOpen(false);
              }}
              className={`
                px-4 py-3 font-medium transition-all duration-200 text-left
                text-black rounded-sm
                ${pathname === "/screener"
                  ? "bg-gray-200" 
                  : "hover:bg-gray-50 active:bg-gray-200"
                }
              `}
            >
              screener
            </button>
            <button
              className="px-4 py-3 font-medium transition-all duration-200 text-gray-400 rounded-sm hover:bg-gray-50 text-left"
            >
              traders <span className="text-xs">(coming soon)</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}