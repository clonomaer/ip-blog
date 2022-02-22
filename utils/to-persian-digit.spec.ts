import { expect } from 'chai'
import { toPersianDigit } from './to-persian-digit'

describe('util/to-persian-digits', () => {
    it('should convert digits to persian', () => {
        expect(toPersianDigit(1234567890)).eq('۱۲۳۴۵۶۷۸۹۰')
    })
})
