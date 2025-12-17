"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardSection from "@/components/DashboardSection";
import { PolymarketEvent, PolymarketMarket } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hotMarkets, setHotMarkets] = useState<PolymarketEvent[]>([]);
  const [topLiquidity, setTopLiquidity] = useState<PolymarketEvent[]>([]);
  const [topGainers, setTopGainers] = useState<PolymarketMarket[]>([]);
  const [topLosers, setTopLosers] = useState<PolymarketMarket[]>([]);
  const [controversial, setControversial] = useState<PolymarketMarket[]>([]);
  const [confidentBets, setConfidentBets] = useState<PolymarketMarket[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        const result = await response.json();
        
        console.log('API Response:', result); // Debug log
        
        // Handle the API response structure: { success, count, data }
        let data: PolymarketEvent[] = [];
        if (result.data && Array.isArray(result.data)) {
          data = result.data;
        } else if (Array.isArray(result)) {
          data = result;
        } else if (result.events && Array.isArray(result.events)) {
          data = result.events;
        } else {
          console.error('Unexpected API response format:', result);
          return;
        }
        
        console.log('Processed data:', data.length, 'events'); // Debug log
        
        // Sort events by volume24hr (Hot Markets)
        const sortedByVolume24hr = [...data].sort((a, b) => 
          (b.volume24hr || 0) - (a.volume24hr || 0)
        );
        setHotMarkets(sortedByVolume24hr.slice(0, 5));

        // Sort events by liquidity
        const sortedByLiquidity = [...data].sort((a, b) => 
          (b.liquidity || 0) - (a.liquidity || 0)
        );
        setTopLiquidity(sortedByLiquidity.slice(0, 5));

        // Extract all markets from events
        const allMarkets: PolymarketMarket[] = data.flatMap((event) => 
          event.markets || []
        );

        console.log('Total markets:', allMarkets.length); // Debug log

        // Filter markets with valid price change data
        const marketsWithPriceChange = allMarkets.filter(m => 
          m.oneDayPriceChange !== null && m.oneDayPriceChange !== undefined
        );

        console.log('Markets with price change:', marketsWithPriceChange.length); // Debug log

        // Top Gainers (positive price change)
        const gainers = marketsWithPriceChange
          .filter(m => m.oneDayPriceChange > 0)
          .sort((a, b) => b.oneDayPriceChange - a.oneDayPriceChange)
          .slice(0, 5);
        setTopGainers(gainers);
        console.log('Top gainers:', gainers.length); // Debug log

        // Top Losers (negative price change)
        const losers = marketsWithPriceChange
          .filter(m => m.oneDayPriceChange < 0)
          .sort((a, b) => a.oneDayPriceChange - b.oneDayPriceChange)
          .slice(0, 5);
        setTopLosers(losers);
        console.log('Top losers:', losers.length); // Debug log

        // Controversial Markets (40-60¢ with volume > 100k)
        const controversialMarkets = allMarkets
          .filter(m => {
            const volume = m.volume || 0;
            const yesPrice = m.outcomeYesPrice;
            const noPrice = m.outcomeNoPrice;
            
            if (volume <= 100000) return false;
            
            // Check if either Yes or No price is between 0.40 and 0.60
            const isYesControversial = yesPrice !== null && yesPrice !== undefined && yesPrice >= 0.40 && yesPrice <= 0.60;
            const isNoControversial = noPrice !== null && noPrice !== undefined && noPrice >= 0.40 && noPrice <= 0.60;
            
            return isYesControversial || isNoControversial;
          })
          .map(m => ({
            ...m,
            distanceFrom50: Math.abs((m.outcomeYesPrice || 0) - 0.5)
          }))
          .sort((a, b) => a.distanceFrom50 - b.distanceFrom50)
          .slice(0, 5);
        setControversial(controversialMarkets);
        console.log('Controversial markets:', controversialMarkets.length); // Debug log

        // Most Confident Bets (90-100¢ with volume > 200k)
        const confidentBetsMarkets = allMarkets
          .filter(m => {
            const volume = m.volume || 0;
            const yesPrice = m.outcomeYesPrice;
            const noPrice = m.outcomeNoPrice;
            
            if (volume <= 200000) return false;
            
            // Check if either Yes or No price is between 0.90 and 1.00
            const isYesConfident = yesPrice !== null && yesPrice !== undefined && yesPrice >= 0.90 && yesPrice <= 1.00;
            const isNoConfident = noPrice !== null && noPrice !== undefined && noPrice >= 0.90 && noPrice <= 1.00;
            
            return isYesConfident || isNoConfident;
          })
          .sort((a, b) => {
            // Sort by highest confidence (closest to 1.00)
            const aConfidence = Math.max(a.outcomeYesPrice || 0, a.outcomeNoPrice || 0);
            const bConfidence = Math.max(b.outcomeYesPrice || 0, b.outcomeNoPrice || 0);
            return bConfidence - aConfidence;
          })
          .slice(0, 5);
        setConfidentBets(confidentBetsMarkets);
        console.log('Confident bets:', confidentBetsMarkets.length); // Debug log

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="bg-white min-h-screen p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-medium text-gray-900 mb-2 text-center font-['Fredoka']">daily polymarket intelligence report</h1>
          <p className="text-gray-600 text-center mb-4">your daily edge in prediction market analysis.</p>
          
          {/* Polymarket Ticker Embed */}
          <div className="max-w-8xl mx-auto">
            <iframe 
              src="https://ticker.polymarket.com/embed?category=Breaking News&theme=light&speed=0.5&displayMode=percentage" 
              width="100%" 
              height="60" 
              className="border-none overflow-hidden rounded-sm"
              scrolling="no"
              title="Polymarket Breaking News Ticker"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardSection
              title="🔥 hot markets"
              items={hotMarkets}
              type="event"
              metricType="volume24hr"
              description="top markets by 24 hour volume"
              viewAllLink="/screener?sort=volume24hr"
            />
            
            <DashboardSection
              title="💰 top liquidity"
              items={topLiquidity}
              type="event"
              metricType="liquidity"
              description="top markets by liquidity"
              viewAllLink="/screener?sort=liquidity"
            />
            
            <DashboardSection
              title="📈 top gainers"
              items={topGainers}
              type="market"
              metricType="priceChange"
              description="highest +% price change"
              viewAllLink="/screener?filter=gainers"
            />
            
            <DashboardSection
              title="📉 top losers"
              items={topLosers}
              type="market"
              metricType="priceChange"
              description="highest -% price change"
              viewAllLink="/screener?filter=losers"
            />
            
            <DashboardSection
              title="⚖️ controversial markets"
              items={controversial}
              type="market"
              metricType="controversy"
              description="markets with close disagreement"
              viewAllLink="/screener?filter=controversial"
            />

            <DashboardSection
              title="💎 most confident bets"
              items={confidentBets}
              type="market"
              metricType="confidentBets"
              description="markets with the most confident bets"
              viewAllLink="/screener?filter=confident"
            />
          </div>
        )}
      </div>
    </div>
  );
}