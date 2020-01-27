import { get, getMany } from '../analytics.core';

/**
 * Sets specified field values into an object from GA tracker.
 *
 * @export
 * @param {string[]} fieldNames name from GA tracker
 * @returns {ParameterDecorator}
 */

// This isn't going to work, you can't change the values with a param decorator, only flag them with metadata to be replaced by a method decorator later.
export function Field(fieldNames?: string | string[]): ParameterDecorator {
    /**
     * @param {Object} target The prototype of the class being decorated.
     * @param {string} key The name of the method that contains the parameter being decorated.
     * @param {*} descriptor The index of that parameter being decorated.
     */
    return (target: object, key: string, descriptor: any) => {
        if (Array.isArray(fieldNames)) {
            descriptor.value = getMany(fieldNames);
        } else if (fieldNames) {
            descriptor.value = get(fieldNames);
        }

        return descriptor;
    };
}
