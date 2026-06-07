export interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2
};

export async function retryAsync<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const config = { ...DEFAULT_OPTIONS, ...options };
    let lastError: Error | undefined;
    let delayMs = config.initialDelayMs;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt < config.maxRetries) {
                console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delayMs}ms...`, lastError.message);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                delayMs = Math.min(delayMs * config.backoffMultiplier, config.maxDelayMs);
            }
        }
    }

    throw lastError || new Error('Retry failed with unknown error');
}
