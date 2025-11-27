import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockEvents = [
  {
    eventId: 1,
    title: "Will Bitcoin reach $100k by the end of 2024?",
    slug: "will-bitcoin-reach-100k-by-the-end-of-2024",
    totalVolume: 999999,
    volume24hr: 12345,
    volume1wk: 67890,
    volume1mo: 234567,
    volume1yr: 890123,
    new: false,
    featured: true,
    negRisk: false,
    liquidity: 50000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    image: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fgta-vi-released-in-2025-8qTxawcdTwjV.png&w=256&q=100",
    labels: ["Crypto", "Bitcoin", "Hit Price"],
    slugs: ["crypto", "bitcoin", "hit-price"]
  },
  {
    eventId: 2,
    title: "Will Ethereum 2.0 launch in 2024?",
    slug: "will-ethereum-2-launch-in-2024",
    totalVolume: 750000,
    volume24hr: 12345,
    volume1wk: 67890,
    volume1mo: 234567,
    volume1yr: 890123,
    new: false,
    featured: true,
    negRisk: false,
    liquidity: 30000,
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    image: "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fgta-vi-released-in-2025-8qTxawcdTwjV.png&w=256&q=100",
    labels: ["Crypto", "Ethereum", "Hit Price"],
    slugs: ["crypto", "ethereum", "hit-price"]
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function EventTable() {
  const date = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-gray-50">
            <TableHead className="w-16 pl-6"></TableHead>
            <TableHead className="font-semibold text-gray-700">Event</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Total Volume</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">24 Hour Volume</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">1 Week Volume</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Liquidity</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">End Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pr-6">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockEvents.map((event) => (
            <TableRow 
              key={event.eventId} 
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <TableCell className="pl-6">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="rounded-md object-cover"
                  height={48}
                  width={48}
                />
              </TableCell>
              <TableCell className="font-medium max-w-md">
                <div className="truncate">{event.title}</div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.totalVolume)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.volume24hr)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.volume1wk)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(event.liquidity)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {new Date(event.endDate).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {event.labels.join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">Last updated {date}</p>
      </div>
    </div>
  );
}