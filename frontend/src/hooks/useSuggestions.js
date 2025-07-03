import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { debounce, API_BASE_URL } from '../utils/cn';

/**
 * Debounced suggestion hook for AI-powered autocomplete.
 *
 * @param {string} endpoint Relative endpoint (e.g. "/suggest/labels")
 * @param {string} query    Raw user input value
 * @param {number} delay    Debounce delay in ms (default 300ms)
 */
export const useSuggestions = (endpoint, query, delay = 300) => {
  // Debounced value so we don't hammer the backend
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = debounce((val) => setDebouncedQuery(val), delay);
    handler(query);
  }, [query, delay]);

  const fetcher = async () => {
    if (!debouncedQuery) return [];
    const { data } = await axios.get(`${API_BASE_URL}${endpoint}`, {
      params: { q: debouncedQuery },
    });
    return data;
  };

  return useQuery({
    queryKey: ['suggestions', endpoint, debouncedQuery],
    queryFn: fetcher,
    enabled: !!debouncedQuery,
    staleTime: 5 * 60 * 1000,
  });
};
