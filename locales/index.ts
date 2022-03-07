import { WebsiteLocale, WebsiteLocaleData } from './interface'
import { sep } from 'path'
import {
    asapScheduler,
    BehaviorSubject,
    catchError,
    map,
    mergeMap,
    mergeMapTo,
    observeOn,
    of,
    ReplaySubject,
    tap,
    throwError,
    timer,
} from 'rxjs'
import { ObservableError } from 'classes/observable-error'
import { flashToast$ } from 'contexts/flash-toast'

export const __$ = new ReplaySubject<WebsiteLocaleData>(1)
export const locale$ = new BehaviorSubject<string>('en')

locale$
    .pipe(
        mergeMap(_locale => import(`.${sep}${_locale}`)),
        map(x => x.default),
        mergeMap(x =>
            x instanceof WebsiteLocale
                ? of(x)
                : throwError(
                      () =>
                          new ObservableError(
                              `E0x02 invalid locale data for ${locale$.getValue()}`,
                          ),
                  ),
        ),
        catchError((err, observable) => {
            flashToast$.next(
                `${
                    err?.toString?.() ?? 'E0x03 error loading locale data'
                }, trying to load fallback locale`,
            )
            locale$.next('en')
            return observable.pipe(observeOn(asapScheduler))
        }),
        map(x => x.data),
    )
    .subscribe(__$)
