import _ from 'lodash';
import { AsyncMapper } from '../types';

export async function deepMapAsync(
    obj: unknown,
    asyncCallback: AsyncMapper,
): Promise<unknown> {
    const touched = await asyncCallback(obj);
    if (_.isObject(touched)) {
        let acc: unknown;
        if (_.isArray(touched)) {
            acc = [];
        } else {
            acc = {};
        }
        await Promise.all(
            _.entries(touched).map(async ([k, v]) => {
                (acc as { [x: string]: unknown })[k] = await deepMapAsync(
                    v,
                    asyncCallback,
                );
            }),
        );
        return acc;
    }
    return touched;
}
