import _ from 'lodash'
import { ReplaySubject } from 'rxjs'
import { LazyEval } from 'types'
import { unLazy } from 'utils/un-lazy'

export class MemoryCache {
    private storage: { [key: string]: unknown } = {}
    private observables: { [key: string]: ReplaySubject<unknown> } = {}

    constructor() {
        //
    }

    private _makeObservable(key: string) {
        this.observables[key] = new ReplaySubject(1)
        const observable = this.observables[key]!
        try {
            observable.next(this.get(key))
        } catch {
            //ignore
        }
        observable.subscribe({
            next: value => this._store(key, value),
        })
    }

    private _store(key: string, value: unknown): void {
        this.storage[key] = value
    }

    /**
     * @description passing a function as a way to patch the current value might result in unexpected results if there are more than one parts of the code that are simultaneously doing the same, you should use the stream-cache instead, as it handles such situations properly.
     */
    public store<T = unknown>(
        key: string,
        value: ((prev: T | undefined) => T) | T,
    ): void {
        this.observe<T>(key).next(
            _.isFunction(value)
                ? value(
                      (() => {
                          try {
                              return this.get<T>(key)
                          } catch {
                              return undefined
                          }
                      })(),
                  )
                : value,
        )
    }

    public get<T>(key: string): T {
        if (!this.has(key)) {
            throw new Error(`key ${key} doesn't exist in MemoryCache`)
        }

        return this.storage[key] as T
    }

    public getDefault<T>(key: string, init: LazyEval<T>): T {
        if (this.has(key)) {
            return this.storage[key] as T
        }

        this.store(key, unLazy(init))
        return unLazy(init)
    }

    public remove(key: string): void {
        delete this.storage[key]
    }

    public has(key: string): boolean {
        return key in this.storage
    }

    public observe<T>(key: string): ReplaySubject<T> {
        if (!(key in this.observables)) {
            this._makeObservable(key)
        }
        return this.observables[key]! as ReplaySubject<T>
    }
}
