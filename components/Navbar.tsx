"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between px-10 py-4 bg-white shadow-md">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-medium text-black font-['Fredoka']">
          <button
            onClick={() => router.push("/")}
            className="hover:cursor-pointer"
          >
            polydash
          </button>
        </div>

        <div className="flex gap-2">
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
                onClick={() => router.push("/markets")}
                className={`
                  px-4 py-2 font-medium transition-all duration-200 hover:cursor-pointer
                  text-black rounded-sm
                  ${pathname === "/markets"
                    ? "shadow-[inset_0_3px_6px_rgba(0.1,0.1,0.1,0.1)] translate-y-0.5 bg-gray-200" 
                    : "hover:bg-gray-50 active:translate-y-0.5 active:bg-gray-200"
                  }
                `}
              >
                markets
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm text-center">
              <p>
                check the latest dashboard on market trends.
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
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-sm bg-black"
            onClick={() => window.open("https://polymarket.com/?via=lakan", "_blank")}>
                <Image 
                  src="icon-white.svg"
                  alt="polymarket icon"
                  width={32}
                  height={32}
                  
                />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm text-center">
          <p>visit polymarket!</p>
        </TooltipContent>
      </Tooltip>

    </div>
  );
}