import { AsyncMapper } from '../types';

export function orderedAsyncChainMapFactory(mappers: AsyncMapper[]) {
    return async function orderedAsyncChainMapper(
        value: unknown,
    ): Promise<unknown> {
        let result = value;
        for (const mapper of mappers) {
            result = await mapper(result);
        }
        return result;
    };
}
