import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PolymarketMarket, DbMarket } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function transformDbMarket(dbMarket: DbMarket): PolymarketMarket {
  return {
    marketId: dbMarket.market_id,
    slug: dbMarket.slug,
    title: dbMarket.title,
    endDate: dbMarket.end_date,
    liquidity: dbMarket.liquidity,
    startDate: dbMarket.start_date,
    image: dbMarket.image,
    outcomeYes: dbMarket.outcome_yes,
    outcomeNo: dbMarket.outcome_no,
    volume24hr: dbMarket.volume24hr,
    volume1wk: dbMarket.volume1wk,
    volume1mo: dbMarket.volume1mo,
    volume1yr: dbMarket.volume1yr,
    totalVolume: dbMarket.volume,
    new: dbMarket.new,
    featured: dbMarket.featured,
    negRisk: dbMarket.negrisk,
    outcomeYesPrice: dbMarket.outcome_yes_price,
    outcomeNoPrice: dbMarket.outcome_no_price,
    oneDayPriceChange: dbMarket.one_day_price_change,
    oneHourPriceChange: dbMarket.one_hour_price_change,
    oneWeekPriceChange: dbMarket.one_week_price_change, 
    oneMonthPriceChange: dbMarket.one_month_price_change,
    lastTradePrice: dbMarket.last_trade_price,
    fetchDate: dbMarket.fetch_date,
  };
}

async function fetchPolymarketMarkets(): Promise<PolymarketMarket[]> {
  try {
    const { data, error } = await supabase
      .from('markets')
      .select('*')
      .order('volume', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      // return getMockEvents();
      return [];
    }

    return (data || []).map(transformDbMarket);
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    // return getMockEvents();
    return [];
  }
}

function isEndingSoon(endDate: string): boolean {
  const now = new Date();
  const end = new Date(endDate);
  const daysUntilEnd = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilEnd >= 0 && daysUntilEnd <= 7;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const minTotalVolume = parseFloat(searchParams.get('minTotalVolume') || '0');
    const maxTotalVolume = parseFloat(searchParams.get('maxTotalVolume') || 'Infinity');
    const minVolume24hr = parseFloat(searchParams.get('minVolume24hr') || '0');
    const maxVolume24hr = parseFloat(searchParams.get('maxVolume24hr') || 'Infinity');
    const minVolume1mo = parseFloat(searchParams.get('minVolume1mo') || '0');
    const maxVolume1mo = parseFloat(searchParams.get('maxVolume1mo') || 'Infinity');
    const minLiquidity = parseFloat(searchParams.get('minLiquidity') || '0');
    const maxLiquidity = parseFloat(searchParams.get('maxLiquidity') || 'Infinity');
    const minOutcomeYesPrice = parseFloat(searchParams.get('minOutcomeYesPrice') || '0');
    const maxOutcomeYesPrice = parseFloat(searchParams.get('maxOutcomeYesPrice') || 'Infinity');
    const minOutcomeNoPrice = parseFloat(searchParams.get('minOutcomeNoPrice') || '0');
    const maxOutcomeNoPrice = parseFloat(searchParams.get('maxOutcomeNoPrice') || 'Infinity');
    const newOnly = searchParams.get('new') === 'true';
    const featuredOnly = searchParams.get('featured') === 'true';
    const endingSoon = searchParams.get('endingSoon') === 'true';
    const negRiskOnly = searchParams.get('negRisk') === 'true';
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    let markets = await fetchPolymarketMarkets();

    markets = markets.filter(market => {
      if (market.totalVolume < minTotalVolume || market.totalVolume > maxTotalVolume) return false;
      if (market.volume24hr < minVolume24hr || market.volume24hr > maxVolume24hr) return false;
      if (market.volume1mo < minVolume1mo || market.volume1mo > maxVolume1mo) return false;
      if (market.liquidity < minLiquidity || market.liquidity > maxLiquidity) return false;
      if (market.outcomeYesPrice < minOutcomeYesPrice || market.outcomeYesPrice > maxOutcomeYesPrice) return false;
      if (market.outcomeNoPrice < minOutcomeNoPrice || market.outcomeNoPrice > maxOutcomeNoPrice) return false;
      if (newOnly && !market.new) return false;
      if (featuredOnly && !market.featured) return false;
      if (endingSoon && !isEndingSoon(market.endDate)) return false;
      if (negRiskOnly && !market.negRisk) return false;
      if (searchQuery && !market.title.toLowerCase().includes(searchQuery)) return false;
      
      
      return true;
    });

    return NextResponse.json({
      success: true,
      count: markets.length,
      data: markets,
    });
  } catch (error) {
    console.error('Error in GET /api/markets:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error: Failed to fetch markets',
    }, { status: 500 });
  }
}