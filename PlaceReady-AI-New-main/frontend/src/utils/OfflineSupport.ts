// Offline support - Cache analysis for offline viewing
const CACHE_KEY_PREFIX = 'offline_analysis_';
const CACHE_VERSION = '1.0';

export interface CachedAnalysis {
  data: any;
  timestamp: string;
  version: string;
}

export class OfflineCache {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  saveAnalysis(analysis: any): boolean {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${this.userId}`;
      const cached: CachedAnalysis = {
        data: analysis,
        timestamp: new Date().toISOString(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cached));
      return true;
    } catch (error) {
      console.error('Error saving to cache:', error);
      return false;
    }
  }

  getAnalysis(): any | null {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${this.userId}`;
      const cachedJson = localStorage.getItem(cacheKey);
      if (!cachedJson) return null;

      const cached: CachedAnalysis = JSON.parse(cachedJson);
      
      // Check version compatibility
      if (cached.version !== CACHE_VERSION) {
        console.warn('Cache version mismatch, clearing cache');
        this.clearCache();
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  }

  clearCache(): boolean {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${this.userId}`;
      localStorage.removeItem(cacheKey);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  isOffline(): boolean {
    return !navigator.onLine;
  }

  async checkOnlineStatus(): Promise<boolean> {
    if (navigator.onLine) {
      // Try to fetch a small resource to confirm we're actually online
      try {
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

