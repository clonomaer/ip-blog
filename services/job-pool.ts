import { config } from 'configs'
import { SENTINEL } from 'contexts/empty-sentinel'
import _ from 'lodash'
import { nanoid } from 'nanoid'
import { from, map, Observable, shareReplay, Subscription } from 'rxjs'
import { StreamCache } from './stream-cache'

type Job<T = unknown> = Observable<T> | Promise<T>
type JobControl = { job: Job; subscription: Subscription }

export class JobPool {
    private streamCacheKey: string = config.JobPoolMemoryCacheKey
    constructor(private streamCache: StreamCache) {
        //
    }
    add(key: string, job: Job, id?: string): string {
        if (_.isEmpty(id)) {
            id = nanoid()
        }
        this.streamCache
            .control<_.Dictionary<JobControl>>(this.streamCacheKey.concat(key))
            .next(prev => ({
                ...(prev === SENTINEL ? {} : prev),
                [id!]: {
                    job,
                    subscription: from(job).subscribe({
                        complete: () => this.remove(key, id!),
                        error: () => this.remove(key, id!),
                    }),
                },
            }))
        return id!
    }

    remove(key: string, id: string): void {
        this.streamCache
            .control<_.Dictionary<JobControl>>(this.streamCacheKey.concat(key))
            .next(prev =>
                _.reduce(
                    prev === SENTINEL ? {} : prev,
                    (acc, curr, _id) => ({
                        ...acc,
                        ...(_id !== id ? { [_id]: curr } : {}),
                    }),
                    {},
                ),
            )
    }

    observe(
        key: string,
    ): Observable<{ remaining: number; pool: _.Dictionary<JobControl> }> {
        return this.streamCache
            .observe<_.Dictionary<JobControl>>(this.streamCacheKey.concat(key))
            .pipe(
                map(x => ({ remaining: _.keys(x).length, pool: x })),
                shareReplay(1),
            )
    }
}
