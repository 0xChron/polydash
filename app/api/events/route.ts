import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PolymarketEvent, PolymarketMarket, DbEvent, DbMarket } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function transformDbEvent(dbEvent: DbEvent): PolymarketEvent {
  return {
    eventId: dbEvent.event_id,
    slug: dbEvent.slug,
    title: dbEvent.title,
    description: dbEvent.description,
    endDate: dbEvent.end_date,
    image: dbEvent.image,
    new: dbEvent.new,
    liquidity: dbEvent.liquidity,
    volume: dbEvent.volume,
    volume24hr: dbEvent.volume24hr,
    categories: dbEvent.categories,
    fetchDate: dbEvent.fetch_date,
  };
}

function transformDbMarket(dbMarket: DbMarket): PolymarketMarket {
  return {
    marketId: dbMarket.market_id,
    eventId: dbMarket.event_id,
    slug: dbMarket.slug,
    question: dbMarket.question,
    groupItemTitle: dbMarket.group_item_title,
    new: dbMarket.new,
    liquidity: dbMarket.liquidity,
    volume: dbMarket.volume,
    volume24hr: dbMarket.volume24hr,
    outcomeYesPrice: dbMarket.outcome_yes_price,
    outcomeNoPrice: dbMarket.outcome_no_price,
    oneDayPriceChange: dbMarket.one_day_price_change,
    image: dbMarket.image,
    fetchDate: dbMarket.fetch_date,
  };
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
    const minLiquidity = parseFloat(searchParams.get('minLiquidity') || '0');
    const maxLiquidity = parseFloat(searchParams.get('maxLiquidity') || 'Infinity');
    const newOnly = searchParams.get('new') === 'true';
    const endingSoon = searchParams.get('endingSoon') === 'true';
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    // Fetch events from Supabase
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('volume', { ascending: false });

    if (eventsError) {
      console.error('Supabase error:', eventsError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch events',
      }, { status: 500 });
    }

    // Fetch all markets from Supabase
    const { data: marketsData, error: marketsError } = await supabase
      .from('markets')
      .select('*');

    if (marketsError) {
      console.error('Supabase error:', marketsError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch markets',
      }, { status: 500 });
    }

    // Transform data
    let events = (eventsData || []).map(transformDbEvent);
    const markets = (marketsData || []).map(transformDbMarket);

    // Group markets by event_id
    const marketsByEvent = markets.reduce((acc, market) => {
      if (!acc[market.eventId]) {
        acc[market.eventId] = [];
      }
      acc[market.eventId].push(market);
      return acc;
    }, {} as Record<string, PolymarketMarket[]>);

    // Attach markets to events
    events = events.map(event => ({
      ...event,
      markets: marketsByEvent[event.eventId] || [],
    }));

    // Apply filters
    events = events.filter(event => {
      if (event.volume < minTotalVolume || event.volume > maxTotalVolume) return false;
      if (event.volume24hr < minVolume24hr || event.volume24hr > maxVolume24hr) return false;
      if (event.liquidity < minLiquidity || event.liquidity > maxLiquidity) return false;
      if (newOnly && !event.new) return false;
      if (endingSoon && !isEndingSoon(event.endDate)) return false;
      
      // Search in both event title and market questions/groupItemTitle
      if (searchQuery) {
        const eventMatches = event.title.toLowerCase().includes(searchQuery);
        const marketMatches = event.markets?.some(market => 
          market.question.toLowerCase().includes(searchQuery) ||
          market.groupItemTitle.toLowerCase().includes(searchQuery)
        );
        
        if (!eventMatches && !marketMatches) return false;
        
        // If only markets match, filter to show only matching markets
        if (!eventMatches && marketMatches) {
          event.markets = event.markets?.filter(market =>
            market.question.toLowerCase().includes(searchQuery) ||
            market.groupItemTitle.toLowerCase().includes(searchQuery)
          );
        }
      }

      return true;
    });

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error: Failed to fetch events',
    }, { status: 500 });
  }
}