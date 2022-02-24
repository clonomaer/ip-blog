import { WebsiteLocale, WebsiteLocaleData } from './interface'
import { sep } from 'path'
import { catchError, map, mergeMap, Observable, of, throwError } from 'rxjs'
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

export function localeFactory$(
    locale: string = 'en',
): Observable<WebsiteLocaleData> {
    return importAndValidateLocale$(locale).pipe(
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
}
