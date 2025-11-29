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


export interface PolymarketMarket {
  marketId: number;
  slug: string;
  title: string;
  endDate: string;
  liquidity: number;
  startDate: string;
  image: string;
  outcomeYes: string;
  outcomeNo: string;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  totalVolume: number;
  new: boolean;
  featured: boolean;
  negRisk: boolean;
  outcomeYesPrice: number;
  outcomeNoPrice: number;
  oneDayPriceChange: number;
  oneHourPriceChange: number;
  oneWeekPriceChange: number;
  oneMonthPriceChange: number;
  lastTradePrice: number;
  fetchDate: string;
}

export interface DbMarket {
  market_id: number;
  slug: string;
  title: string;
  end_date: string;
  liquidity: number;
  start_date: string;
  image: string;
  outcome_yes: string;
  outcome_no: string;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  volume1yr: number;
  volume: number;
  new: boolean;
  featured: boolean;
  negrisk: boolean;
  outcome_yes_price: number;
  outcome_no_price: number;
  one_day_price_change: number;
  one_hour_price_change: number;
  one_week_price_change: number;
  one_month_price_change: number;
  last_trade_price: number;
  fetch_date: string;
}

export interface MarketFilters {
  totalVolume: number;
  volume24hr: number;
  volume1mo: number;
  liquidity: number;
  outcomeYesPrice: number;
  outcomeNoPrice: number;
  newMarkets: boolean;
  featuredMarkets: boolean;
  endingSoon: boolean;
  negRiskMarkets: boolean;
  search?: string;
}