import 'reflect-metadata';
import { get, getMany } from '../analytics.core';
import { FieldDecoratorsMetadata } from './models/field-decorators-metadata.model';

/**
 * Creates metadata key using propertyName
 *
 * @param {string} propertyName
 */
const createTrackerMetadataKey = (propertyName: string) => `__tracker_${propertyName}_parameters`;

/**
 * Decorates a method, replaces @Field() decorated params with the passed in tracker field value
 *
 * @export
 * @returns {MethodDecorator}
 */
export function UseTrackerFields(): MethodDecorator {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const metadataKey = createTrackerMetadataKey(propertyName);

            const requiredParameters: FieldDecoratorsMetadata[] = Reflect.getOwnMetadata(metadataKey, target, propertyName) || [];

            const modifiedArgs = requiredParameters.reduce((accumulator, { parameterIndex, fieldNames }) => {
                const trackerValue = Array.isArray(fieldNames) ? getMany(fieldNames) : get(fieldNames);

                if (trackerValue) {
                    accumulator[parameterIndex] = trackerValue;
                }

                return accumulator;
            }, args.slice());

            return originalMethod.apply(this, modifiedArgs);
        };

        return descriptor;
    };
}

/**
 * Sets tracker field value on function param
 *
 * @export
 * @param {(string | string[])} [fieldNames]
 * @returns {ParameterDecorator}
 */
export function Field(fieldNames?: string | string[]): ParameterDecorator {
    return (target: Object, propertyName: string, parameterIndex: number) => {
        const metadataKey = createTrackerMetadataKey(propertyName);
        const existingRequiredParameters: FieldDecoratorsMetadata[] = Reflect.getOwnMetadata(metadataKey, target, propertyName) || [];

        existingRequiredParameters.push({ parameterIndex, fieldNames });

        Reflect.defineMetadata(metadataKey, existingRequiredParameters, target, propertyName);
    };
}
