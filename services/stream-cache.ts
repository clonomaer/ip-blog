import { SENTINEL, Sentinel } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { Observable, ReplaySubject, Subject, zip } from 'rxjs'

type Control<T> = Subject<T | ((prev: T | Sentinel) => T)>

export class StreamCache {
    private observables: { [key: string]: ReplaySubject<unknown> } = {}
    private controls: { [key: string]: Control<unknown> } = {}

    constructor() {
        //
    }

    private _makeObservable<T>(key: string) {
        this.observables[key] = new ReplaySubject(1)
        this.controls[key] = new Subject()
        this.observables[key]!.next(SENTINEL)
        zip(
            this.observables[key]! as ReplaySubject<T>,
            this.controls[key]! as Control<T>,
        ).subscribe(([data, control]) => {
            this.observables[key]?.next(
                _.isFunction(control) ? control(data) : control,
            )
        })
    }

    public remove(key: string): void {
        this.observables[key]?.complete()
        delete this.observables[key]
        this.controls[key]?.complete()
        delete this.controls[key]
    }

    public has(key: string): boolean {
        return key in this.observables
    }

    public observe<T>(key: string): Observable<T> {
        if (!this.has(key)) {
            this._makeObservable(key)
        }
        return this.observables[key]! as Observable<T>
    }

    public control<T>(key: string): Control<T> {
        if (!this.has(key)) {
            this._makeObservable(key)
        }
        return this.controls[key]! as Control<T>
    }
}
