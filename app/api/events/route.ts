import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getMockEvents } from '@/lib/mock/events';

interface PolymarketEvent {
  eventId: number;
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  totalVolume: number;
  image: string;
  new: boolean;
  featured: boolean;
  liquidity: number;
  negRisk: boolean;
  labels: string[];
  slugs: string[];
  fetchDate: string;
}

interface DbEvent {
  event_id: number;
  slug: string;
  title: string;
  start_date: string;
  end_date: string;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  volume: number;
  image: string;
  new: boolean;
  featured: boolean;
  liquidity: number;
  negrisk: boolean;
  labels: string[];
  slugs: string[];
  fetch_date: string;
}

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





export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const minTotalVolume = parseFloat(searchParams.get('minTotalVolume') || '0');
    const minVolume24hr = parseFloat(searchParams.get('minVolume24hr') || '0');
    const minVolume1wk = parseFloat(searchParams.get('minVolume1wk') || '0');
    const minVolume1mo = parseFloat(searchParams.get('minVolume1mo') || '0');
    const minVolume1yr = parseFloat(searchParams.get('minVolume1yr') || '0');
    const newOnly = searchParams.get('new') === 'true';
    const featuredOnly = searchParams.get('featured') === 'true';
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    
    // Fetch events from Supabase
    let events = await fetchPolymarketEvents();
    
    // Apply filters
    events = events.filter(event => {
      if (event.totalVolume < minTotalVolume) return false;
      if (event.volume24hr < minVolume24hr) return false;
      if (event.volume1wk < minVolume1wk) return false;
      if (event.volume1mo < minVolume1mo) return false;
      if (event.volume1yr < minVolume1yr) return false;
      if (newOnly && !event.new) return false;
      if (featuredOnly && !event.featured) return false;
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