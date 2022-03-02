import React from 'react'
import type { NextPage } from 'next'
import _ from 'lodash'
import { useLocale } from 'hooks/locale'
import Button from 'components/Button'
import { useRouter } from 'next/router'
import { useObservable } from 'hooks/observable'
import { ipfs$ } from 'contexts/ipfs'
import Input from 'components/Input'
import { useLazyRef } from 'hooks/lazy-ref'
import { map, pipe, Subject } from 'rxjs'
import { useCreateControl } from 'hooks/control/create-control'
import { InputControl } from 'components/InputWrapper'
import { getSubjectValue } from 'utils/get-subject-value'
import { isIPFS } from 'ipfs-core'
import { useRoutePush } from 'hooks/route-push'

const Home: NextPage = ({}) => {
    const __ = useLocale()
    const push = useRoutePush()
    const [cidInput$, cidInput] = useCreateControl<InputControl>()

    return (
        <div className="flex flex-col justify-center items-center overflow-auto">
            <div className="flex flex-col items-center space-y-5">
                <Button className="w-72 mb-20" job={push('new')}>
                    <i className="uil-file-plus-alt mr-2" />
                    {__?.landing.newPost}
                </Button>
                <div>{__?.landing.findCid}</div>
                <div className="flex children:flex-grow w-full items-start">
                    <Input
                        control={cidInput$}
                        validator={pipe(
                            map(x =>
                                isIPFS.cid(x)
                                    ? ''
                                    : __?.landing.wrongCid ?? 'wrong CID',
                            ),
                        )}
                        sanitizer={pipe(map(x => x.replace(/ */g, '')))}
                        label={__?.landing.Cid ?? ''}
                        spellCheck={false}
                        className={{
                            outer: 'w-full',
                            wrapper: 'w-full',
                            target: 'w-full',
                        }}
                    />
                    <Button
                        className="!mt-0 !mr-0 !py-0 !px-2  h-10"
                        disabled={
                            !cidInput.Value?.length ||
                            !_.isEmpty(cidInput.Error)
                        }
                        job={push(`/post?postId=${cidInput.Value ?? ''}`)}>
                        <i className="uil-angle-right-b text-2xl" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Home
