import { PolymarketEvent } from "@/lib/types";

export function getMockEvents(): PolymarketEvent[] {
  return [
    {
      eventId: 1,
      slug: "will-bitcoin-reach-100k-by-the-end-of-2024",
      title: "Will Bitcoin reach $100k by the end of 2024?",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      volume24hr: 12345,
      volume1wk: 67890,
      volume1mo: 234567,
      volume1yr: 890123,
      totalVolume: 999999,
      image: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fgta-vi-released-in-2025-8qTxawcdTwjV.png&w=256&q=100",
      new: false,
      featured: true,
      liquidity: 50000,
      negRisk: false,
      labels: ["Crypto", "Bitcoin", "Hit Price"],
      slugs: ["crypto", "bitcoin", "hit-price"],
      fetchDate: new Date().toISOString(),
    },
    {
      eventId: 2,
      slug: "will-ethereum-2-launch-in-2024",
      title: "Will Ethereum 2.0 launch in 2024?",
      startDate: "2024-03-01",
      endDate: "2024-11-30",
      volume24hr: 12345,
      volume1wk: 67890,
      volume1mo: 234567,
      volume1yr: 890123,
      totalVolume: 750000,
      image: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fgta-vi-released-in-2025-8qTxawcdTwjV.png&w=256&q=100",
      new: false,
      featured: true,
      liquidity: 30000,
      negRisk: false,
      labels: ["Crypto", "Ethereum", "Hit Price"],
      slugs: ["crypto", "ethereum", "hit-price"],
      fetchDate: new Date().toISOString(),
    }
  ];
}