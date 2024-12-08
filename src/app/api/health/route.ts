import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { performance } from 'perf_hooks';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  pages: {
    [key: string]: {
      path: string;
      status: boolean;
      statusCode: number;
      loadTime?: number;
      lastChecked: string;
      details?: string;
    };
  };
}

// Cache für die Ladezeiten und Ergebnisse
let pageLoadTimes: { [key: string]: number[] } = {};
let lastHealthCheck: HealthStatus | null = null;
let lastCheckTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 Minuten Cache-Dauer

// Funktion zum Berechnen des Durchschnitts
function calculateAverage(times: number[]): number {
  if (times.length === 0) return 0;
  return times.reduce((a, b) => a + b, 0) / times.length;
}

// Funktion zum Messen der Ladezeit einer Seite
async function checkPageLoadTime(path: string, options: { method?: string, body?: any, headers?: HeadersInit } = {}): Promise<{ loadTime: number, statusCode: number, details?: string }> {
  const start = performance.now();
  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || 'localhost:3000';
    const url = `${protocol}://${host}${path}`;
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });

    const loadTime = performance.now() - start;
    
    // Speichere die letzten 10 Messungen
    if (!pageLoadTimes[path]) pageLoadTimes[path] = [];
    pageLoadTimes[path].push(loadTime);
    if (pageLoadTimes[path].length > 10) pageLoadTimes[path].shift();

    let details;
    try {
      const data = await response.json();
      details = data.error || data.message || undefined;
    } catch (e) {
      // Ignoriere JSON-Parse-Fehler
    }
    
    return { loadTime, statusCode: response.status, details };
  } catch (error) {
    console.error(`Error checking ${path}:`, error);
    return { loadTime: -1, statusCode: 500, details: error.message };
  }
}

// Prüfe ob der Status-Code akzeptabel ist
function isStatusCodeAcceptable(statusCode: number): boolean {
  // 2xx sind erfolgreiche Antworten
  // 401/403 sind erwartete Auth-Fehler
  return (statusCode >= 200 && statusCode < 300) || 
         statusCode === 401 || 
         statusCode === 403;
}

async function simulateAuthFlow(): Promise<{ success: boolean, token?: string, error?: string }> {
  try {
    // 1. Login-Versuch mit Test-Credentials
    const loginResponse = await checkPageLoadTime('/api/auth/signin', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'testpassword'
      }
    });

    if (loginResponse.statusCode === 200) {
      return { success: true, token: 'simulated-token' };
    }

    return { 
      success: false, 
      error: loginResponse.details || `Login fehlgeschlagen mit Status ${loginResponse.statusCode}`
    };
  } catch (error) {
    return { 
      success: false, 
      error: `Auth-Flow-Fehler: ${error.message}` 
    };
  }
}

export async function GET(request: Request) {
  // Prüfe ob gecachte Daten noch gültig sind
  const currentTime = Date.now();
  if (lastHealthCheck && (currentTime - lastCheckTime) < CACHE_DURATION) {
    return NextResponse.json(lastHealthCheck);
  }

  // Simuliere Auth-Flow
  const authResult = await simulateAuthFlow();
  const authHeaders = authResult.success ? 
    { Authorization: `Bearer ${authResult.token}` } : 
    {};

  const endpointsToCheck = [
    // Haupt-Seiten
    { path: '/', name: 'Homepage' },
    { path: '/status', name: 'Status Page' },
    
    // API Endpunkte - Dokumentation
    { path: '/api/docs', name: 'API: Docs List' },
    { path: '/api/docs/search', name: 'API: Docs Search' },
    
    // API Endpunkte - Projekte
    { path: '/api/projects', name: 'API: Projects List' },
    { path: '/api/projects/test', name: 'API: Projects Test' },
    
    // API Endpunkte - Benutzer
    { 
      path: '/api/users', 
      name: 'API: Users List',
      headers: authHeaders
    },
    { 
      path: '/api/users/profile', 
      name: 'API: User Profile',
      headers: authHeaders
    },
    
    // API Endpunkte - Admin
    { 
      path: '/api/admin/stats', 
      name: 'API: Admin Stats',
      headers: authHeaders
    },
    
    // API Endpunkte - Suche
    { path: '/api/search', name: 'API: Global Search' },
    
    // API Endpunkte - System
    { path: '/api/hello', name: 'API: Hello Test' }
  ];

  const timestamp = new Date().toISOString();
  
  const pageStatuses = await Promise.all(
    endpointsToCheck.map(async (endpoint) => {
      const { loadTime, statusCode, details } = await checkPageLoadTime(
        endpoint.path,
        { headers: endpoint.headers }
      );
      const avgLoadTime = calculateAverage(pageLoadTimes[endpoint.path] || []);
      
      return [
        endpoint.name,
        {
          path: endpoint.path,
          status: isStatusCodeAcceptable(statusCode),
          statusCode,
          loadTime: avgLoadTime,
          lastChecked: timestamp,
          ...(details ? { details } : {})
        }
      ];
    })
  );

  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0',
    pages: Object.fromEntries(pageStatuses)
  };

  // Prüfe den Gesamtstatus basierend auf den einzelnen Endpunkten
  const hasFailures = Object.values(healthStatus.pages).some(page => !page.status);
  if (hasFailures) {
    healthStatus.status = 'degraded';
  }

  // Cache die Ergebnisse
  lastHealthCheck = healthStatus;
  lastCheckTime = currentTime;

  return NextResponse.json(healthStatus);
}
