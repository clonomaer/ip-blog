import { Subject } from 'rxjs'

export const flashToast$ = new Subject<
    string | { message: string; timeout: number }
>()
