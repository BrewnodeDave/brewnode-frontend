import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setAuth, clearAuth, isAuthenticated } from '../services/api';

// Don't mock the entire module, just test the exported functions
describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuth();
  });

  describe('setAuth', () => {
    it('sets authentication credentials', () => {
      setAuth('testuser', 'testpass');
      expect(isAuthenticated()).toBe(true);
    });

    it('clears authentication when username is null', () => {
      setAuth('testuser', 'testpass');
      expect(isAuthenticated()).toBe(true);
      
      setAuth(null, null);
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('clearAuth', () => {
    it('clears authentication credentials', () => {
      setAuth('testuser', 'testpass');
      expect(isAuthenticated()).toBe(true);
      
      clearAuth();
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no credentials are set', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when credentials are set', () => {
      setAuth('testuser', 'testpass');
      expect(isAuthenticated()).toBe(true);
    });
  });

});
