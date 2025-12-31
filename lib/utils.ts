import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatVolume = (value: number): string => {
  if (value === 0) return "$0";
  if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};

export const formatCurrency = (value: number) => {
  if (value > 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value > 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value > 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(2)}%`;
};

export const formatPrice = (value: number): string => {
  return `${(value * 100).toFixed(1)}¢`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}


// EventMarketTable utils
export const calculateVLR = (volume: number, liquidity: number): number => {
  if (liquidity === 0 || !liquidity) return 0;
  return volume / liquidity;
};

export const getVLRColorClass = (vlr: number): string => {
  if (vlr === 0) return 'bg-red-50 text-red-700';
  if (vlr < 0.1) return 'bg-orange-50 text-orange-700';
  if (vlr < 3) return 'bg-yellow-50 text-yellow-700';
  if (vlr < 20) return 'bg-green-50 text-green-700';
  return 'bg-orange-50 text-orange-700';
};