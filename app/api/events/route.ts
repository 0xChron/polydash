import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getMockEvents } from '@/lib/mock/events';
import { PolymarketEvent, DbEvent } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function transformDbEvent(dbEvent: DbEvent): PolymarketEvent {
  return {
    eventId: dbEvent.event_id,
    slug: dbEvent.slug,
    title: dbEvent.title,
    startDate: dbEvent.start_date,
    endDate: dbEvent.end_date,
    volume24hr: dbEvent.volume24hr,
    volume1wk: dbEvent.volume1wk,
    volume1mo: dbEvent.volume1mo,
    volume1yr: dbEvent.volume1yr,
    totalVolume: dbEvent.volume,
    image: dbEvent.image,
    new: dbEvent.new,
    featured: dbEvent.featured,
    liquidity: dbEvent.liquidity,
    negRisk: dbEvent.negrisk,
    labels: dbEvent.labels,
    slugs: dbEvent.slugs,
    fetchDate: dbEvent.fetch_date,
  };
}

async function fetchPolymarketEvents(): Promise<PolymarketEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('volume', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return getMockEvents();
    }

    return (data || []).map(transformDbEvent);
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return getMockEvents();
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
    const minVolume1wk = parseFloat(searchParams.get('minVolume1wk') || '0');
    const maxVolume1wk = parseFloat(searchParams.get('maxVolume1wk') || 'Infinity');
    const minVolume1mo = parseFloat(searchParams.get('minVolume1mo') || '0');
    const maxVolume1mo = parseFloat(searchParams.get('maxVolume1mo') || 'Infinity');
    const minVolume1yr = parseFloat(searchParams.get('minVolume1yr') || '0');
    const maxVolume1yr = parseFloat(searchParams.get('maxVolume1yr') || 'Infinity');
    const minLiquidity = parseFloat(searchParams.get('minLiquidity') || '0');
    const maxLiquidity = parseFloat(searchParams.get('maxLiquidity') || 'Infinity');
    const newOnly = searchParams.get('new') === 'true';
    const featuredOnly = searchParams.get('featured') === 'true';
    const endingSoonOnly = searchParams.get('endingSoon') === 'true';
    const negRiskOnly = searchParams.get('negRisk') === 'true';
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    
    // Fetch events from Supabase
    let events = await fetchPolymarketEvents();
    
    // Apply filters
    events = events.filter(event => {
      if (event.totalVolume < minTotalVolume || event.totalVolume > maxTotalVolume) return false;
      if (event.volume24hr < minVolume24hr || event.volume24hr > maxVolume24hr) return false;
      if (event.volume1wk < minVolume1wk || event.volume1wk > maxVolume1wk) return false;
      if (event.volume1mo < minVolume1mo || event.volume1mo > maxVolume1mo) return false;
      if (event.volume1yr < minVolume1yr || event.volume1yr > maxVolume1yr) return false;
      if (event.liquidity < minLiquidity || event.liquidity > maxLiquidity) return false;
      if (newOnly && !event.new) return false;
      if (featuredOnly && !event.featured) return false;
      if (endingSoonOnly && !isEndingSoon(event.endDate)) return false;
      if (negRiskOnly && !event.negRisk) return false;
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery)) return false;
      
      return true;
    });
    
    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}