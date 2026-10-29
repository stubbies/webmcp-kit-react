export type Room = {
  id: string;
  name: string;
  pricePerNight: number;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  rating: number;
  rooms: Room[];
};

export type Flight = {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departAt: string;
  price: number;
};

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'H1',
    name: 'Harbor View Inn',
    city: 'San Francisco',
    rating: 4.5,
    rooms: [
      { id: 'H1-R1', name: 'Standard King', pricePerNight: 189 },
      { id: 'H1-R2', name: 'Bay Suite', pricePerNight: 289 },
    ],
  },
  {
    id: 'H2',
    name: 'Mission Lofts',
    city: 'San Francisco',
    rating: 4.2,
    rooms: [
      { id: 'H2-R1', name: 'Studio Loft', pricePerNight: 149 },
      { id: 'H2-R2', name: 'Corner Loft', pricePerNight: 199 },
    ],
  },
  {
    id: 'H3',
    name: 'Pacific Grand',
    city: 'Los Angeles',
    rating: 4.7,
    rooms: [
      { id: 'H3-R1', name: 'Ocean View', pricePerNight: 220 },
      { id: 'H3-R2', name: 'Penthouse', pricePerNight: 450 },
    ],
  },
];

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'F1',
    airline: 'Coastal Air',
    origin: 'SFO',
    destination: 'LAX',
    departAt: '2026-11-10T08:30:00',
    price: 129,
  },
  {
    id: 'F2',
    airline: 'Coastal Air',
    origin: 'SFO',
    destination: 'LAX',
    departAt: '2026-11-10T14:15:00',
    price: 159,
  },
  {
    id: 'F3',
    airline: 'SkyBridge',
    origin: 'LAX',
    destination: 'SFO',
    departAt: '2026-11-15T18:00:00',
    price: 139,
  },
  {
    id: 'F4',
    airline: 'SkyBridge',
    origin: 'SFO',
    destination: 'LAX',
    departAt: '2026-11-10T19:45:00',
    price: 99,
  },
];
