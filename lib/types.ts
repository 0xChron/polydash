export interface PolymarketEvent {
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

export interface DbEvent {
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

export interface EventFilters {
  totalVolume: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  liquidity: number;
  newEvents: boolean;
  featuredEvents: boolean;
  endingSoon: boolean;
  negRiskMarkets: boolean;
  search?: string;
}