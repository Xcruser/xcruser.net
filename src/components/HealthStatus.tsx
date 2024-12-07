'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/utils/api';

interface HealthData {
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

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const response = await fetchApi<HealthData>('health');
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setHealth(response.data);
      }
      setLoading(false);
    };

    fetchHealth();
    // Aktualisiere alle 30 Sekunden
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-lg backdrop-blur-sm">
        <p className="text-slate-600 dark:text-slate-400">Lade Statusdaten...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Fehler: {error}</p>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-lg backdrop-blur-sm border border-slate-200 dark:border-slate-700">
      <div className="space-y-6">
        {/* Header mit Gesamtstatus */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            System Status
          </h2>
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

        {/* Seiten Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
            Seiten Status
          </h3>
          <div className="space-y-3">
            {Object.entries(health.pages).map(([page, status]) => (
              <div 
                key={page}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    status.status 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {page}
                  </span>
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

        {/* Letzte Aktualisierung */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Letzte Aktualisierung: {new Date(health.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
