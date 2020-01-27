import { AnalyticsEvent } from './models/analytics-event.model';
import { AnalyticsException } from './models/analytics-exception.model';
import { GoogleAnalyticsHitTypes } from './models/ga-hit-types.enum';
import { GoogleAnalyticsWindow } from './models/ga-window.model';
import { GenericHitEvent } from './models/generic-hit-event.model';
import { PageView } from './models/page-view.model';
import { TimingEvent } from './models/timing-event.model';
import { loadGoogleAnalyticsScript } from './util/load-ga.util';

/**
 * Reference to the default tracker created during initialize()
 *
 * @type {UniversalAnalytics.Tracker}
 */
let defaultTracker: UniversalAnalytics.Tracker;

/**
 * Sends tracking event to GA
 *
 * @export
 * @param {AnalyticsEvent} event
 */
export function sendEvent(event: AnalyticsEvent): void {
    defaultTracker?.send(GoogleAnalyticsHitTypes.event, event);
}

/**
 * Sends page view to GA
 *
 * @export
 * @param {PageView} pageView
 */
export function sendPageView(pageView: PageView): void {
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

/**
 * Sends exception event to GA
 *
 * @export
 * @param {AnalyticsException} exception
 */
export function sendException(exception: AnalyticsException): void {
    defaultTracker?.send(GoogleAnalyticsHitTypes.exception, exception);
}

/**
 * Sends any type of GoogleAnalyticsHitTypes to GA
 *
 * @export
 * @param {GenericHitEvent} hitEvent
 */
export function sendHit(hitEvent: GenericHitEvent): void {
    const { hitType, fieldsObject } = hitEvent;

    defaultTracker?.send(hitType, fieldsObject);
}

/**
 * Sends a timingEvent to GA
 *
 * @export
 * @param {TimingEvent} timingEvent
 */
export function sendTimingEvent(timingEvent: TimingEvent): void {
    const { timingLabel, ...rest } = timingEvent;
    const fieldsObject: TimingEvent = rest;

    if (timingLabel) {
        fieldsObject.timingLabel = timingLabel;
    }

    defaultTracker?.send(GoogleAnalyticsHitTypes.timing, fieldsObject);
}

/**
 * Gets a field from the defaultTracker
 *
 * @export
 * @template T
 * @param {string} fieldName
 * @returns {UniversalAnalytics.FieldsObject[T]}
 */
export function get<T extends keyof UniversalAnalytics.FieldsObject>(fieldName: string): UniversalAnalytics.FieldsObject[T] {
    return defaultTracker?.get(fieldName);
}

/**
 * Gets multiple fields from the defaultTracker
 *
 * @export
 * @param {string[]} fieldNames
 * @returns {Partial<UniversalAnalytics.FieldsObject>}
 */
export function getMany(fieldNames: string[]): Partial<UniversalAnalytics.FieldsObject> {
    return fieldNames.reduce((accumulator, fieldName) => {
        const fieldValue = defaultTracker?.get(fieldName);

        if (fieldValue) {
            accumulator[fieldName] = fieldValue;
        }

        return accumulator;
    }, {});
}

/**
 * Sets a field on the defaultTracker
 *
 * @export
 * @param {string} fieldName
 * @param {*} fieldValue
 */
export function set(fieldName: string, fieldValue: any): void {
    defaultTracker?.set(fieldName, fieldValue);
}

/**
 * Sets multiple fields on the defaultTracker
 *
 * @export
 * @param {UniversalAnalytics.FieldsObject} fieldsObject
 */
export function setMany(fieldsObject: UniversalAnalytics.FieldsObject): void {
    defaultTracker?.set(fieldsObject);
}

/**
 * Initializes this library, adds GA to the DOM if needed.
 *
 * @export
 * @param {string} trackerId
 */
export function initialize(trackerId: string): void {
    if (!windowHasGoogleAnalytics(window)) {
        loadGoogleAnalyticsScript();
    }

    defaultTracker = createAnalyticsTracker(trackerId);
}

/**
 * Creates a Google Analytics tracker
 *
 * @export
 * @param {string} trackerId
 * @param {string} [cookieDomain='auto']
 * @param {string} [trackerName]
 * @param {*} [options]
 * @returns {UniversalAnalytics.Tracker}
 */
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

/**
 * Asserts whether or not google analytics has been loaded
 *
 * @param {*} window
 * @returns {window is GoogleAnalyticsWindow}
 */
function windowHasGoogleAnalytics(window: any): window is GoogleAnalyticsWindow {
    return !!window.ga && typeof window.ga === 'function';
}
