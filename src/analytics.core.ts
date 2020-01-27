import { AnalyticsEvent } from './types/analytics-event.model';
import { AnalyticsException } from './types/analytics-exception.model';
import { GoogleAnalyticsHitTypes } from './types/ga-hit-types.enum';
import { GoogleAnalyticsWindow } from './types/ga-window.model';
import { GenericHitEvent } from './types/generic-hit-event.model';
import { PageView } from './types/page-view.model';
import { TimingEvent } from './types/timing-event.model';
import { loadGoogleAnalyticsScript } from './util/load-ga.util';

let defaultTracker: UniversalAnalytics.Tracker = undefined;

export function sendEvent(event: AnalyticsEvent): void {
    if (windowHasGoogleAnalytics(window)) {
        defaultTracker?.send(GoogleAnalyticsHitTypes.event, event);
    }
}

export function sendPageView(pageView: PageView): void {
    if (windowHasGoogleAnalytics(window)) {
        const { path, title } = pageView;
        const extraFields: UniversalAnalytics.FieldsObject = {};

        if (title) {
            extraFields.title = title;
        }

        defaultTracker?.send(GoogleAnalyticsHitTypes.pageview, {
            page: path,
            ...extraFields
        });
    }
}

export function sendException(exception: AnalyticsException): void {
    if (windowHasGoogleAnalytics(window)) {
        defaultTracker?.send(GoogleAnalyticsHitTypes.exception, exception);
    }
}

export function sendHit(hitEvent: GenericHitEvent) {
    if (windowHasGoogleAnalytics(window)) {
        const { hitType, fieldsObject } = hitEvent;

        defaultTracker?.send(hitType, fieldsObject);
    }
}

export function sendTimingEvent(timingEvent: TimingEvent) {
    if (windowHasGoogleAnalytics(window)) {
        const { timingLabel, ...rest } = timingEvent;
        const fieldsObject: TimingEvent = rest;

        if (timingLabel) {
            fieldsObject.timingLabel = timingLabel;
        }

        defaultTracker?.send(GoogleAnalyticsHitTypes.timing, fieldsObject);
    }
}

export function get<T extends keyof UniversalAnalytics.FieldsObject>(fieldName: string): UniversalAnalytics.FieldsObject[T] {
    return defaultTracker?.get(fieldName);
}

export function getMany(fieldNames: string[]): Partial<UniversalAnalytics.FieldsObject> {
    return fieldNames.reduce((accumulator, fieldName) => {
        const fieldValue = defaultTracker?.get(fieldName);

        if (fieldValue) {
            accumulator[fieldName] = fieldValue;
        }

        return accumulator;
    }, {});
}

export function set(fieldName: string, fieldValue: any) {
    defaultTracker?.set(fieldName, fieldValue);
}

export function setMany(fieldsObject: UniversalAnalytics.FieldsObject): void {
    defaultTracker?.set(fieldsObject);
}

export function initialize(trackerId: string) {
    if (!windowHasGoogleAnalytics(window)) {
        loadGoogleAnalyticsScript();
    }

    defaultTracker = createAnalyticsTracker(trackerId);
}

export function createAnalyticsTracker(
    trackerId: string,
    cookieDomain: string = 'auto',
    trackerName?: string,
    options?: any
): UniversalAnalytics.Tracker {
    if (windowHasGoogleAnalytics(window)) {
        return window.ga.create(trackerId, 'auto');
    }
}

function windowHasGoogleAnalytics(window: any): window is GoogleAnalyticsWindow {
    return !!window.ga && typeof window.ga === 'function';
}
