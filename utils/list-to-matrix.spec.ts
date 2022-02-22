import { expect } from 'chai'
import { listToMatrix } from './list-to-matrix'

describe('util/list-tp-matrix', () => {
    it('should convert the list to matrix correctly', () => {
        expect(listToMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], 3)).deep.eq([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [0, 1, 2],
        ])
        expect(listToMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], 3)).deep.eq([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [0, 1],
        ])
    })
})
