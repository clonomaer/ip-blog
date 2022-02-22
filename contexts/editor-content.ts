import { config } from 'configs'
import {
    BehaviorSubject,
    EMPTY,
    from,
    map,
    merge,
    mergeMap,
    of,
    ReplaySubject,
    throttleTime,
} from 'rxjs'
import { localCache } from './local-cache'

export const editorContent$ = new ReplaySubject<string>(1)
export const editorContentChanged$ = new BehaviorSubject<() => string>(() => '')

editorContentChanged$
    .pipe(
        throttleTime(config.EditorContent.AutoSaveDelay, undefined, {
            leading: true,
            trailing: true,
        }),
        map(f => f()),
    )
    .subscribe(localCache.observe<string>(config.EditorContent.CacheKey))

merge(
    from(localCache.has(config.EditorContent.CacheKey)).pipe(
        mergeMap(has => (has ? EMPTY : of(''))),
    ),
    localCache.observe<string>(config.EditorContent.CacheKey),
).subscribe(editorContent$)
