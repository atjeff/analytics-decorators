import { GoogleAnalyticsHitTypes } from './ga-hit-types.enum';

export interface GenericHitEvent {
    hitType: GoogleAnalyticsHitTypes;
    fieldsObject: UniversalAnalytics.FieldsObject;
}
