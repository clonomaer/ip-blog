import { expect } from 'chai'
import { formatRial } from './format-rial'

describe('util/format-rial', () => {
    it('should format rial correctly', () => {
        expect(formatRial(149889.44)).eq('۱۴،۹۸۹')
        expect(formatRial(149884.44)).eq('۱۴،۹۸۸')
    })
})
