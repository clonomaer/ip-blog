import _ from 'lodash'
import { fromEvent, ReplaySubject } from 'rxjs'
import { filter, mergeMap } from 'rxjs/operators'
import { StorageAPI, WindowLocalStorageEvent } from 'types'
import { MemoryCache } from './memory-cache'
import { config } from '../configs'
import { Window$ } from 'observables/window'

type ObservablesCache = { [key: string]: ReplaySubject<string | null> }

export class BrowserLocalStorageAPI implements StorageAPI {
    private observablesMemoryCacheKey = 'browserLocalStorageObservables'
    constructor(private memoryCache: MemoryCache) {
        if (!this.memoryCache.has(this.observablesMemoryCacheKey)) {
            this.memoryCache.store(this.observablesMemoryCacheKey, {})
        }
    }
    private async _write(key: string, value: any): Promise<void> {
        localStorage.setItem(
            config.BrowserLocalStorageCacheKey.concat(key),
            value,
        )
    }
    private _makeObservable(key: string, observables: ObservablesCache): void {
        observables[key] = new ReplaySubject<string | null>(1)
        const observable = observables[key]!

        observable.subscribe({
            next: value => {
                if (value === null) {
                    return this.delete(key)
                }
                return this._write(key, value)
            },
        })
        //TODO: write this with observables and return EMPTY if there is no key matching it and see what happens
        this.getAllKeys()
            .then(keys => {
                if (keys.includes(key)) {
                    return this.read(key)
                }
                throw new Error(`key ${key} not defined`)
            })
            .then(value => {
                observable.next(value)
            })
            .catch(() => {
                //ignore
            })

        Window$.pipe(
            mergeMap(win => fromEvent<WindowLocalStorageEvent>(win, 'storage')),
            filter(
                ev => ev.key === config.BrowserLocalStorageCacheKey.concat(key),
            ),
            mergeMap(ev => this.read(ev.key)),
        ).subscribe({
            next: val => observable.next(val),
        })
    }

    public async write(key: string, value: string): Promise<void> {
        this.observe(key).next(value)
    }

    public async read(key: string): Promise<string | null> {
        return localStorage.getItem(
            config.BrowserLocalStorageCacheKey.concat(key),
        )
    }

    public async delete(key: string): Promise<void> {
        localStorage.removeItem(key)
    }

    public async getAllKeys(): Promise<string[]> {
        return Object.keys(localStorage).map(key =>
            key.replace(config.BrowserLocalStorageCacheKey, ''),
        )
    }

    public observe(key: string): ReplaySubject<string | null> {
        const observables = this.memoryCache.get<ObservablesCache>(
            this.observablesMemoryCacheKey,
        )
        if (!(key in observables)) {
            this._makeObservable(key, observables)
        }
        return observables[key]!
    }
}
