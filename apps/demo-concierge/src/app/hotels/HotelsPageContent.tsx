'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HotelsListMcpTools } from '@/mcp/hotelsListMcpTools';
import { useAppSelector } from '@/store/hooks';
import { useGetHotelsQuery } from '@/store/travelApi';
import { selectTrip } from '@/store/tripSlice';

export function HotelsPageContent() {
  const searchParams = useSearchParams();
  const tripSearch = useAppSelector((s) => selectTrip(s).search);
  const destination =
    searchParams.get('destination') ?? tripSearch?.destination ?? undefined;

  const { data: hotels = [], isFetching } = useGetHotelsQuery({ destination });

  return (
    <>
      <HotelsListMcpTools />
      <div className="card">
        <h1>Hotels</h1>
        <p>
          Route tools: <code>list_hotels</code>, <code>open_hotel</code>
        </p>
        {isFetching && <p>Loading…</p>}
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.id} style={{ marginBottom: 12 }}>
              <Link href={`/hotels/${hotel.id}`}>{hotel.name}</Link> — {hotel.city} ({hotel.rating}
              ★)
            </li>
          ))}
        </ul>
        {hotels.length === 0 && !isFetching && (
          <p>
            No hotels. <Link href="/search">Run a search</Link> first.
          </p>
        )}
      </div>
    </>
  );
}
