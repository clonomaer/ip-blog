export const SENTINEL = Symbol('empty-value-sentinel')
export type Sentinel = typeof SENTINEL

export function isSentinel(arg: unknown): arg is Sentinel {
    return arg === SENTINEL
}
