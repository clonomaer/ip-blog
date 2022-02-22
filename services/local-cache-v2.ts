import _ from 'lodash'
import {
    distinctUntilChanged,
    filter,
    from,
    mergeMap,
    ReplaySubject,
} from 'rxjs'
import { AsyncMapper, CacheService, StorageAPI, UnPromise } from 'types'
import { deepMapAsync } from '../utils/deep-map-async'
import { orderedAsyncChainMapFactory } from '../utils/ordered-async-chain-map'
import { MemoryCache } from './memory-cache'

export class LocalCache implements CacheService {
    private observablesMemoryCacheKey = 'localCacheObservables'

    constructor(
        private storage: StorageAPI,
        private serializers: AsyncMapper[],
        private deserializers: AsyncMapper[],
        private memoryCache: MemoryCache,
    ) {
        if (!this.memoryCache.has(this.observablesMemoryCacheKey)) {
            this.memoryCache.store(this.observablesMemoryCacheKey, {})
        }
    }

    private async deserialize<T = unknown>(
        item: string,
    ): Promise<T | UnPromise<T>> {
        return deepMapAsync(
            JSON.parse(item),
            orderedAsyncChainMapFactory(this.deserializers),
        ) as Promise<T | UnPromise<T>>
    }

    private async serialize(value: unknown): Promise<string> {
        return JSON.stringify(
            await deepMapAsync(
                value,
                orderedAsyncChainMapFactory(this.serializers),
            ),
        )
    }

    public async get<T = unknown>(key: string): Promise<T | UnPromise<T>> {
        const item = await this.storage.read(key)
        if (_.isNull(item) || item === 'undefined') {
            throw new Error(`key ${key} doesn't exist in LocalCache`)
        }
        return this.deserialize(item)
    }

    public async store(key: string, value: unknown): Promise<void> {
        this.storage.write(key, await this.serialize(value))
    }

    public async has(key: string): Promise<boolean> {
        return (await this.storage.getAllKeys()).includes(key)
    }

    public async getDefault<T = unknown>(
        key: string,
        initializer: T,
    ): Promise<T | UnPromise<T>> {
        if (await this.has(key)) {
            return this.get(key)
        }
        // no await
        this.store(key, initializer)
        return initializer
    }

    public async remove(key: string): Promise<void> {
        this.storage.delete(key)
    }

    public async getAllKeys(): Promise<string[]> {
        return this.storage.getAllKeys()
    }

    public observe<T>(
        key: string,
        initializer?: T,
    ): ReplaySubject<T | UnPromise<T>>

    public observe<E>(
        key: string,
        initializer: _.Dictionary<E>,
    ): ReplaySubject<_.Dictionary<E | UnPromise<E>>>

    public observe<E>(
        key: string,
        initializer: E[],
    ): ReplaySubject<(E | UnPromise<E>)[]>

    public observe<T = unknown>(
        key: string,
        initializer?: T,
    ): ReplaySubject<T | UnPromise<T>> {
        const observables = this.memoryCache.get<{
            [key: string]: ReplaySubject<T | UnPromise<T>>
        }>(this.observablesMemoryCacheKey)

        if (!(key in observables)) {
            observables[key] = new ReplaySubject<T | UnPromise<T>>(1)
            const observable = observables[key]!

            const promise = (
                _.isUndefined(initializer)
                    ? this.get<T>(key)
                    : this.getDefault<T>(key, initializer)
            ).catch(() => {
                // ignore
            })
            from(promise).subscribe({
                next: val => val !== undefined && observable.next(val),
            })

            const rawObservable = this.storage.observe(key)

            const rawSubWrite = rawObservable
                .pipe(
                    filter(_.negate(_.isNil)),
                    distinctUntilChanged(),
                    mergeMap<string, Promise<T | UnPromise<T>>>(x =>
                        this.deserialize<T>(x),
                    ),
                )
                .subscribe(observable)

            const rawSubDelete = rawObservable
                .pipe(filter(_.isNil))
                .subscribe(() => {
                    observable.error(
                        new Error(`key ${key} deleted from storage`),
                    )
                    ;[rawSubWrite, rawSubDelete].forEach(sub =>
                        sub.unsubscribe(),
                    )
                    delete observables[key]
                })

            observable
                .pipe(
                    distinctUntilChanged((prev, curr) => _.isEqual(prev, curr)),
                    mergeMap(x => this.serialize(x)),
                    distinctUntilChanged(),
                )
                .subscribe(rawObservable)
        }
        return observables[key]!
    }
}
