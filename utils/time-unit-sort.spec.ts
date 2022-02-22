import { expect } from 'chai'
import { TimeUnit } from 'types'
import { timeUnitSort } from './time-unit-sort'

describe('time unit sort', () => {
    it('should sort time units', () => {
        const source: { unit: TimeUnit }[] = [
            { unit: 'h' },
            { unit: 'm' },
            { unit: 'd' },
            { unit: 's' },
            { unit: 'y' },
        ]
        expect(source.sort(timeUnitSort)).to.deep.equal([
            { unit: 's' },
            { unit: 'm' },
            { unit: 'h' },
            { unit: 'd' },
            { unit: 'y' },
        ])
    })
})
