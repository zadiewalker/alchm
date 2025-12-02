// Rate limiting utility for API endpoints
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    const validAttempts = attempts.filter(time => Date.now() - time < this.windowMs);
    return Math.max(0, this.maxAttempts - validAttempts.length);
  }
}

export const createRateLimiter = (maxAttempts?: number, windowMs?: number) => 
  new RateLimiter(maxAttempts, windowMs);