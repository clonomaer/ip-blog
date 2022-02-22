import _ from 'lodash'
import {
    distinctUntilChanged,
    map,
    Observable,
    OperatorFunction,
    ReplaySubject,
} from 'rxjs'
import { ValidationResults } from 'types'

export type RxControlledInput = {
    subject$: ReplaySubject<string>
    inputValidation$: Observable<ValidationResults<unknown>['validation']>
    data$: ReplaySubject<string>
}

export type RxControlledInputProps = {
    parser?: OperatorFunction<string, string>
    formatter?: OperatorFunction<string, string>
    validator?: OperatorFunction<string, ValidationResults>
    data$?: ReplaySubject<string>
}

export function makeRxControlledInput({
    parser = _.identity,
    formatter = _.identity,
    validator = map(x => ({ data: x, validation: { passed: true } })),
    data$ = new ReplaySubject<string>(),
}: RxControlledInputProps): RxControlledInput {
    const subject$ = new ReplaySubject<string>(1)
    data$.subscribe(subject$)
    const validation = subject$.pipe(
        distinctUntilChanged(),
        parser,
        distinctUntilChanged(),
        validator,
    )
    const inputValidation$ = validation.pipe(map(x => x.validation))

    validation
        .pipe(
            map(x => x.data),
            distinctUntilChanged(),
        )
        .subscribe(data$)

    subject$.pipe(distinctUntilChanged(), formatter).subscribe(subject$)
    return { subject$, inputValidation$, data$ }
}
