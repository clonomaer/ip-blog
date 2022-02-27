type NotFunction<T> = T extends (...args: any[]) => any ? never : T

export type PredicateEval<T> = ((arg: any) => boolean) | NotFunction<T>

export type LazyEval<T> = T | ((...args: any[]) => T)

export type LazyEvalAsync<T> = LazyEval<T | Promise<T>>

export type Not<T, RestrictedBase> = T extends RestrictedBase ? never : T

export type ValueTypeOfKey<T, K extends keyof T> = Pick<T, K> extends {
    [x in K]?: infer R
}
    ? R
    : never

export type ValueTypeUnion<T> = keyof T extends infer K
    ? K extends keyof T
        ? T[K]
        : never
    : never

export type TimeUnit = 's' | 'm' | 'h' | 'd' | 'y'

export type NonUndefinable<T> = T extends undefined ? never : T
