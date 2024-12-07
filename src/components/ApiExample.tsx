'use client';

import { useState, useEffect } from 'react';
import { fetchApi, postApi } from '@/utils/api';

interface HelloResponse {
  message: string;
}

export default function ApiExample() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    
    const response = await fetchApi<HelloResponse>('hello');
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setMessage(response.data.message);
    }
    
    setLoading(false);
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    
    const response = await postApi<HelloResponse>('hello', { 
      test: 'Hello from client!' 
    });
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setMessage(response.data.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          API Test
        </h2>
        {loading && (
          <p className="text-slate-600 dark:text-slate-400">Laden...</p>
        )}
        {error && (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        )}
        {message && (
          <p className="text-slate-700 dark:text-slate-300">{message}</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:opacity-50"
      >
        Test POST Request
      </button>
    </div>
  );
}
