import { TimeUnit } from 'types'

const timeUnitPriority: { [x in TimeUnit]: number } = {
    s: 0,
    m: 1,
    h: 2,
    d: 3,
    y: 4,
}

export function timeUnitSort(
    a: { unit: TimeUnit },
    b: { unit: TimeUnit },
): number {
    return timeUnitPriority[a.unit] - timeUnitPriority[b.unit]
}
