import { AnalyticsEvent } from './types/analytics-event.model';
import { GoogleAnalyticsCommands } from './types/ga-commands.enum';
import { GoogleAnalyticsHitTypes } from './types/ga-hit-types.enum';
import { GoogleAnalyticsWindow } from './types/ga-window.model';
import { loadGoogleAnalyticsScript } from './util/load-ga.util';

let defaultTracker: UniversalAnalytics.Tracker = undefined;

export function executeGoogleAnalyticsCommand(command: GoogleAnalyticsCommands, event) {}

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

export function sendEvent(event: AnalyticsEvent): void {
    if (windowHasGoogleAnalytics(window)) {
        window.ga.create(GoogleAnalyticsCommands.send, GoogleAnalyticsHitTypes.event, event);
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

function windowHasGoogleAnalytics(window: any): window is GoogleAnalyticsWindow {
    return !!window.ga && typeof window.ga === 'function';
}
