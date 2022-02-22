import _ from 'lodash'
import { ReplaySubject } from 'rxjs'

export type AsyncMapper = (arg: unknown) => Promise<unknown>

type WrappedUnPromise<P> = P extends Promise<infer T>
    ? T
    : { [K in keyof P]: UnPromise<P[K]> }

export type UnPromise<P> = P extends WrappedUnPromise<unknown>
    ? P
    : WrappedUnPromise<P>

// type WrappedUnPromiseOrNot<P> = P | UnPromise<P>;

export type DictionaryElement<T> = T extends _.Dictionary<infer E> ? E : never

export type ArrayElement<T> = T extends (infer E)[] ? E : never

export type StorageAPIWriteOptions = { silent?: boolean }

export interface StorageAPI {
    write(
        key: string,
        value: string,
        options?: StorageAPIWriteOptions,
    ): Promise<void>
    read(key: string): Promise<string | null>
    delete(key: string): Promise<void>
    getAllKeys(): Promise<string[]>
    observe(key: string): ReplaySubject<string | null>
}

export interface CacheService {
    store(key: string, value: unknown): Promise<void>

    get<T = unknown>(key: string): Promise<T | UnPromise<T>>

    getDefault<T = unknown>(
        key: string,
        initializer: T,
    ): Promise<T | UnPromise<T>>

    remove(key: string): Promise<void>

    has(key: string): Promise<boolean>

    getAllKeys(): Promise<string[]>

    observe<T = unknown>(
        key: string,
        initializer?: T,
    ): ReplaySubject<T | UnPromise<T>>
}

export type WindowLocalStorageEvent = Event & { key: string; newValue: string }

export interface StackedCacheService<T = unknown> {
    store(key: string, value: T): Promise<void>

    get(key: string): Promise<T | UnPromise<T>>

    getDefault(key: string, init: T): Promise<T | UnPromise<T>>

    remove(key: string): Promise<void>

    has(key: string): Promise<boolean>

    getAllKeys(): Promise<string[]>

    observe(key: string, initializer?: T): ReplaySubject<T | UnPromise<T>>

    setMasterKey(key: string): void

    setSize(size: number): void

    clear(): Promise<void>
}
