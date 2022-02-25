import { ImageProps } from 'next/image'
import { ReplaySubject, Subject } from 'rxjs'
import { ValueTypeOfKey } from 'types'

export type LoadingStatus = ReplaySubject<boolean>

export type Screens = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ClassName =
    | string
    | undefined
    | { [className: string]: boolean }
    | ClassName[]

export type ImageSrc = ValueTypeOfKey<ImageProps, 'src'>

export type ControlStreamData<
    Actions extends string,
    Payloads extends _.Dictionary<unknown>,
> = { action: Actions; payload?: Payloads[Actions] }

export type ControlStream<
    Actions extends string,
    Payloads extends _.Dictionary<unknown>,
> = Subject<ControlStreamData<Actions, Payloads>>
