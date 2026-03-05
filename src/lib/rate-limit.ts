interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.storage = new Map();
    this.config = config;
  }

  check(key: string): { isAllowed: boolean; remainingAttempts?: number; retryAfter?: number; message?: string } {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      this.storage.set(key, { attempts: 1, firstAttemptTime: now });
      return { isAllowed: true, remainingAttempts: this.config.maxAttempts - 1 };
    }

    if (entry.blockedUntil && now < entry.blockedUntil) {
      const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
      return { isAllowed: false, retryAfter, message: `Too many attempts. Please try again in ${retryAfter} seconds.` };
    }

    if (now - entry.firstAttemptTime > this.config.windowMs) {
      this.storage.set(key, { attempts: 1, firstAttemptTime: now });
      return { isAllowed: true, remainingAttempts: this.config.maxAttempts - 1 };
    }

    entry.attempts += 1;

    if (entry.attempts > this.config.maxAttempts) {
      entry.blockedUntil = now + this.config.blockDurationMs;
      this.storage.set(key, entry);
      const retryAfter = Math.ceil(this.config.blockDurationMs / 1000);
      return { isAllowed: false, retryAfter, message: `Too many attempts. Please try again in ${retryAfter} seconds.` };
    }

    this.storage.set(key, entry);
    return { isAllowed: true, remainingAttempts: this.config.maxAttempts - entry.attempts };
  }

  reset(key: string): void {
    this.storage.delete(key);
  }

  clearAll(): void {
    this.storage.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if ((!entry.blockedUntil || now > entry.blockedUntil) && now - entry.firstAttemptTime > this.config.windowMs) {
        this.storage.delete(key);
      }
    }
  }
}

export const authRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
});

export const signupRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
  blockDurationMs: 60 * 60 * 1000,
});

export const passwordResetRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000,
  blockDurationMs: 30 * 60 * 1000,
});

if (typeof window !== 'undefined') {
  setInterval(() => {
    authRateLimiter.cleanup();
    signupRateLimiter.cleanup();
    passwordResetRateLimiter.cleanup();
  }, 30 * 60 * 1000);
}
