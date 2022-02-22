import { ImageProps } from 'next/image'
import { ReplaySubject, Subject } from 'rxjs'
import { ValueTypeOfKey } from 'types'

export type LoadingStatus = ReplaySubject<boolean>

export type Screens = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ClassName = string | { [className: string]: boolean } | ClassName[]

export type ImageSrc = ValueTypeOfKey<ImageProps, 'src'>

export type ControlStreamAction<K extends string = string, T = unknown> = {
    type: K
    data?: T
}

export type ControlStream<T extends ControlStreamAction> = Subject<T>

export type InferControlStreamActionTypes<
    C extends ControlStream<A>,
    A extends ControlStreamAction = C extends Subject<infer I> ? I : never,
> = A['type']

export type InferControlStreamActionDataType<
    A extends ControlStreamAction,
    K extends A['type'],
> = (A extends { type: K } ? A : never)['data']
