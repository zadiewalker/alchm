/**
 * Test suite for EmotionalReportRefreshScheduler
 * Validates Monday/Wednesday/Friday refresh schedule
 */

import { EmotionalReportRefreshScheduler } from '../refresh-scheduler';

describe('EmotionalReportRefreshScheduler', () => {
  let scheduler: EmotionalReportRefreshScheduler;
  
  beforeEach(() => {
    scheduler = new EmotionalReportRefreshScheduler();
    // Clear localStorage
    localStorage.clear();
  });

  describe('getNextRefreshDate', () => {
    it('should return next Monday when current day is Sunday', () => {
      // Mock Sunday (day 0)
      const sunday = new Date('2024-01-07T10:00:00'); // A Sunday
      jest.spyOn(Date, 'now').mockReturnValue(sunday.getTime());
      
      const nextRefresh = scheduler.getNextRefreshDate();
      expect(nextRefresh.getDay()).toBe(1); // Monday
      expect(nextRefresh.getHours()).toBe(6); // 6 AM
    });

    it('should return next Wednesday when current day is Monday', () => {
      // Mock Monday (day 1)
      const monday = new Date('2024-01-08T10:00:00'); // A Monday
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      const nextRefresh = scheduler.getNextRefreshDate();
      expect(nextRefresh.getDay()).toBe(3); // Wednesday
    });

    it('should return next Friday when current day is Wednesday', () => {
      // Mock Wednesday (day 3)
      const wednesday = new Date('2024-01-10T10:00:00'); // A Wednesday
      jest.spyOn(Date, 'now').mockReturnValue(wednesday.getTime());
      
      const nextRefresh = scheduler.getNextRefreshDate();
      expect(nextRefresh.getDay()).toBe(5); // Friday
    });

    it('should return next Monday when current day is Friday', () => {
      // Mock Friday (day 5)
      const friday = new Date('2024-01-12T10:00:00'); // A Friday
      jest.spyOn(Date, 'now').mockReturnValue(friday.getTime());
      
      const nextRefresh = scheduler.getNextRefreshDate();
      expect(nextRefresh.getDay()).toBe(1); // Monday (next week)
    });
  });

  describe('shouldRefreshData', () => {
    it('should return true when no previous refresh timestamp exists', () => {
      const shouldRefresh = scheduler.shouldRefreshData('test_key');
      expect(shouldRefresh).toBe(true);
    });

    it('should return true on refresh day when not refreshed today', () => {
      // Mock Monday (refresh day)
      const monday = new Date('2024-01-08T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      // Set last refresh to previous day (Sunday)
      const sunday = new Date('2024-01-07T10:00:00');
      localStorage.setItem('test_key', sunday.toISOString());
      
      const shouldRefresh = scheduler.shouldRefreshData('test_key');
      expect(shouldRefresh).toBe(true);
    });

    it('should return false on refresh day when already refreshed today', () => {
      // Mock Monday (refresh day)
      const monday = new Date('2024-01-08T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      // Set last refresh to today
      localStorage.setItem('test_key', monday.toISOString());
      
      const shouldRefresh = scheduler.shouldRefreshData('test_key');
      expect(shouldRefresh).toBe(false);
    });

    it('should return false on non-refresh day when recently refreshed', () => {
      // Mock Tuesday (non-refresh day)
      const tuesday = new Date('2024-01-09T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(tuesday.getTime());
      
      // Set last refresh to yesterday (Monday - refresh day)
      const monday = new Date('2024-01-08T10:00:00');
      localStorage.setItem('test_key', monday.toISOString());
      
      const shouldRefresh = scheduler.shouldRefreshData('test_key');
      expect(shouldRefresh).toBe(false);
    });

    it('should return true after fallback period (7 days)', () => {
      // Mock current date
      const now = new Date('2024-01-15T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(now.getTime());
      
      // Set last refresh to 8 days ago
      const eightDaysAgo = new Date('2024-01-07T10:00:00');
      localStorage.setItem('test_key', eightDaysAgo.toISOString());
      
      const shouldRefresh = scheduler.shouldRefreshData('test_key');
      expect(shouldRefresh).toBe(true);
    });
  });

  describe('formatNextRefresh', () => {
    it('should return "Today" when next refresh is today', () => {
      // Mock Monday (refresh day) early morning
      const monday = new Date('2024-01-08T05:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      const formatted = scheduler.formatNextRefresh();
      expect(formatted).toBe('Today');
    });

    it('should return "Tomorrow" when next refresh is tomorrow', () => {
      // Mock Sunday, next refresh should be Monday (tomorrow)
      const sunday = new Date('2024-01-07T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(sunday.getTime());
      
      const formatted = scheduler.formatNextRefresh();
      expect(formatted).toBe('Tomorrow');
    });

    it('should return formatted date for future dates', () => {
      // Mock Monday, next refresh should be Wednesday
      const monday = new Date('2024-01-08T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      const formatted = scheduler.formatNextRefresh();
      expect(formatted).toMatch(/Wed/); // Should contain "Wed"
    });
  });

  describe('isRefreshDay', () => {
    it('should return true for Monday', () => {
      const monday = new Date('2024-01-08T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(monday.getTime());
      
      expect(scheduler.isRefreshDay()).toBe(true);
    });

    it('should return true for Wednesday', () => {
      const wednesday = new Date('2024-01-10T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(wednesday.getTime());
      
      expect(scheduler.isRefreshDay()).toBe(true);
    });

    it('should return true for Friday', () => {
      const friday = new Date('2024-01-12T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(friday.getTime());
      
      expect(scheduler.isRefreshDay()).toBe(true);
    });

    it('should return false for Tuesday', () => {
      const tuesday = new Date('2024-01-09T10:00:00');
      jest.spyOn(Date, 'now').mockReturnValue(tuesday.getTime());
      
      expect(scheduler.isRefreshDay()).toBe(false);
    });
  });

  describe('cache manager', () => {
    it('should store and retrieve data correctly', () => {
      const cacheManager = scheduler.getCacheManager('test_cache');
      const testData = { value: 'test' };
      
      cacheManager.set(testData);
      const retrieved = cacheManager.get();
      
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent data', () => {
      const cacheManager = scheduler.getCacheManager('nonexistent');
      const retrieved = cacheManager.get();
      
      expect(retrieved).toBeNull();
    });

    it('should handle cache suffixes correctly', () => {
      const cacheManager = scheduler.getCacheManager('test_cache');
      const testData = { value: 'test' };
      
      cacheManager.set(testData, 'suffix');
      const retrieved = cacheManager.get('suffix');
      
      expect(retrieved).toEqual(testData);
    });
  });
});