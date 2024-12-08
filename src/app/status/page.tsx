'use client'

import { useState, useEffect } from 'react'
import { fetchApi } from '@/utils/api'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type HealthData = {
  status: string
  timestamp: string
  uptime: number
  environment: string
  version: string
  pages: {
    [key: string]: {
      path: string
      status: boolean
      statusCode: number
      loadTime?: number
      lastChecked: string
      details?: string
    }
  }
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    const response = await fetchApi<HealthData>('health');
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setHealth(response.data);
      setLastUpdate(new Date());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
    // Aktualisiere alle 5 Minuten
    const interval = setInterval(fetchHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !health) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-lg backdrop-blur-sm">
          <p className="text-slate-600 dark:text-slate-400">Lade Statusdaten...</p>
        </div>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Fehler: {error}</p>
        </div>
      </div>
    );
  }

  if (!health) return null;

  // Gruppiere die Endpunkte nach Typ
  const groupEndpoints = () => {
    const groups: { [key: string]: typeof health.pages } = {
      'Haupt-Seiten': {},
      'API: Dokumentation': {},
      'API: Projekte': {},
      'API: Benutzer': {},
      'API: Admin': {},
      'API: System': {},
      'API: Suche': {},
    };

    Object.entries(health.pages).forEach(([name, status]) => {
      if (name.startsWith('API: Docs')) {
        groups['API: Dokumentation'][name] = status;
      } else if (name.startsWith('API: Projects')) {
        groups['API: Projekte'][name] = status;
      } else if (name.startsWith('API: Users') || name.includes('Profile')) {
        groups['API: Benutzer'][name] = status;
      } else if (name.startsWith('API: Admin')) {
        groups['API: Admin'][name] = status;
      } else if (name.startsWith('API: Search')) {
        groups['API: Suche'][name] = status;
      } else if (name.startsWith('API:')) {
        groups['API: System'][name] = status;
      } else {
        groups['Haupt-Seiten'][name] = status;
      }
    });

    return groups;
  };

  const groups = groupEndpoints();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl p-6 bg-white/80 dark:bg-slate-900/80 rounded-lg backdrop-blur-sm border border-slate-200 dark:border-slate-700">
        <div className="space-y-6">
          {/* Header mit Gesamtstatus und Refresh Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                System Status
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                health.status === 'healthy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : health.status === 'degraded'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
              </div>
            </div>
            <button
              onClick={() => fetchHealth()}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
              title="Aktualisieren"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-slate-400">Environment</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {health.environment}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-slate-400">Version</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {health.version}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-slate-400">Uptime</p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {Math.floor(health.uptime / 60)} Minuten
              </p>
            </div>
          </div>

          {/* Endpunkte nach Gruppen */}
          <div className="space-y-6">
            {Object.entries(groups).map(([groupName, endpoints]) => (
              Object.keys(endpoints).length > 0 && (
                <div key={groupName} className="space-y-4">
                  <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {groupName}
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(endpoints).map(([name, status]) => (
                      <div 
                        key={name}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            status.status 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`} />
                          <div className="space-y-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {name}
                            </span>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-slate-500 dark:text-slate-400">
                                {status.path}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-full ${
                                status.statusCode >= 200 && status.statusCode < 300
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : status.statusCode === 401 || status.statusCode === 403
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {status.statusCode}
                              </span>
                              {status.details && (
                                <span className="text-slate-500 dark:text-slate-400">
                                  ({status.details})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {status.loadTime 
                            ? `${status.loadTime.toFixed(0)}ms`
                            : 'Keine Daten'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Letzte Aktualisierung */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Letzte Aktualisierung: {lastUpdate?.toLocaleString() || 'Noch nie'}
          </div>
        </div>
      </div>
    </div>
  );
}
