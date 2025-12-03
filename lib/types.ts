export interface PolymarketEvent {
  eventId: string;
  slug: string;
  title: string;
  description: string;
  endDate: string;
  image: string;
  new: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  categories: string[];
  fetchDate: string;
  markets?: PolymarketMarket[]; // markets nested under event
}

export interface DbEvent {
  event_id: string;
  slug: string;
  title: string;
  description: string;
  end_date: string;
  image: string;
  new: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  categories: string[];
  fetch_date: string;
}

export interface PolymarketMarket {
  marketId: string;
  eventId: string; // foreign key to event
  slug: string;
  question: string;
  groupItemTitle: string;
  new: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  outcomeYesPrice: number;
  outcomeNoPrice: number;
  oneDayPriceChange: number;
  image: string;
  fetchDate: string;
}

export interface DbMarket {
  market_id: string;
  event_id: string;
  slug: string;
  question: string;
  group_item_title: string;
  new: boolean;
  liquidity: number;
  volume: number;
  volume24hr: number;
  outcome_yes_price: number;
  outcome_no_price: number;
  one_day_price_change: number;
  image: string;
  fetch_date: string;
}

export interface EventFilters {
  totalVolume: [number, number];
  volume24hr: [number, number];
  liquidity: [number, number];
  newEvents: boolean;
  endingSoon: boolean;
  search?: string;
}