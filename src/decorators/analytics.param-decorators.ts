import { get } from '../analytics.core';

export const FIELDS_METADATA = 'FIELDS_METADATA';

// Not sure if i need reflect-metadata yet...
export function Field(name: string): MethodDecorator {
    return (target: object, key: string, descriptor: PropertyDescriptor) => {
        descriptor.value = get(name);

        return descriptor;
    };
}
