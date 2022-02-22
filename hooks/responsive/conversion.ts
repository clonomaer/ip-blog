import _ from 'lodash'

export function PxPerRem(): number {
    if (typeof window === 'undefined') {
        return 16
    }
    return parseFloat(getComputedStyle(document.documentElement).fontSize)
}
export function RemToPx(rem: number | string): number {
    if (_.isString(rem) && rem.endsWith('px')) {
        return parseFloat(rem)
    }
    if (_.isString(rem) && !rem.endsWith('rem')) {
        throw new Error('only px and rem are supported for unit conversion')
    }
    return parseFloat(String(rem)) * PxPerRem()
}
