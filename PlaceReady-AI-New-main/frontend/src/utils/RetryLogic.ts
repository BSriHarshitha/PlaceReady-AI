// Retry logic for API calls
export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  retryCondition?: (error: any) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  retryCondition: () => true,
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...defaultOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if condition is not met
      if (!opts.retryCondition(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = opts.exponentialBackoff
        ? opts.retryDelay * Math.pow(2, attempt)
        : opts.retryDelay;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// Retry condition helpers
export const shouldRetryOnNetworkError = (error: any): boolean => {
  return (
    !error.response ||
    error.response?.status >= 500 ||
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network')
  );
};

export const shouldRetryOnTimeout = (error: any): boolean => {
  return (
    error.code === 'ECONNABORTED' ||
    error.message?.includes('timeout') ||
    error.name === 'TimeoutError'
  );
};

