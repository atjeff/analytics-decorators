/**
 * Extends metadata using the reflect-metadata polyfill.
 *
 * @export
 * @template T
 * @param {string} key
 * @param {T} metadata
 * @param {*} target
 */
export function extendMetadata<T extends any[]>(key: string, metadata: T, target: any) {
    const previousValue = Reflect.getMetadata(key, target) || [];
    const value = [...previousValue, ...metadata];

    Reflect.defineMetadata(key, value, target);
}
