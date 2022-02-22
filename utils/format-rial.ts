import { toPersianDigit } from './to-persian-digit'

export function formatRial(amount: number): string {
    return toPersianDigit(
        (amount / 10)
            .toLocaleString(undefined, { maximumFractionDigits: 0 })
            .replaceAll(',', '،'),
    )
}
