const CONVERSION_ARRAY = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigit(data: number | string): string {
    return CONVERSION_ARRAY.reduce(
        (acc, curr, index) => acc.replaceAll(String(index), curr),
        String(data),
    )
}
