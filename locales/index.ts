import { WebsiteLocale, WebsiteLocaleData } from './interface'
import { sep } from 'path'
import {
    catchError,
    map,
    mergeMap,
    Observable,
    of,
    ReplaySubject,
    throwError,
} from 'rxjs'
import { ObservableError } from 'classes/observable-error'
import { flashToast$ } from 'contexts/flash-toast'

function importAndValidateLocale$(locale: string): Observable<WebsiteLocale> {
    return of(locale).pipe(
        mergeMap(_locale => import(`.${sep}${_locale}`)),
        map(x => x.default),
        mergeMap(x =>
            x instanceof WebsiteLocale
                ? of(x)
                : throwError(
                      () =>
                          new ObservableError(
                              `E0x02 invalid locale data for ${locale}`,
                          ),
                  ),
        ),
    )
}

export const __$ = new ReplaySubject<WebsiteLocaleData>(1)

export function localeFactory$(
    locale: string = 'en',
): Observable<WebsiteLocaleData> {
    const res = importAndValidateLocale$(locale).pipe(
        catchError(err => {
            flashToast$.next(
                `${
                    err?.toString?.() ?? 'E0x03 error loading locale data'
                }, trying to load fallback locale`,
            )
            return importAndValidateLocale$('en')
        }),
        map(x => x.data),
    )
    res.subscribe(__$)
    return res
}
