import { MutableRefObject, useRef } from 'react';

const sentinel = Symbol('first-initialization-sentinel');

export function useLazyRef<T>(initializer: () => T): MutableRefObject<T> {
    const ref = useRef<T | typeof sentinel>(sentinel);
    if (ref.current === sentinel) {
        ref.current = initializer();
    }
    return ref as MutableRefObject<T>;
}
