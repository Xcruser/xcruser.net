import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  pages: {
    [key: string]: {
      status: boolean;
      loadTime?: number;
      lastChecked: string;
    };
  };
}

// Cache für die Ladezeiten
let pageLoadTimes: { [key: string]: number[] } = {};

// Funktion zum Messen der Ladezeit einer Seite
async function checkPageLoadTime(path: string): Promise<number> {
  const start = performance.now();
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || 'localhost:3000';
    const url = `${protocol}://${host}${path}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const loadTime = performance.now() - start;
    
    // Speichere die letzten 10 Messungen
    if (!pageLoadTimes[path]) pageLoadTimes[path] = [];
    pageLoadTimes[path].push(loadTime);
    if (pageLoadTimes[path].length > 10) pageLoadTimes[path].shift();
    
    return loadTime;
  } catch (error) {
    console.error(`Error checking ${path}:`, error);
    return -1;
  }
}

// Funktion zum Berechnen des Durchschnitts
function calculateAverage(times: number[]): number {
  if (times.length === 0) return 0;
  return times.reduce((a, b) => a + b, 0) / times.length;
}

export async function GET() {
  const pagesToCheck = ['/', '/about', '/contact'];
  const currentTime = new Date().toISOString();
  
  const pageStatuses = await Promise.all(
    pagesToCheck.map(async (page) => {
      const loadTime = await checkPageLoadTime(page);
      const avgLoadTime = calculateAverage(pageLoadTimes[page] || []);
      
      return [
        page,
        {
          status: loadTime >= 0,
          loadTime: avgLoadTime,
          lastChecked: currentTime
        }
      ];
    })
  );

  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: currentTime,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    pages: Object.fromEntries(pageStatuses)
  };

  // Setze Status auf 'degraded' wenn eine Seite nicht erreichbar ist
  if (pageStatuses.some(([, status]) => !status.status)) {
    healthStatus.status = 'degraded';
  }

  return NextResponse.json(healthStatus);
}
