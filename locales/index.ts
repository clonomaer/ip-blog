import { WebsiteLocale } from './interface'
import { sep } from 'path'

function importDefault(locale: string) {
    return import(`.${sep}${locale}`).then(x => x.default)
}

export async function __(locale?: string): Promise<WebsiteLocale> {
    if (locale) {
        try {
            return await importDefault(locale)
        } catch {}
    }
    return importDefault('en')
}
