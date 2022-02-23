import { expect } from 'chai'
import { ipfs$ } from 'contexts/ipfs'
import { firstValueFrom, reduce } from 'rxjs'
import { ipfsTextFile$ } from './ipfs-file'

const testCid = 'QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A'
const testContent = `Hello, <YOUR NAME HERE>`

describe('ipfs file stream', () => {
    after(() => {
        ipfs$.subscribe(ipfs => {
            ipfs.stop()
        })
    })
    it('should be able to correctly read the file', async () => {
        const [file$] = ipfsTextFile$(testCid)
        expect(
            await firstValueFrom(
                file$.pipe(reduce((acc, curr) => acc + curr, '')),
            ),
        ).to.eq(testContent)

        return
    })
    it('should abort when signal is received', async () => {
        const [file$, signal] = ipfsTextFile$(testCid)
        signal.abort()
        expect(firstValueFrom(file$)).to.be.rejected
    })
})
