import _ from 'lodash'

export function noZero(
    x: number | string | undefined | null,
    replacement: number,
): number {
    return Number(x) === 0 || _.isNaN(Number(x)) ? replacement : Number(x)
}
