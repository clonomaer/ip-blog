import { config } from '../configs'

export type RetryFn<T extends any[], R> = (...args: T) => R | Promise<R>

export type Retry = <T extends any[], R>(
    p: RetryFn<T, R>,
    ...params: T
) => Promise<R>

export const Retry = async <T extends any[], R>(
    p: RetryFn<T, R>,
    ...params: T
): Promise<R> => {
    let lastErr: unknown = new Error(
        `operation failed after ${config.Retry.MaxAttempts} attempts`,
    )
    let delay = config.Retry.Timeout

    for (let attempts = 0; attempts <= config.Retry.MaxAttempts; attempts++) {
        if (attempts == config.Retry.MaxAttempts) {
            throw lastErr
        }

        if (attempts !== 0) {
            await new Promise<void>(resolve => {
                setTimeout(() => {
                    resolve()
                }, delay)
            })
            delay = Math.min(
                delay * config.Retry.ExponentialBackOff,
                config.Retry.MaxTimeout,
            )
        }

        try {
            return await p(...params)
        } catch (err) {
            lastErr = err
        }
    }

    throw lastErr
}
