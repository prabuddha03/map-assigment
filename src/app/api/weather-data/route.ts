import { type NextRequest, NextResponse } from 'next/server';

const OPEN_METEO_API_URL = 'https://archive-api.open-meteo.com/v1/archive';

// In-memory cache to demonstrate caching strategy
const cache = new Map();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const data_type = searchParams.get('data_type') || 'temperature_2m'; // Default to temperature

  if (!latitude || !longitude || !start_date || !end_date) {
    return NextResponse.json(
      { error: 'Missing required query parameters: latitude, longitude, start_date, end_date' },
      { status: 400 }
    );
  }

  // A simple mapping from a friendly name to the API parameter
  const validDataTypes: { [key: string]: string } = {
    'Temperature': 'temperature_2m',
    'Precipitation': 'precipitation',
    'Wind Speed': 'wind_speed_10m',
  };

  const hourlyParam = validDataTypes[data_type] || data_type;

  const cacheKey = `${latitude}-${longitude}-${start_date}-${end_date}-${hourlyParam}`;
  
  // Check cache first
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    // Optional: check for expiry if you add timestamps to cache entries
    console.log('Serving from cache:', cacheKey);
    return NextResponse.json(cachedData);
  }

  const apiUrl = `${OPEN_METEO_API_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${start_date}&end_date=${end_date}&hourly=${hourlyParam}`;

  try {
    // Using Next.js fetch with built-in caching and revalidation.
    // Revalidates every hour (3600 seconds).
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Open-Meteo API Error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch data from Open-Meteo' }, { status: response.status });
    }

    const data = await response.json();
    
    // Store in our in-memory cache as well
    cache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
