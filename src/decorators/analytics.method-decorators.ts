import { sendEvent, sendException, sendHit, sendPageView, sendTimingEvent } from '../analytics.core';
import { AnalyticsEvent } from '../types/analytics-event.model';
import { AnalyticsException } from '../types/analytics-exception.model';
import { DecoratorOutput } from '../types/decorator-output.model';
import { GenericHitEvent } from '../types/generic-hit-event.model';
import { PageView } from '../types/page-view.model';
import { TimingEvent } from '../types/timing-event.model';

/**
 * Fire's a Google Analytics event on function execution
 *
 * @export
 * @template T Value of lexical this, passed into event if it's a function
 * @param {DecoratorOutput<AnalyticsEvent, T>} event
 * @returns {MethodDecorator}
 */
export function TrackAnalyticsEvent<T = any>(event: DecoratorOutput<AnalyticsEvent, T>): MethodDecorator {
    return createMethodDecorator<AnalyticsEvent, T>(event, sendEvent);
}

/**
 * Fire's a Google Analytics pageView on function execution
 *
 * @export
 * @template T Value of lexical this, passed into pageView if it's a function
 * @param {DecoratorOutput<PageView, T>} pageView
 * @returns {MethodDecorator}
 */
export function TrackAnalyticsPageView<T = any>(pageView: DecoratorOutput<PageView, T>): MethodDecorator {
    return createMethodDecorator<PageView, T>(pageView, sendPageView);
}

/**
 * Fire's a Google Analytics hitEvent on function execution
 *
 * @export
 * @template T Value of lexical this, passed into hitEvent if it's a function
 * @param {DecoratorOutput<GenericHitEvent, T>} hitEvent
 * @returns {MethodDecorator}
 */
export function TrackAnalyticsHit<T = any>(hitEvent: DecoratorOutput<GenericHitEvent, T>): MethodDecorator {
    return createMethodDecorator<GenericHitEvent, T>(hitEvent, sendHit);
}

/**
 * Fire's a Google Analytics exception on function execution
 *
 * @export
 * @template T Value of lexical this, passed into exception if it's a function
 * @param {DecoratorOutput<AnalyticsException, T>} exception
 * @returns {MethodDecorator}
 */
export function TrackAnalyticsException<T = any>(exception: DecoratorOutput<AnalyticsException, T>): MethodDecorator {
    return createMethodDecorator<AnalyticsException, T>(exception, sendException);
}

/**
 * Fire's a Google Analytics timingEvent on function execution
 *
 * @export
 * @template T Value of lexical this, passed into timingEvent if it's a function
 * @param {DecoratorOutput<TimingEvent, T>} timingEvent
 * @returns {MethodDecorator}
 */
export function TrackAnalyticsTimingEvent<T = any>(timingEvent: DecoratorOutput<TimingEvent, T>): MethodDecorator {
    return createMethodDecorator<TimingEvent, T>(timingEvent, sendTimingEvent);
}

/**
 * Creates a method decorator uses the passed in input to call a function within the core library.
 *
 * @template T Type of value resulting from valueOrFactory
 * @template K Type of input passed to valueOrFactory if it's a function
 * @param {DecoratorOutput<T, K>} valueOrFactory
 * @param {(result: T) => any} outputFunction
 * @returns {MethodDecorator}
 */
function createMethodDecorator<T = any, K = any>(
    valueOrFactory: DecoratorOutput<T, K>,
    outputFunction: (result: T) => any
): MethodDecorator {
    /**
     * @param {Function} target The method being decorated
     * @param {string} key The method name
     * @param {PropertyDescriptor} descriptor a property descriptor of the given property if it exists on the object, undefined otherwise. The property descriptor is obtained by invoking the Object.getOwnPropertyDescriptor() function.
     */
    return (target: Function, key: string, descriptor: PropertyDescriptor) => {
        const original = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const output = valueOrFactory instanceof Function ? valueOrFactory(this) : valueOrFactory;

            if (output) {
                outputFunction(output);
            }

            return original.apply(this, args);
        };

        return descriptor;
    };
}
