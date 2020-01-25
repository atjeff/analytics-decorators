import { sendEvent } from '../analytics.core';
import { AnalyticsEventFactory } from '../types/analytics-event.model';

export function TrackAnalyticsEvent<T = any>(event: AnalyticsEventFactory<T>): MethodDecorator {
    return (target: object, key: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const analyticsEvent = typeof event === 'function' ? event(this) : event;

            if (analyticsEvent) {
                sendEvent(analyticsEvent);
            }

            return original.apply(this, args);
        };

        return descriptor;
    };
}
