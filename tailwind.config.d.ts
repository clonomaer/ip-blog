import { TailwindConfig } from 'tailwindcss/tailwind-config'
import { Screens, ValueTypeOfKey } from 'types'

type TailwindConfigJIT = TailwindConfig & { mode?: 'jit' }

type theme = ValueTypeOfKey<TailwindConfigJIT, 'theme'>

declare const config: Omit<Partial<TailwindConfigJIT>, 'theme'> & {
    theme: Omit<theme, 'screens' | 'spacing'> & {
        screens: { [x in Screens]: string }
        spacing: ValueTypeOfKey<theme, 'spacing'> & { 13: string }
    }
}
export = config
