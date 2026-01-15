/**
 * usePersistedStorage - A hook for persistent data storage
 * 
 * This hook provides a unified interface for data persistence that:
 * 1. Tries to use the server API first (file-based persistence)
 * 2. Falls back to localStorage if API is unavailable
 * 3. Syncs data between API and localStorage
 * 4. Provides loading and error states
 * 
 * Also exports `useKV` as an alias for drop-in replacement of @github/spark
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// API base URL - empty string means same origin
const API_BASE = '';

// Debounce delay for saving (ms)
const SAVE_DEBOUNCE = 1000;

// Storage keys
export type StorageKey = 
  | 'members' 
  | 'chores' 
  | 'events' 
  | 'monthlyCompetitions' 
  | 'weeklyCompetitions' 
  | 'settings';

// Map of localStorage keys to API keys
const KEY_MAP: Record<string, StorageKey> = {
  'family-members': 'members',
  'chores': 'chores',
  'events': 'events',
  'monthly-competitions': 'monthlyCompetitions',
  'weekly-competitions': 'weeklyCompetitions',
  'settings': 'settings',
};

// Reverse map
const REVERSE_KEY_MAP: Record<StorageKey, string> = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k])
) as Record<StorageKey, string>;

interface StorageState {
  isLoading: boolean;
  isOnline: boolean;
  lastSaved: Date | null;
  error: string | null;
}

interface AllData {
  members: unknown[];
  chores: unknown[];
  events: unknown[];
  monthlyCompetitions: unknown[];
  weeklyCompetitions: unknown[];
  settings: Record<string, unknown>;
  _meta?: {
    version: number;
    updatedAt: string;
  };
}

// Global state for API availability
let apiAvailable: boolean | null = null;
let checkingApi = false;
const apiCheckPromise: { current: Promise<boolean> | null } = { current: null };

/**
 * Check if the API is available
 */
async function checkApiAvailability(): Promise<boolean> {
  if (apiAvailable !== null) return apiAvailable;
  if (checkingApi && apiCheckPromise.current) return apiCheckPromise.current;

  checkingApi = true;
  apiCheckPromise.current = (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      apiAvailable = response.ok;
    } catch {
      apiAvailable = false;
    }
    checkingApi = false;
    return apiAvailable;
  })();

  return apiCheckPromise.current;
}

/**
 * Fetch all data from the API
 */
async function fetchAllData(): Promise<AllData | null> {
  try {
    const response = await fetch(`${API_BASE}/api/data`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }
}

/**
 * Save a specific key to the API
 */
async function saveToApi(key: StorageKey, data: unknown): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/data/${key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('Error saving to API:', error);
    return false;
  }
}

/**
 * Get data from localStorage
 */
function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 */
function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Global storage state
const globalState: StorageState = {
  isLoading: true,
  isOnline: false,
  lastSaved: null,
  error: null,
};

// Listeners for state changes
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

/**
 * Hook to access global storage state
 */
export function useStorageState(): StorageState {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return globalState;
}

/**
 * Main hook for persisted storage
 * 
 * @param localStorageKey - The localStorage key (e.g., 'family-members')
 * @param defaultValue - Default value if no data exists
 * @returns [data, setData, { isLoading, isOnline, lastSaved, error }]
 */
export function usePersistedStorage<T>(
  localStorageKey: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const apiKey = KEY_MAP[localStorageKey] || localStorageKey as StorageKey;
  const [data, setDataInternal] = useState<T>(() => 
    getFromLocalStorage(localStorageKey, defaultValue)
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Initialize - check API and load data
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function initialize() {
      globalState.isLoading = true;
      notifyListeners();

      const isOnline = await checkApiAvailability();
      globalState.isOnline = isOnline;

      if (isOnline) {
        const allData = await fetchAllData();
        if (allData && apiKey in allData) {
          const apiData = allData[apiKey as keyof AllData];
          if (apiData !== undefined && apiData !== null) {
            // Sync API data to localStorage
            saveToLocalStorage(localStorageKey, apiData);
            setDataInternal(apiData as T);
          }
        }
      }

      globalState.isLoading = false;
      notifyListeners();
    }

    initialize();
  }, [localStorageKey, apiKey]);

  // Debounced save function
  const saveData = useCallback(async (newData: T) => {
    // Always save to localStorage immediately
    saveToLocalStorage(localStorageKey, newData);

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce API save
    saveTimeoutRef.current = setTimeout(async () => {
      if (apiAvailable) {
        const success = await saveToApi(apiKey, newData);
        if (success) {
          globalState.lastSaved = new Date();
          globalState.error = null;
        } else {
          globalState.error = 'Failed to save to server';
        }
        notifyListeners();
      }
    }, SAVE_DEBOUNCE);
  }, [localStorageKey, apiKey]);

  // Set data function
  const setData = useCallback((value: T | ((prev: T) => T)) => {
    setDataInternal(prev => {
      const newValue = typeof value === 'function' 
        ? (value as (prev: T) => T)(prev) 
        : value;
      saveData(newValue);
      return newValue;
    });
  }, [saveData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return [data, setData];
}

/**
 * Force a sync with the server
 */
export async function syncWithServer(): Promise<boolean> {
  const isOnline = await checkApiAvailability();
  if (!isOnline) return false;

  const allData = await fetchAllData();
  if (!allData) return false;

  // Update localStorage with server data
  for (const [apiKey, localKey] of Object.entries(REVERSE_KEY_MAP)) {
    const data = allData[apiKey as keyof AllData];
    if (data !== undefined) {
      saveToLocalStorage(localKey, data);
    }
  }

  globalState.lastSaved = new Date();
  notifyListeners();
  return true;
}

/**
 * Check if connected to server
 */
export async function checkServerConnection(): Promise<boolean> {
  apiAvailable = null; // Reset cache
  return checkApiAvailability();
}

/**
 * Drop-in replacement for @github/spark useKV hook
 * This allows the app to work with or without the server
 */
export const useKV = usePersistedStorage;
