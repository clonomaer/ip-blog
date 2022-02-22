function replacePersian(str: string): string {
    return str.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
}
function replaceArabic(str: string): string {
    return str.replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}
export function sanitizeNumbers(str: string): string {
    return replacePersian(replaceArabic(str))
}
export function onlyNumbers(str: string): string {
    return sanitizeNumbers(str).replace(/[^0-9\.]/g, '')
}
